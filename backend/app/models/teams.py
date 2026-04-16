from __future__ import annotations

from typing import Annotated, Optional, List, TYPE_CHECKING

from beanie import Document, Indexed, Link, BackLink
from pydantic import BaseModel, Field

from app.models.users import User

if TYPE_CHECKING:
    from .players import Player


class Team(Document):
    name: Annotated[str, Indexed(unique=True)]
    sport: str
    description: Optional[str] = None
    school: Optional[str] = None
    coach_name: Optional[str] = None
    officers: List[Link[User]] = []
    players: List[BackLink["Player"]] = Field(
        json_schema_extra={"original_field": "team"}
    )

    class Settings:
        name = "teams"
        validate_on_save = True
        max_nesting_depth = 2


class TeamCreate(BaseModel):
    name: str
    sport: str
    description: Optional[str] = None
    school: Optional[str] = None
    coach_name: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    sport: Optional[str] = None
    description: Optional[str] = None
    school: Optional[str] = None
    coach_name: Optional[str] = None


class TeamResponseBase(BaseModel):
    id: str = Field(..., alias="id")
    name: str
    sport: str
    description: Optional[str] = None
    school: Optional[str] = None
    coach_name: Optional[str] = None

    @classmethod
    async def from_document(cls, team: Team) -> "TeamResponseBase":
        return cls(
            id=str(team.id),
            name=team.name,
            sport=team.sport,
            description=team.description,
            school=team.school,
            coach_name=team.coach_name,
        )


class TeamResponse(TeamResponseBase):
    players: List[Player] = []

    @classmethod
    async def from_document(cls, team: Team) -> "TeamResponse":
        await team.fetch_all_links()
        return cls(
            id=str(team.id),
            name=team.name,
            sport=team.sport,
            description=team.description,
            school=team.school,
            coach_name=team.coach_name,
            players=team.players,  # type: ignore
        )
