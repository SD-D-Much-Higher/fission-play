from typing import cast

from beanie import Link
from fastapi import APIRouter, HTTPException, status

from app.models.games import Game, GameCreate, GameResponse, GameUpdate
from app.models.teams import Team

router = APIRouter(prefix="/games", tags=["games"])


def require_team(value: Team | Link[Team], detail: str) -> Team:
    if not isinstance(value, Team):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )
    return value


@router.get("/", response_model=list[GameResponse])
async def get_games() -> list[GameResponse]:
    games = await Game.find_all(fetch_links=True).to_list()
    return [await GameResponse.from_document(game) for game in games]


@router.get("/{game_id}", response_model=GameResponse)
async def get_game(game_id: str) -> GameResponse:
    game = await Game.get(game_id, fetch_links=True)
    if game is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )
    return await GameResponse.from_document(game)


@router.post("/", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
async def create_game(payload: GameCreate) -> GameResponse:
    home_team = await Team.get(payload.home_team_id)
    if home_team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Home team not found",
        )

    away_team = None
    if payload.away_team_id:
        away_team = await Team.get(payload.away_team_id)
        if away_team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Away team not found",
            )

    game = Game(
        home_team=cast(Link[Team], home_team),
        away_team=cast(Link[Team], away_team) if away_team else None,
        opponent_name=payload.opponent_name,
        game_date=payload.game_date,
        location=payload.location,
        home_score=payload.home_score,
        away_score=payload.away_score,
        status=payload.status,
    )

    await game.insert()
    await game.fetch_all_links()

    return await GameResponse.from_document(game)


@router.patch("/{game_id}", response_model=GameResponse)
async def update_game(game_id: str, payload: GameUpdate) -> GameResponse:
    game = await Game.get(game_id, fetch_links=True)
    if game is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )

    updates = payload.model_dump(exclude_unset=True)

    if "home_team_id" in updates:
        home_team_id = updates.pop("home_team_id")
        home_team = await Team.get(home_team_id)
        if home_team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Home team not found",
            )
        game.home_team = cast(Link[Team], home_team)

    if "away_team_id" in updates:
        away_team_id = updates.pop("away_team_id")
        away_team = await Team.get(away_team_id)
        if away_team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Away team not found",
            )
        game.away_team = cast(Link[Team], away_team)

    await game.fetch_all_links()

    for field_name, value in updates.items():
        setattr(game, field_name, value)

    await game.save()
    await game.fetch_all_links()

    return await GameResponse.from_document(game)


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_game(game_id: str) -> None:
    game = await Game.get(game_id)
    if game is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )

    await game.delete()