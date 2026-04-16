from httpx import AsyncClient


async def test_register(async_client: AsyncClient):
    # Test user registration
    response = await async_client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )
    assert response.status_code == 201
    data = response.json()
    print(f"Registration response: {data}")


async def test_register_and_login(async_client: AsyncClient):
    # Test user registration
    response = await async_client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )
    assert response.status_code == 201
    data = response.json()
    print(f"Registration response: {data}")

    # Test user login
    response = await async_client.post(
        "/auth/jwt/login",
        data={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
