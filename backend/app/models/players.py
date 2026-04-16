from beanie import Document, Link
from typing import Optional, TYPE_CHECKING

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.teams import Team, TeamResponseBase


class Player(Document):
    first_name: str
    last_name: str
    team: Link["Team"]
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None

    class Settings:
        name = "players"
        validate_on_save = True
        max_nesting_depth = 2


class PlayerCreate(BaseModel):
    first_name: str
    last_name: str
    team_id: str
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None


class PlayerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    team_id: str
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None


class PlayerResponseBase(BaseModel):
    id: str = Field(..., alias="id")
    first_name: str
    last_name: str
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None

    @classmethod
    async def from_document(cls, player: Player) -> "PlayerResponseBase":
        return cls(
            id=str(player.id),
            first_name=player.first_name,
            last_name=player.last_name,
            jersey_number=player.jersey_number,
            position=player.position,
            year=player.year,
        )


class PlayerResponse(PlayerResponseBase):
    team: TeamResponseBase

    @classmethod
    async def from_document(cls, player: Player) -> "PlayerResponse":
        await player.fetch_all_links()

        return cls(
            id=str(player.id),
            first_name=player.first_name,
            last_name=player.last_name,
            team=await TeamResponseBase.from_document(player.team),  # type: ignore
            jersey_number=player.jersey_number,
            position=player.position,
            year=player.year,
        )
