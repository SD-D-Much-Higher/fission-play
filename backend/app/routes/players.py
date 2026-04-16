from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Annotated

from typing import cast
from beanie import Link

from app.models.players import Player, PlayerCreate, PlayerResponse, PlayerUpdate
from app.models.teams import Team

from auth.auth_user import User, get_current_active_user

router = APIRouter(prefix="/players", tags=["players"])


@router.get("/", response_model=list[PlayerResponse])
async def get_players() -> list[PlayerResponse]:
    players = await Player.find_all(fetch_links=True).to_list()
    return [PlayerResponse.from_document(player) for player in players]


@router.get("/{player_id}", response_model=PlayerResponse)
async def get_player(player_id: str) -> PlayerResponse:
    player = await Player.get(player_id, fetch_links=True)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    return PlayerResponse.from_document(player)


@router.post("/", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
async def create_player(
    current_user: Annotated[User, Depends(get_current_active_user)],
    payload: PlayerCreate,
) -> PlayerResponse:
    linked_team: Link[Team] | None = None

    if payload.team_id is not None:
        team = await Team.get(payload.team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )
        linked_team = cast(Link[Team], team)

    player = Player(
        first_name=payload.first_name,
        last_name=payload.last_name,
        team=linked_team,
        jersey_number=payload.jersey_number,
        position=payload.position,
        year=payload.year,
    )
    await player.insert()
    await player.fetch_all_links()

    return PlayerResponse.from_document(player)


@router.patch("/{player_id}", response_model=PlayerResponse)
async def update_player(player_id: str, payload: PlayerUpdate) -> PlayerResponse:
    player = await Player.get(player_id, fetch_links=True)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    updates = payload.model_dump(exclude_unset=True)

    if "team_id" in updates:
        team_id = updates.pop("team_id")
        if team_id is None:
            player.team = None
        else:
            team = await Team.get(team_id)
            if team is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Team not found",
                )
            player.team = cast(Link[Team], team)

    for field_name, value in updates.items():
        setattr(player, field_name, value)

    await player.save()
    await player.fetch_all_links()

    return PlayerResponse.from_document(player)


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_player(player_id: str) -> None:
    player = await Player.get(player_id)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    await player.delete()
