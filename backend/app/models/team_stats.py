from beanie import Document
from pydantic import BaseModel, Field


class TeamStats(Document):
    teamId: str
    wins: int
    losses: int
    winPercentage: float
    activeRoster: int
    avgPointsFor: float

    class Settings:
        name = "teamStats"
        validate_on_save = True


class TeamStatsCreate(BaseModel):
    teamId: str
    wins: int
    losses: int
    winPercentage: float
    activeRoster: int
    avgPointsFor: float


class TeamStatsUpdate(BaseModel):
    wins: int | None = None
    losses: int | None = None
    winPercentage: float | None = None
    activeRoster: int | None = None
    avgPointsFor: float | None = None


class TeamStatsResponse(BaseModel):
    id: str = Field(..., alias="id")
    teamId: str
    wins: int
    losses: int
    winPercentage: float
    activeRoster: int
    avgPointsFor: float

    @classmethod
    async def from_document(cls, stats: TeamStats) -> "TeamStatsResponse":
        return cls(
            id=str(stats.id),
            teamId=stats.teamId,
            wins=stats.wins,
            losses=stats.losses,
            winPercentage=stats.winPercentage,
            activeRoster=stats.activeRoster,
            avgPointsFor=stats.avgPointsFor,
        )
