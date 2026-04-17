import os

from pymongo import AsyncMongoClient
from beanie import init_beanie, Document
from fastapi_users.db import BeanieBaseUser
from fastapi_users_db_beanie import BeanieUserDatabase


from dotenv import load_dotenv

from app.models.players import Player
from app.models.teams import Team
from app.models.games import Game
from app.models.users import User
from app.models.stat_submissions import StatSubmission


load_dotenv()


async def get_user_db():
    yield BeanieUserDatabase(User)


async def init_db():
    # Initialize the MongoDB client and Beanie ODM
    # Connect using env vars MONGO_URI and DB_NAME, with defaults if not set
    client = AsyncMongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db_name = os.getenv("DB_NAME", "appdb")

    await init_beanie(
        database=client[db_name],
        document_models=[Player, Team, Game, User, StatSubmission]
    )