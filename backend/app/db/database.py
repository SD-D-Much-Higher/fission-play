import os

from pymongo import AsyncMongoClient
from beanie import init_beanie

from dotenv import load_dotenv

from app.models.players import Player
from app.models.teams import Team
from app.models.games import Game


load_dotenv()

async def init_db():
    # Initialize the MongoDB client and Beanie ODM
    # Connect using env vars MONGO_URI and DB_NAME, with defaults if not set
    client = AsyncMongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db_name = os.getenv("DB_NAME", "appdb")

    await init_beanie(database=client[db_name], document_models=[Player, Team, Game])
