"""Tests fixtures."""

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from pymongo import AsyncMongoClient
from beanie import init_beanie

from main import app
from app.models.teams import Team
from app.models.players import Player
from app.models.games import Game

from app.db.database import User


TEST_MONGO_URI = "mongodb://localhost:27017/"
TEST_DB_NAME = "testdb"


@pytest_asyncio.fixture(scope="function")
async def test_db():
    client = AsyncMongoClient(TEST_MONGO_URI)
    db = client[TEST_DB_NAME]

    # Start every test with an empty database
    await client.drop_database(TEST_DB_NAME)

    await init_beanie(
        database=db,
        document_models=[User, Team, Player, Game],
    )

    yield db

    # Cleanup after the test too
    await client.drop_database(TEST_DB_NAME)
    await client.close()


@pytest_asyncio.fixture(scope="function")
async def async_client(test_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
