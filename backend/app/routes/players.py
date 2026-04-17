from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.models.players import Player, PlayerCreate, PlayerResponse, PlayerUpdate
from app.models.teams import Team

from auth.auth_user import User, current_active_user
from auth.auth_role import check_permissions_player, check_permissions_team

router = APIRouter(prefix="/players", tags=["players"])


@router.get("/", response_model=list[PlayerResponse])
async def get_players() -> list[PlayerResponse]:
    players = await Player.find_all().to_list()
    return [await PlayerResponse.from_document(player) for player in players]


@router.get("/{player_id}", response_model=PlayerResponse)
async def get_player(player_id: str) -> PlayerResponse:
    player = await Player.get(player_id)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    return await PlayerResponse.from_document(player)


@router.post("/", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
async def create_player(
    current_user: Annotated[User, Depends(current_active_user)],
    payload: PlayerCreate,
) -> PlayerResponse:
    team = await Team.get(payload.teamId)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    # Check permissions
    if not await check_permissions_team(team, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add a player to this team",
        )

    existing = await Player.get(payload.id)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A player with that id already exists",
        )

    player = Player(**payload.model_dump())
    await player.insert()

    return await PlayerResponse.from_document(player)


@router.patch("/{player_id}", response_model=PlayerResponse)
async def update_player(
    current_user: Annotated[User, Depends(current_active_user)],
    player_id: str,
    payload: PlayerUpdate,
) -> PlayerResponse:
    player = await Player.get(player_id)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    # Check permissions
    if not await check_permissions_player(player, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this player",
        )

    updates = payload.model_dump(exclude_unset=True)

    if "teamId" in updates:
        team_id = updates["teamId"]
        if team_id is not None:
            team = await Team.get(team_id)
            if team is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Team not found",
                )

    for field_name, value in updates.items():
        setattr(player, field_name, value)

    await player.save()

    return await PlayerResponse.from_document(player)


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_player(
    current_user: Annotated[User, Depends(current_active_user)], player_id: str
) -> None:
    player = await Player.get(player_id)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    # Check permissions
    if not await check_permissions_player(player, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this player",
        )

    await player.delete()
