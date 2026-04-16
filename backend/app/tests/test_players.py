"""
Test players route
"""

from httpx import AsyncClient
from .test_auth import test_register_and_login, test_create_team_with_auth


async def test_get_players_empty(async_client: AsyncClient):
    response = await async_client.get("/players/")
    assert response.status_code == 200
    msg = response.json()
    assert isinstance(msg, list)
    assert len(msg) == 0


async def test_create_player(
    async_client: AsyncClient, test_user, test_team, test_player
):
    team_data, access_token = await test_create_team_with_auth(
        async_client, test_user, test_team
    )
    team_id = team_data["id"]

    # Create player with team ID of team we created
    player_data = {**test_player, "team_id": team_id}

    response = await async_client.post(
        "/players/",
        json=player_data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 201

    created_player = response.json()

    assert created_player["first_name"] == test_player["first_name"]
    assert created_player["last_name"] == test_player["last_name"]
    assert created_player["team"]["id"] == team_id

    return created_player


async def test_create_player_without_auth(async_client: AsyncClient, test_player):
    response = await async_client.post("/players/", json=test_player)
    assert response.status_code == 401


async def test_create_player_with_nonexistent_team_id(
    async_client: AsyncClient, test_user, test_player
):
    # Register and login to get access token
    login_response = await test_register_and_login(async_client, test_user)
    access_token = login_response["access_token"]

    # Create player with non-existent team ID
    player_data = {
        **test_player,
        "team_id": "64b8f0f0f0f0f0f0f0f0f0f0",
    }  # Valid ObjectId format but does not exist in DB (hopefully)

    response = await async_client.post(
        "/players/",
        json=player_data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 404


async def test_create_player_with_invalid_team_id_format(
    async_client: AsyncClient, test_user, test_player
):
    # Register and login to get access token
    login_response = await test_register_and_login(async_client, test_user)
    access_token = login_response["access_token"]

    # Create player with invalid team ID format
    player_data = {
        **test_player,
        "team_id": "invalid-team-id",
    }  # Not a valid ObjectId format

    response = await async_client.post(
        "/players/",
        json=player_data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 400
