from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.routes import players, teams, games
from app.db.database import init_db

app = FastAPI(title="Fission Play API")
app.include_router(players.router)
app.include_router(teams.router)
app.include_router(games.router)


@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/")
def root():
    return {
        "message": "Fission Play API running",
    }

