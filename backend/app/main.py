from fastapi import FastAPI

from app.routes import players, teams, games, auth
from app.db.database import init_db
from app.models.users import UserRead, UserCreate, UserUpdate
from auth.auth_user import auth_backend, current_active_user, fastapi_users

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
