from datetime import datetime, timezone
from typing import Any

from beanie import Document, Link
from pydantic import BaseModel, Field

from app.models.teams import Team
from app.models.games import Game
from app.models.players import Player
from app.models.users import User


class StatSubmission(Document):
    team: Link[Team]
    game: Link[Game]
    player: Link[Player]
    submitted_by: Link[User]
    sport: str
    stats: dict[str, Any]
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "stat_submissions"
        validate_on_save = True


class StatSubmissionCreate(BaseModel):
    team_id: str
    game_id: str
    player_id: str
    sport: str
    stats: dict[str, Any]


class StatSubmissionResponse(BaseModel):
    id: str
    team_id: str
    team_name: str
    player_id: str
    player_name: str
    sport: str
    stats: dict[str, Any]
    status: str
    created_at: datetime

    @classmethod
    async def from_document(
        cls, submission: StatSubmission
    ) -> "StatSubmissionResponse":
        await submission.fetch_all_links()

        return cls(
            id=str(submission.id),
            team_id=str(submission.team.id),  # type: ignore
            team_name=submission.team.name,   # type: ignore
            player_id=str(submission.player.id),  # type: ignore
            player_name=f"{submission.player.first_name} {submission.player.last_name}",  # type: ignore
            sport=submission.sport,
            stats=submission.stats,
            status=submission.status,
            created_at=submission.created_at,
        )