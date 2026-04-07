from __future__ import annotations

from typing import Annotated, Optional

from beanie import Document, Indexed
from pydantic import BaseModel, Field


class Team(Document):
    name: Annotated[str, Indexed(unique=True)]
    sport: str
    description: Optional[str] = None
    coach_name: Optional[str] = None

    class Settings:
        name = "teams"
        validate_on_save = True


class TeamCreate(BaseModel):
    name: str
    sport: str
    description: Optional[str] = None
    coach_name: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    sport: Optional[str] = None
    description: Optional[str] = None
    coach_name: Optional[str] = None


class TeamResponse(BaseModel):
    id: str = Field(..., alias="id")
    name: str
    sport: str
    description: Optional[str] = None
    coach_name: Optional[str] = None

    @classmethod
    def from_document(cls, team: Team) -> "TeamResponse":
        return cls(
            id=str(team.id),
            name=team.name,
            sport=team.sport,
            description=team.description,
            coach_name=team.coach_name,
        )
