import os
import asyncio
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.models.users import User
from app.models.players import Player
from app.models.teams import Team, TeamResponse
from app.models.players import PlayerResponse
from app.models.games import Game

Team.model_rebuild()
TeamResponse.model_rebuild()
Player.model_rebuild()
PlayerResponse.model_rebuild()

load_dotenv()


async def seed_database():
    client = AsyncMongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db_name = os.getenv("DB_NAME", "appdb")
    db = client[db_name]

    await init_beanie(
        database=db,
        document_models=[User, Team, Player, Game],
    )

    await Game.delete_all()
    await Player.delete_all()
    await Team.delete_all()

    soccer = Team(
        name="Men's Club Soccer",
        sport="Soccer",
        description="Competitive club soccer team at RPI.",
        coach_name="Coach Daniels",
        players=[],
    )

    basketball = Team(
        name="Men's Club Basketball",
        sport="Basketball",
        description="Club basketball team representing RPI.",
        coach_name="Coach Nguyen",
        players=[],
    )

    volleyball = Team(
        name="Men's Club Volleyball",
        sport="Volleyball",
        description="RPI club volleyball team.",
        coach_name="Coach Carter",
        players=[],
    )

    await soccer.insert()
    await basketball.insert()
    await volleyball.insert()

    players = [
        Player(
            first_name="Ethan",
            last_name="Miller",
            team=soccer,
            jersey_number=9,
            position="Forward",
            year="Sophomore",
        ),
        Player(
            first_name="Jordan",
            last_name="Lee",
            team=soccer,
            jersey_number=7,
            position="Midfielder",
            year="Junior",
        ),
        Player(
            first_name="Chris",
            last_name="Patel",
            team=basketball,
            jersey_number=4,
            position="Guard",
            year="Senior",
        ),
        Player(
            first_name="Maya",
            last_name="Rodriguez",
            team=volleyball,
            jersey_number=12,
            position="Setter",
            year="Sophomore",
        ),
    ]

    for player in players:
        await player.insert()

    games = [
        Game(
            home_team=soccer,
            opponent_name="Union Club Soccer",
            game_date=datetime(2026, 4, 2, 18, 0, tzinfo=timezone.utc),
            location="RPI Harkness Field",
            home_score=3,
            away_score=1,
            status="completed",
        ),
        Game(
            home_team=basketball,
            opponent_name="Union Club Basketball",
            game_date=datetime(2026, 4, 5, 19, 0, tzinfo=timezone.utc),
            location="East Campus Athletic Village (ECAV)",
            status="scheduled",
        ),
        Game(
            home_team=volleyball,
            away_team=basketball,
            game_date=datetime(2026, 4, 8, 20, 0, tzinfo=timezone.utc),
            location="East Campus Athletic Village (ECAV)",
            home_score=2,
            away_score=1,
            status="completed",
        ),
    ]

    for game in games:
        await game.insert()

    print("DB seeded successfully!")
    await client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
