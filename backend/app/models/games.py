from __future__ import annotations

from datetime import datetime
from typing import Optional

from beanie import Document, Link
from pydantic import BaseModel, Field, model_validator

from app.models.teams import Team, TeamResponse


class Game(Document):
    home_team: Link[Team]
    away_team: Link[Team]
    game_date: datetime
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: str = "scheduled"

    class Settings:
        name = "games"
        validate_on_save = True


class GameCreate(BaseModel):
    home_team_id: str
    away_team_id: str
    game_date: datetime
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: str = "scheduled"

    @model_validator(mode="after")
    def validate_distinct_teams(self) -> "GameCreate":
        if self.home_team_id == self.away_team_id:
            raise ValueError("home_team_id and away_team_id must be different")
        return self


class GameUpdate(BaseModel):
    home_team_id: Optional[str] = None
    away_team_id: Optional[str] = None
    game_date: Optional[datetime] = None
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: Optional[str] = None

    @model_validator(mode="after")
    def validate_distinct_teams(self) -> "GameUpdate":
        if (
            self.home_team_id is not None
            and self.away_team_id is not None
            and self.home_team_id == self.away_team_id
        ):
            raise ValueError("home_team_id and away_team_id must be different")
        return self


class GameResponse(BaseModel):
    id: str = Field(..., alias="id")
    home_team: TeamResponse
    away_team: TeamResponse
    game_date: datetime
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: str

    @staticmethod
    def _require_team(team: Team | Link[Team], field_name: str) -> Team:
        if not isinstance(team, Team):
            raise ValueError(f"{field_name} link was not fetched")
        return team

    @classmethod
    def from_document(cls, game: Game) -> "GameResponse":
        home_team = cls._require_team(game.home_team, "home_team")
        away_team = cls._require_team(game.away_team, "away_team")

        return cls(
            id=str(game.id),
            home_team=TeamResponse.from_document(home_team),
            away_team=TeamResponse.from_document(away_team),
            game_date=game.game_date,
            location=game.location,
            home_score=game.home_score,
            away_score=game.away_score,
            status=game.status,
        )
