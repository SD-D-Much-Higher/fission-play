from fastapi import APIRouter, HTTPException, status

from app.models.games import Game, GameCreate, GameResponse, GameUpdate
from app.models.teams import Team

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/", response_model=list[GameResponse])
async def get_games() -> list[GameResponse]:
    games = await Game.find_all().to_list()
    return [await GameResponse.from_document(game) for game in games]


@router.get("/{game_id}", response_model=GameResponse)
async def get_game(game_id: str) -> GameResponse:
    game = await Game.get(game_id)
    if game is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )

    return await GameResponse.from_document(game)


@router.post("/", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
async def create_game(payload: GameCreate) -> GameResponse:
    team = await Team.get(payload.teamId)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    existing = await Game.get(payload.id)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A game with that id already exists",
        )

    game = Game(**payload.model_dump())

    await game.insert()

    return await GameResponse.from_document(game)


@router.patch("/{game_id}", response_model=GameResponse)
async def update_game(game_id: str, payload: GameUpdate) -> GameResponse:
    game = await Game.get(game_id)
    if game is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
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
        setattr(game, field_name, value)

    await game.save()

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
