from beanie import PydanticObjectId, WriteRules
from fastapi import APIRouter, HTTPException, status, Depends
from typing import Any, cast, Annotated

from app.models.players import Player, PlayerResponse
from app.models.teams import Team, TeamCreate, TeamResponse, TeamUpdate
from app.models.games import Game, GameResponse

from auth.auth_user import User, current_active_user
from auth.auth_role import check_permissions_team

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/", response_model=list[TeamResponse])
async def get_teams() -> list[TeamResponse]:
    teams = await Team.find_all().to_list()
    return [await TeamResponse.from_document(team) for team in teams]


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: str) -> TeamResponse:
    team = await Team.get(team_id, fetch_links=True)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    return await TeamResponse.from_document(team)


@router.get("/{team_id}/players", response_model=list[PlayerResponse])
async def get_team_players(team_id: str) -> list[PlayerResponse]:
    team = await Team.get(team_id, fetch_links=True)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    players = await Player.find(
        cast(Any, Player.team).id == PydanticObjectId(team_id),
        fetch_links=True,
    ).to_list()

    return [await PlayerResponse.from_document(player) for player in players]


@router.get("/{team_id}/games", response_model=list[GameResponse])
async def get_team_games(team_id: str) -> list[GameResponse]:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    home_team_field = cast(Any, Game.home_team)
    away_team_field = cast(Any, Game.away_team)

    games = await Game.find(
        (
            (home_team_field.id == PydanticObjectId(team_id))
            | (away_team_field.id == PydanticObjectId(team_id))
        ),
        fetch_links=True,
    ).to_list()

    return [GameResponse.from_document(game) for game in games]


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    current_user: Annotated[User, Depends(current_active_user)], payload: TeamCreate
) -> TeamResponse:
    existing = await Team.find(Team.name == payload.name).first_or_none()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A team with that name already exists",
        )

    team = Team(**payload.model_dump())
    team.officers.append(current_user)
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

    # Check permissions
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

    # Check permissions
    if not await check_permissions_team(team, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this team",
        )

    await team.delete()
