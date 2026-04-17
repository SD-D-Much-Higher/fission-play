from __future__ import annotations

from datetime import datetime
from typing import Optional

from beanie import Document, Link
from pydantic import BaseModel, Field, model_validator

from app.models.teams import Team, TeamResponseBase


class Game(Document):
    home_team: Link[Team]
    away_team: Optional[Link[Team]] = None
    opponent_name: Optional[str] = None
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
    away_team_id: Optional[str] = None
    opponent_name: Optional[str] = None
    game_date: datetime
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: str = "scheduled"

    @model_validator(mode="after")
    def validate_opponent(self) -> "GameCreate":
        if not self.away_team_id and not self.opponent_name:
            raise ValueError("Either away_team_id or opponent_name must be provided")
        if self.away_team_id and self.opponent_name:
            raise ValueError("Provide only one of away_team_id or opponent_name")
        if self.away_team_id and self.home_team_id == self.away_team_id:
            raise ValueError("home_team_id and away_team_id must be different")
        return self


class GameUpdate(BaseModel):
    home_team_id: Optional[str] = None
    away_team_id: Optional[str] = None
    opponent_name: Optional[str] = None
    game_date: Optional[datetime] = None
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: Optional[str] = None

    @model_validator(mode="after")
    def validate_opponent(self) -> "GameUpdate":
        if self.away_team_id and self.opponent_name:
            raise ValueError("Provide only one of away_team_id or opponent_name")
        if (
            self.home_team_id is not None
            and self.away_team_id is not None
            and self.home_team_id == self.away_team_id
        ):
            raise ValueError("home_team_id and away_team_id must be different")
        return self


class GameResponse(BaseModel):
    id: str = Field(..., alias="id")
    home_team: TeamResponseBase
    away_team: Optional[TeamResponseBase] = None
    opponent_name: Optional[str] = None
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
    async def from_document(cls, game: Game) -> "GameResponse":
        await game.fetch_all_links()
        home_team = cls._require_team(game.home_team, "home_team")

        away_team_response = None
        if game.away_team is not None:
            away_team = cls._require_team(game.away_team, "away_team")
            away_team_response = await TeamResponseBase.from_document(away_team)

        return cls(
            id=str(game.id),
            home_team=await TeamResponseBase.from_document(home_team),
            away_team=away_team_response,
            opponent_name=game.opponent_name,
            game_date=game.game_date,
            location=game.location,
            home_score=game.home_score,
            away_score=game.away_score,
            status=game.status,
        )