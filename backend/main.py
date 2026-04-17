from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import players, teams, games, auth, stat_submissions
from app.db.database import init_db
from app.models.users import UserRead, UserUpdate
from auth.auth_user import fastapi_users

from app.models.teams import Team, TeamResponse
from app.models.players import Player, PlayerResponse

Team.model_rebuild()
TeamResponse.model_rebuild()
Player.model_rebuild()
PlayerResponse.model_rebuild()

app = FastAPI(title="Fission Play API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router)
app.include_router(teams.router)
app.include_router(games.router)
app.include_router(auth.router)
app.include_router(stat_submissions.router)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/")
def root():
    return {
        "message": "Fission Play API running",
    }