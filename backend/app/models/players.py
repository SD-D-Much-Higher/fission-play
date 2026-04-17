from typing import Optional

from beanie import Document
from pydantic import BaseModel, Field


class PlayerStats(BaseModel):
    gamesPlayed: int = 0
    points: int = 0
    rebounds: int = 0
    assists: int = 0


class Player(Document):
    id: str
    teamId: str
    name: str
    number: Optional[int] = None
    position: Optional[str] = None
    status: str = "active"
    stats: PlayerStats = Field(default_factory=PlayerStats)

    class Settings:
        name = "players"
        validate_on_save = True


class PlayerCreate(BaseModel):
    id: str
    teamId: str
    name: str
    number: Optional[int] = None
    position: Optional[str] = None
    status: str = "active"
    stats: PlayerStats = Field(default_factory=PlayerStats)


class PlayerUpdate(BaseModel):
    teamId: Optional[str] = None
    name: Optional[str] = None
    number: Optional[int] = None
    position: Optional[str] = None
    status: Optional[str] = None
    stats: Optional[PlayerStats] = None


def _split_name(full_name: str) -> tuple[str, str]:
    tokens = full_name.strip().split()
    if not tokens:
        return "", ""
    if len(tokens) == 1:
        return tokens[0], ""
    return tokens[0], " ".join(tokens[1:])


class PlayerResponse(BaseModel):
    # mockData-compatible fields
    id: str = Field(..., alias="id")
    teamId: str
    name: str
    number: Optional[int] = None
    position: Optional[str] = None
    status: str
    stats: PlayerStats
    # legacy compatibility fields (existing frontend usage)
    first_name: str
    last_name: str
    jersey_number: Optional[int] = None
    year: Optional[str] = None
    team: dict[str, str]

    @classmethod
    async def from_document(cls, player: Player) -> "PlayerResponse":
        first_name, last_name = _split_name(player.name)
        return cls(
            id=player.id,
            teamId=player.teamId,
            name=player.name,
            number=player.number,
            position=player.position,
            status=player.status,
            stats=player.stats,
            first_name=first_name,
            last_name=last_name,
            jersey_number=player.number,
            team={"id": player.teamId},
        )
