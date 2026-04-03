from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]

# Collections
users_collection = db["users"]
teams_collection = db["teams"]
games_collection = db["games"]
schedules_collection = db["schedules"]
standings_collection = db["standings"]

auth_users_collection = db["auth_users"]

print("Connected to MongoDB!")