import os

from pymongo import AsyncMongoClient
from beanie import init_beanie

from dotenv import load_dotenv

from app.models.players import Player
from app.models.teams import Team
from app.models.games import Game


load_dotenv()

async def init_db():
    client = AsyncMongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))

    await init_beanie(database=client.db_name, document_models=[Player, Team, Game])
