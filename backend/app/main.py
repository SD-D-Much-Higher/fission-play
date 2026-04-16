from fastapi import FastAPI

from app.routes import players, teams, games, auth
from app.db.database import init_db
from app.models.users import UserRead, UserUpdate
from auth.auth_user import fastapi_users

from app.models.teams import Team
from app.models.teams import TeamResponse
from app.models.players import Player
from app.models.players import PlayerResponse

Team.model_rebuild()
TeamResponse.model_rebuild()
Player.model_rebuild()
PlayerResponse.model_rebuild()

app = FastAPI(title="Fission Play API")
app.include_router(players.router)
app.include_router(teams.router)
app.include_router(games.router)
app.include_router(auth.router)

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
