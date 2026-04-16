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
    print(f"Create player response: {response.json()}")
    assert response.status_code == 201

    created_player = response.json()

    assert created_player["first_name"] == test_player["first_name"]
    assert created_player["last_name"] == test_player["last_name"]
    assert created_player["team"]["id"] == team_id

    # Fetch the team's players to verify the new player is included
    team_response = await async_client.get(f"/teams/{team_id}")
    assert team_response.status_code == 200
    team_info = team_response.json()
    assert "players" in team_info
    print(f"Team info: {team_info}")
    assert any(player["_id"] == created_player["id"] for player in team_info["players"])

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


async def test_create_player_without_officer_permissions(
    async_client: AsyncClient, test_user, test_team, test_player
):
    created_team, _ = await test_create_team_with_auth(
        async_client, test_user, test_team
    )
    team_id = created_team["id"]

    # Register and login a different user who is not an officer of the team
    other_user_data = {
        "username": "2" + test_user["username"],
        "password": test_user["password"],
    }
    login_response_other = await test_register_and_login(async_client, other_user_data)
    access_token_other = login_response_other["access_token"]

    # Attempt to create a player on the team with a user that does not have officer permissions
    player_data = {**test_player, "team_id": team_id}
    response = await async_client.post(
        "/players/",
        json=player_data,
        headers={"Authorization": f"Bearer {access_token_other}"},
    )
    assert response.status_code == 403
