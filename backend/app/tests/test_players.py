"""
Test players route
"""

from httpx import AsyncClient


async def test_root(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    msg = response.json()
    assert "message" in msg and msg["message"] == "Fission Play API running"


async def test_get_players(async_client: AsyncClient):
    response = await async_client.get("/players/")
    assert response.status_code == 200
    msg = response.json()
    assert isinstance(msg, list)
    assert len(msg) == 0
