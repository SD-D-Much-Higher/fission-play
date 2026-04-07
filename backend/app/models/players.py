from beanie import Document, Link
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.teams import Team, TeamResponse


class Player(Document):
    first_name: str
    last_name: str
    team: Optional[Link[Team]] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None

    class Settings:
        name = "players"
        validate_on_save = True


class PlayerCreate(BaseModel):
    first_name: str
    last_name: str
    team_id: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None


class PlayerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    team_id: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None


class PlayerResponse(BaseModel):
    id: str = Field(..., alias="id")
    first_name: str
    last_name: str
    team: Optional[TeamResponse] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None

    @classmethod
    def from_document(cls, player: Player) -> "PlayerResponse":
        team_response = None
        if player.team and isinstance(player.team, Team):
            team_response = TeamResponse.from_document(player.team)

        return cls(
            id=str(player.id),
            first_name=player.first_name,
            last_name=player.last_name,
            team=team_response,
            jersey_number=player.jersey_number,
            position=player.position,
            year=player.year,
        )
