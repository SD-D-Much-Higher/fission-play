from __future__ import annotations

from typing import Annotated, Optional

from beanie import Document, Indexed
from pydantic import BaseModel, Field


class Team(Document):
    # Preserve the frontend mockData identifier shape as the primary document id.
    id: str
    name: Annotated[str, Indexed(unique=True)]
    description: Optional[str] = None
    sport: str
    members: int = 0
    image: Optional[str] = None
    bannerImage: Optional[str] = None
    officerIds: list[str] = Field(default_factory=list)

    class Settings:
        name = "teams"
        validate_on_save = True


class TeamCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    sport: str
    members: int = 0
    image: Optional[str] = None
    bannerImage: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sport: Optional[str] = None
    members: Optional[int] = None
    image: Optional[str] = None
    bannerImage: Optional[str] = None


class TeamResponseBase(BaseModel):
    id: str = Field(..., alias="id")
    name: str
    description: Optional[str] = None
    sport: str
    members: int
    image: Optional[str] = None
    bannerImage: Optional[str] = None
    # Legacy fields kept so current frontend API typings continue working.
    school: None = None
    coach_name: None = None

    @classmethod
    async def from_document(cls, team: Team) -> "TeamResponseBase":
        return cls(
            id=team.id,
            name=team.name,
            description=team.description,
            sport=team.sport,
            members=team.members,
            image=team.image,
            bannerImage=team.bannerImage,
        )


class TeamResponse(TeamResponseBase):
    @classmethod
    async def from_document(cls, team: Team) -> "TeamResponse":
        return cls(
            id=team.id,
            name=team.name,
            description=team.description,
            sport=team.sport,
            members=team.members,
            image=team.image,
            bannerImage=team.bannerImage,
        )
