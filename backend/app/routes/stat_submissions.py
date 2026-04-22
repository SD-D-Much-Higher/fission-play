from typing import Annotated, cast

from beanie import Link
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.stat_submissions import (
    StatSubmission,
    StatSubmissionCreate,
    StatSubmissionResponse,
)
from app.models.teams import Team
from app.models.games import Game
from app.models.players import Player
from app.models.users import User
from auth.auth_user import current_active_user
from auth.auth_role import check_permissions_team

router = APIRouter(prefix="/stats", tags=["stats"])


@router.post(
    "/submit",
    response_model=StatSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_stats(
    payload: StatSubmissionCreate,
    current_user: Annotated[User, Depends(current_active_user)],
) -> StatSubmissionResponse:
    team = await Team.get(payload.team_id, fetch_links=True)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    game = await Game.get(payload.game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    player = await Player.get(payload.player_id, fetch_links=True)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    # Officer/admin can submit for anyone on their team
    if await check_permissions_team(team, current_user):
        pass
    else:
        # Regular club member can only submit for their own linked player profile
        if player.user is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This player is not linked to a user account",
            )

        if str(player.user.id) != str(current_user.id):  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Club members can only submit stats for themselves",
            )

    submission = StatSubmission(
        team=cast(Link[Team], team),
        game=cast(Link[Game], game),
        player=cast(Link[Player], player),
        submitted_by=current_user,
        sport=payload.sport,
        stats=payload.stats,
        status="pending",
    )

    await submission.insert()
    return await StatSubmissionResponse.from_document(submission)


@router.get(
    "/team/{team_id}/pending",
    response_model=list[StatSubmissionResponse],
)
async def get_pending_submissions(team_id: str) -> list[StatSubmissionResponse]:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    submissions = await StatSubmission.find(
        StatSubmission.status == "pending",
        fetch_links=True,
    ).to_list()

    filtered = []
    for submission in submissions:
        await submission.fetch_all_links()
        if str(submission.team.id) == team_id:  # type: ignore
            filtered.append(submission)
    return [await StatSubmissionResponse.from_document(s) for s in filtered]


@router.get(
    "/team/{team_id}/approved",
    response_model=list[StatSubmissionResponse],
)
async def get_approved_submissions(team_id: str) -> list[StatSubmissionResponse]:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    submissions = await StatSubmission.find(
        StatSubmission.status == "approved",
        fetch_links=True,
    ).to_list()

    filtered = []
    for submission in submissions:
        await submission.fetch_all_links()
        if str(submission.team.id) == team_id:  # type: ignore
            filtered.append(submission)

    return [await StatSubmissionResponse.from_document(s) for s in filtered]


@router.patch(
    "/{submission_id}/approve",
    response_model=StatSubmissionResponse,
)
async def approve_submission(submission_id: str) -> StatSubmissionResponse:
    submission = await StatSubmission.get(submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.status = "approved"
    await submission.save()
    return await StatSubmissionResponse.from_document(submission)


@router.patch(
    "/{submission_id}/reject",
    response_model=StatSubmissionResponse,
)
async def reject_submission(submission_id: str) -> StatSubmissionResponse:
    submission = await StatSubmission.get(submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.status = "rejected"
    await submission.save()
    return await StatSubmissionResponse.from_document(submission)
