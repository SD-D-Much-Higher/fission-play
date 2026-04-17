from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.models.games import Game, GameResponse
from app.models.players import Player, PlayerResponse
from app.models.team_stats import TeamStats, TeamStatsResponse
from app.models.teams import Team, TeamCreate, TeamResponse, TeamUpdate
from auth.auth_role import check_permissions_team
from auth.auth_user import User, current_active_user

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/", response_model=list[TeamResponse])
async def get_teams() -> list[TeamResponse]:
    teams = await Team.find_all().to_list()
    return [await TeamResponse.from_document(team) for team in teams]


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: str) -> TeamResponse:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    return await TeamResponse.from_document(team)


@router.get("/{team_id}/players", response_model=list[PlayerResponse])
async def get_team_players(team_id: str) -> list[PlayerResponse]:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    players = await Player.find(Player.teamId == team_id).to_list()

    return [await PlayerResponse.from_document(player) for player in players]


@router.get("/{team_id}/games", response_model=list[GameResponse])
async def get_team_games(team_id: str) -> list[GameResponse]:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    games = await Game.find(Game.teamId == team_id).to_list()

    return [await GameResponse.from_document(game) for game in games]


@router.get("/{team_id}/stats", response_model=TeamStatsResponse | None)
async def get_team_stats(team_id: str) -> TeamStatsResponse | None:
    stats = await TeamStats.find(TeamStats.teamId == team_id).first_or_none()
    if stats is None:
        return None
    return await TeamStatsResponse.from_document(stats)


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    current_user: Annotated[User, Depends(current_active_user)], payload: TeamCreate
) -> TeamResponse:
    existing_id = await Team.get(payload.id)
    if existing_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A team with that id already exists",
        )

    existing = await Team.find(Team.name == payload.name).first_or_none()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A team with that name already exists",
        )

    team = Team(**payload.model_dump())
    team.officerIds.append(str(current_user.id))
    await team.insert()
    return await TeamResponse.from_document(team)


@router.patch("/{team_id}", response_model=TeamResponse)
async def update_team(
    current_user: Annotated[User, Depends(current_active_user)],
    team_id: str,
    payload: TeamUpdate,
) -> TeamResponse:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    if not await check_permissions_team(team, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this team",
        )

    updates = payload.model_dump(exclude_unset=True)

    for field_name, value in updates.items():
        setattr(team, field_name, value)

    await team.save()
    return await TeamResponse.from_document(team)


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    current_user: Annotated[User, Depends(current_active_user)], team_id: str
) -> None:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    if not await check_permissions_team(team, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this team",
        )

    await team.delete()