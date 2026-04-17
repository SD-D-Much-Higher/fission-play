from __future__ import annotations

from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import BaseModel, Field


class GameScore(BaseModel):
    home: int
    away: int


class Game(Document):
    id: str
    teamId: str
    opponent: str
    date: str
    time: str
    location: str
    score: Optional[GameScore] = None
    result: Optional[str] = None

    class Settings:
        name = "games"
        validate_on_save = True


class GameCreate(BaseModel):
    id: str
    teamId: str
    opponent: str
    date: str
    time: str
    location: str
    score: Optional[GameScore] = None
    result: Optional[str] = None


class GameUpdate(BaseModel):
    teamId: Optional[str] = None
    opponent: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    score: Optional[GameScore] = None
    result: Optional[str] = None


def _legacy_game_datetime(date: str, time: str) -> str:
    parsed = datetime.strptime(f"{date} {time}", "%Y-%m-%d %I:%M %p")
    return parsed.isoformat() + "Z"


class GameResponse(BaseModel):
    # mockData-compatible fields
    id: str = Field(..., alias="id")
    teamId: str
    opponent: str
    date: str
    time: str
    location: str
    score: Optional[GameScore] = None
    result: Optional[str] = None
    # legacy compatibility fields (existing frontend usage)
    opponent_name: str
    game_date: str
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    away_team: None = None

    @classmethod
    async def from_document(cls, game: Game) -> "GameResponse":
        home_score = game.score.home if game.score else None
        away_score = game.score.away if game.score else None

        return cls(
            id=game.id,
            teamId=game.teamId,
            opponent=game.opponent,
            date=game.date,
            time=game.time,
            location=game.location,
            score=game.score,
            result=game.result,
            opponent_name=game.opponent,
            game_date=_legacy_game_datetime(game.date, game.time),
            home_score=home_score,
            away_score=away_score,
        )