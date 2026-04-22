"""Tests fixtures."""

import pytest
import pytest_asyncio
from datetime import datetime, timezone
from httpx import ASGITransport, AsyncClient
from pymongo import AsyncMongoClient
from beanie import init_beanie

from main import app
from app.models.teams import Team, TeamCreate
from app.models.players import Player, PlayerCreate
from app.models.games import Game, GameCreate
from app.models.users import UserCreate

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


@pytest.fixture(scope="module")
def test_user():
    return {"username": "user@example.com", "password": "password1"}


@pytest.fixture(scope="module")
def test_user_admin():
    return UserCreate(
        email="admin@example.com",
        full_name="Admin User",
        password="adminpassword1",
        is_superuser=True,
        requested_role="admin",
    )


@pytest.fixture(scope="module")
def test_team():
    return TeamCreate(
        name="Test Team",
        sport="Soccer",
        description="A team for testing purposes",
        school="Test University",
        coach_name="Test Coach",
    )


@pytest.fixture(scope="module")
def test_team2():
    return TeamCreate(
        name="Test Team 2",
        sport="Soccer",
        description="Another team for testing purposes",
        school="Test University",
        coach_name="Test Coach 2",
    )


@pytest.fixture(scope="module")
def test_game():
    return GameCreate(
        home_team_id="home_team_id_placeholder",
        away_team_id="away_team_id_placeholder",
        game_date=datetime(2024, 10, 1, 15, 0, 0, tzinfo=timezone.utc),
        location="Test Stadium",
        home_score=0,
        away_score=0,
        status="scheduled",
    )


@pytest.fixture(scope="module")
def test_player():
    return PlayerCreate(
        first_name="John",
        last_name="Doe",
        jersey_number=10,
        position="Forward",
        year="Senior",
        team_id="team_id_placeholder",
    )
