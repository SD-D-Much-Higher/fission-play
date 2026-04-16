from httpx import AsyncClient

from .test_auth import test_create_team_with_auth


async def test_get_games_empty(async_client: AsyncClient):
    response = await async_client.get("/games/")
    assert response.status_code == 200
    msg = response.json()
    assert isinstance(msg, list)
    assert len(msg) == 0


async def test_create_game(
    async_client: AsyncClient, test_user, test_team, test_team2, test_game
):
    # Create first team
    team1_data, access_token = await test_create_team_with_auth(
        async_client, test_user, test_team
    )
    team1_id = team1_data["id"]

    # Create second team
    # Create a team with authentication
    create_team2_response = await async_client.post(
        "/teams/",
        json=test_team2,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert create_team2_response.status_code == 201

    team2_data = create_team2_response.json()
    assert team2_data["name"] == test_team2["name"]
    team2_id = team2_data["id"]

    # Create game with the two teams
    game_data = {**test_game, "home_team_id": team1_id, "away_team_id": team2_id}

    response = await async_client.post(
        "/games/",
        json=game_data,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    print(f"Create game response: {response.json()}")
    assert response.status_code == 201

    created_game = response.json()

    assert created_game["home_team"]["id"] == team1_id
    assert created_game["away_team"]["id"] == team2_id
