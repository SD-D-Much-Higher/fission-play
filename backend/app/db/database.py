import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client.get_database(os.getenv("MONGO_DB_NAME", "rpi_club_sports"))

# Collections
users_collection = db["users"]
teams_collection = db["teams"]
games_collection = db["games"]
schedules_collection = db["schedules"]
standings_collection = db["standings"]

auth_users_collection = db["auth_users"]

print("Connected to MongoDB!")