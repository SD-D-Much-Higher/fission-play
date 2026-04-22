from httpx import AsyncClient
from app.models.users import UserCreate, UserRead
from app.models.teams import TeamCreate, TeamResponse


async def register_helper(async_client: AsyncClient, user: UserCreate) -> UserRead:
    print(f"Registering user with data: {user}")
    response = await async_client.post(
        "/auth/register",
        json=user.model_dump(),
    )
    assert response.status_code == 201, f"Registration failed: {response.text}"
    return UserRead.model_validate(response.json())


async def login_helper(async_client: AsyncClient, user: UserCreate):
    return await async_client.post(
        "/auth/jwt/login",
        data={"username": user.email, "password": user.password},
    )


async def test_register_admin(async_client: AsyncClient, test_user_admin: UserCreate):
    # Test user registration
    user_read = await register_helper(async_client, test_user_admin)
    assert user_read.id is not None
    assert user_read.email == test_user_admin.email

    print(f"Registered user: {user_read}")

    return user_read


async def test_register_and_login(
    async_client: AsyncClient, test_user_admin: UserCreate
):
    # Test user registration
    user_read = await register_helper(async_client, test_user_admin)

    # Test user login
    login_response = await login_helper(async_client, test_user_admin)

    assert login_response.status_code == 200

    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    return login_data


async def test_login_invalid_credentials(
    async_client: AsyncClient, test_user_admin: UserCreate
):
    # Register the user first to ensure they exist
    await test_register_admin(async_client, test_user_admin)

    # Test login with invalid credentials
    invalid_user_data = test_user_admin.model_copy()
    invalid_user_data.password = "wrongpassword"
    login_response = await login_helper(async_client, invalid_user_data)

    assert login_response.status_code == 400

    login_data = login_response.json()
    assert "detail" in login_data
    assert login_data["detail"] == "LOGIN_BAD_CREDENTIALS"


async def test_login_unregistered_user(
    async_client: AsyncClient, test_user_admin: UserCreate
):
    # Test login without registering the user first
    login_response = await login_helper(async_client, test_user_admin)

    assert login_response.status_code == 400

    login_data = login_response.json()
    assert "detail" in login_data
    assert login_data["detail"] == "LOGIN_BAD_CREDENTIALS"


async def test_create_team_with_auth(
    async_client: AsyncClient, test_user_admin: UserCreate, test_team: TeamCreate
):
    # Register and login to get access token
    login_response = await test_register_and_login(async_client, test_user_admin)
    access_token = login_response["access_token"]

    # Create a team with authentication
    create_team_response = await async_client.post(
        "/teams/",
        json=test_team.model_dump(),
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert create_team_response.status_code == 201

    created_team = TeamResponse.model_validate(create_team_response.json())
    print(f"Created team: {created_team}")
    assert created_team.name == test_team.name
    return created_team, access_token


async def test_create_team_without_auth(
    async_client: AsyncClient, test_team: TeamCreate
):
    # Attempt to create a team without authentication
    create_team_response = await async_client.post(
        "/teams/",
        json=test_team.model_dump(),
    )
    assert create_team_response.status_code == 401


"""
async def test_update_team_non_officer(async_client: AsyncClient, test_user_admin: UserCreate, test_team: TeamCreate):
    # Create a team with the test user as an officer
    created_team, _ = await test_create_team_with_auth(
        async_client, test_user_admin, test_team
    )
    team_id = created_team.id

    # Register and login a different user who is not an officer of the team
    other_user_data = {
        "username": "2" + test_user["username"],
        "password": test_user["password"],
    }
    login_response_other = await test_register_and_login(async_client, other_user_data)
    access_token_other = login_response_other["access_token"]

    # Attempt to update the team with a non-officer user
    update_response = await async_client.patch(
        f"/teams/{team_id}",
        json={"name": "Updated Team Name"},
        headers={"Authorization": f"Bearer {access_token_other}"},
    )
    assert update_response.status_code == 403
"""
