import os
import asyncio
import json
from pathlib import Path

from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.models.users import User
from app.models.players import Player
from app.models.teams import Team
from app.models.games import Game
from app.models.team_stats import TeamStats

Team.model_rebuild()
Player.model_rebuild()

load_dotenv()

REPO_ROOT = Path(__file__).resolve().parents[3]
FRONTEND_MONGO_DIR = REPO_ROOT / "frontend" / "src" / "data" / "mongo"


def load_json_array(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    if not isinstance(payload, list):
        raise ValueError(f"Expected JSON array in {path}")
    return payload


async def seed_database():
    client = AsyncMongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db_name = os.getenv("DB_NAME", "appdb")
    db = client[db_name]

    await init_beanie(
        database=db,
        document_models=[User, Team, Player, Game, TeamStats],
    )

    await TeamStats.delete_all()
    await Game.delete_all()
    await Player.delete_all()
    await Team.delete_all()

    teams_payload = load_json_array(FRONTEND_MONGO_DIR / "clubs.json")
    players_payload = load_json_array(FRONTEND_MONGO_DIR / "players.json")
    games_payload = load_json_array(FRONTEND_MONGO_DIR / "games.json")
    team_stats_payload = load_json_array(FRONTEND_MONGO_DIR / "teamStats.json")

    for team_data in teams_payload:
        await Team(**team_data).insert()

    for player_data in players_payload:
        await Player(**player_data).insert()

    for game_data in games_payload:
        await Game(**game_data).insert()

    for stats_data in team_stats_payload:
        await TeamStats(**stats_data).insert()

    print("DB seeded successfully!")
    await client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())