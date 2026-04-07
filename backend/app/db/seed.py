from backend.app.db.database import *

def seed_database():
    # Clear existing data
    users_collection.delete_many({})
    teams_collection.delete_many({})
    games_collection.delete_many({})
    schedules_collection.delete_many({})
    standings_collection.delete_many({})

    users = [
        {"_id": "user_001", "name": "Ethan Miller", "email": "millee@rpi.edu", "role": "player", "team_ids": ["team_soccer"]},
        {"_id": "user_002", "name": "Jordan Lee", "email": "leej@rpi.edu", "role": "player", "team_ids": ["team_soccer"]},
        {"_id": "user_003", "name": "Chris Patel", "email": "patelc@rpi.edu", "role": "player", "team_ids": ["team_basketball"]},
        {"_id": "user_004", "name": "Maya Rodriguez", "email": "rodrigm@rpi.edu", "role": "player", "team_ids": ["team_volleyball"]},
        {"_id": "user_010", "name": "Coach Daniels", "email": "coachd@rpi.edu", "role": "coach", "team_ids": ["team_soccer"]},
        {"_id": "user_011", "name": "Coach Nguyen", "email": "coachn@rpi.edu", "role": "coach", "team_ids": ["team_basketball"]}
    ]

    teams = [
        {
            "_id": "team_soccer",
            "name": "RPI Club Soccer",
            "sport": "Soccer",
            "school": "Rensselaer Polytechnic Institute",
            "players": ["user_001", "user_002"],
            "coach": "user_010"
        },
        {
            "_id": "team_basketball",
            "name": "RPI Club Basketball",
            "sport": "Basketball",
            "school": "Rensselaer Polytechnic Institute",
            "players": ["user_003"],
            "coach": "user_011"
        },
        {
            "_id": "team_volleyball",
            "name": "RPI Club Volleyball",
            "sport": "Volleyball",
            "school": "Rensselaer Polytechnic Institute",
            "players": ["user_004"],
            "coach": None
        },
        {
            "_id": "team_union_soccer",
            "name": "Union Club Soccer",
            "sport": "Soccer",
            "school": "Union College",
            "players": [],
            "coach": None
        }
    ]

    games = [
        {
            "_id": "game_001",
            "team_home": "team_soccer",
            "team_away": "team_union_soccer",
            "date": "2026-04-02T18:00:00Z",
            "location": "RPI Harkness Field",
            "score": {"home": 3, "away": 1},
            "status": "completed"
        },
        {
            "_id": "game_002",
            "team_home": "team_basketball",
            "team_away": "team_union_soccer",
            "date": "2026-04-05T19:00:00Z",
            "location": "East Campus Athletic Village (ECAV)",
            "score": {"home": 0, "away": 0},
            "status": "scheduled"
        },
        {
            "_id": "game_003",
            "team_home": "team_volleyball",
            "team_away": "team_basketball",
            "date": "2026-04-08T20:00:00Z",
            "location": "East Campus Athletic Village (ECAV)",
            "score": {"home": 2, "away": 1},
            "status": "completed"
        }
    ]

    schedules = [
        {
            "_id": "schedule_soccer",
            "team_id": "team_soccer",
            "games": ["game_001"]
        },
        {
            "_id": "schedule_basketball",
            "team_id": "team_basketball",
            "games": ["game_002", "game_003"]
        }
    ]

    standings = [
        {
            "_id": "standing_soccer_league",
            "league": "Capital Region Club Soccer",
            "teams": [
                {"team_id": "team_soccer", "wins": 1, "losses": 0, "draws": 0, "points": 3},
                {"team_id": "team_union_soccer", "wins": 0, "losses": 1, "draws": 0, "points": 0}
            ]
        }
    ]

    users_collection.insert_many(users)
    teams_collection.insert_many(teams)
    games_collection.insert_many(games)
    schedules_collection.insert_many(schedules)
    standings_collection.insert_many(standings)

    print("DB seeded successfully!")

if __name__ == "__main__":
    seed_database()