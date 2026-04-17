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
from auth.auth_user import User, current_active_user

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
    team = await Team.get(payload.team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    game = await Game.get(payload.game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    player = await Player.get(payload.player_id, fetch_links=True)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")

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

    filtered = [
        submission
        for submission in submissions
        if str(submission.team.ref.id) == team_id
    ]

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