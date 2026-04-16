from httpx import AsyncClient


async def register_helper(async_client: AsyncClient, user_data):
    return await async_client.post(
        "/auth/register",
        json={
            "email": user_data["username"],
            "password": user_data["password"],
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )


async def login_helper(async_client: AsyncClient, user_data):
    return await async_client.post(
        "/auth/jwt/login",
        data={"username": user_data["username"], "password": user_data["password"]},
    )


async def test_register(async_client: AsyncClient, test_user):
    # Test user registration
    register_response = await register_helper(async_client, test_user)
    assert register_response.status_code == 201
    register_data = register_response.json()
    assert "id" in register_data
    assert register_data["email"] == test_user["username"]

    print(f"Registered user: {register_data}")

    return register_data


async def test_register_and_login(async_client: AsyncClient, test_user):
    # Test user registration
    register_data = await test_register(async_client, test_user)

    # Test user login
    login_response = await login_helper(async_client, test_user)

    assert login_response.status_code == 200

    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    return login_data


async def test_login_invalid_credentials(async_client: AsyncClient, test_user):
    # Register the user first to ensure they exist
    await test_register(async_client, test_user)

    # Test login with invalid credentials
    invalid_user_data = {"username": test_user["username"], "password": "wrongpassword"}
    login_response = await login_helper(async_client, invalid_user_data)

    assert login_response.status_code == 400

    login_data = login_response.json()
    assert "detail" in login_data
    assert login_data["detail"] == "LOGIN_BAD_CREDENTIALS"


async def test_login_unregistered_user(async_client: AsyncClient):
    # Test login with unregistered user
    unregistered_user_data = {
        "username": "unregistered@example.com",
        "password": "wrongpassword",
    }
    login_response = await login_helper(async_client, unregistered_user_data)

    assert login_response.status_code == 400

    login_data = login_response.json()
    assert "detail" in login_data
    assert login_data["detail"] == "LOGIN_BAD_CREDENTIALS"


async def test_create_team_with_auth(async_client: AsyncClient, test_user, test_team):
    # Register and login to get access token
    login_response = await test_register_and_login(async_client, test_user)
    access_token = login_response["access_token"]

    # Create a team with authentication
    create_team_response = await async_client.post(
        "/teams/",
        json=test_team,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert create_team_response.status_code == 201

    created_team = create_team_response.json()
    assert created_team["name"] == test_team["name"]
    return created_team, access_token


async def test_create_team_without_auth(async_client: AsyncClient, test_team):
    # Attempt to create a team without authentication
    create_team_response = await async_client.post(
        "/teams/",
        json=test_team,
    )
    assert create_team_response.status_code == 401
