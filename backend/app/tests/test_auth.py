from httpx import AsyncClient


async def test_register_and_login(async_client: AsyncClient):
    # Test user registration
    response = await async_client.post(
        "/auth/register",
        json={
            "email": "test5@example.com",
            "password": "testpassword",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )
    assert response.status_code == 201
    data = response.json()
