import json

from httpx import AsyncClient

from .test_auth import test_create_team_with_auth
from app.models.teams import TeamCreate, TeamResponse
from app.models.games import GameCreate, GameResponse


async def test_get_games_empty(async_client: AsyncClient):
    response = await async_client.get("/games/")
    assert response.status_code == 200
    msg = response.json()
    assert isinstance(msg, list)
    assert len(msg) == 0


async def test_create_game(
    async_client: AsyncClient,
    test_user_admin,
    test_team: TeamCreate,
    test_team2: TeamCreate,
    test_game: GameCreate,
):
    # Create first team
    team1_data, access_token = await test_create_team_with_auth(
        async_client, test_user_admin, test_team
    )
    team1_id = team1_data.id

    # Create second team
    # Create a team with authentication
    create_team2_response = await async_client.post(
        "/teams/",
        json=test_team2.model_dump(),
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert create_team2_response.status_code == 201

    team2_data = TeamResponse.model_validate(create_team2_response.json())
    assert team2_data.name == test_team2.name
    team2_id = team2_data.id

    # Create game with the two teams
    game_data = test_game.model_copy()
    game_data.home_team_id = team1_id
    game_data.away_team_id = team2_id

    response = await async_client.post(
        "/games/",
        # json=game_data.model_dump_json(),  # Ensure datetime is serialized properly
        json=game_data.model_dump(
            mode="json"
        ),  # Have to do it this way for some reason involving datetime fields and maybe fields with null values
        headers={"Authorization": f"Bearer {access_token}"},
    )
    print(f"Create game response: {response.json()}")
    assert response.status_code == 201

    created_game = GameResponse.model_validate(response.json())

    assert created_game.home_team.id == team1_id
    assert created_game.away_team is not None and created_game.away_team.id == team2_id
