from datetime import datetime, timezone
from typing import Any, cast

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
    ) -> "StatSubmissionResponse | None":
        await submission.fetch_all_links()

        team = (
            submission.team
            if isinstance(submission.team, Team)
            else await submission.fetch_link(StatSubmission.team)
        )
        player = (
            submission.player
            if isinstance(submission.player, Player)
            else await submission.fetch_link(StatSubmission.player)
        )

        # If either link resolved to None, the referenced document was deleted —
        # return None so the caller can skip this submission cleanly.
        if team is None or player is None:
            return None

        team = cast(Team, team)
        player = cast(Player, player)

        return cls(
            id=str(submission.id),
            team_id=str(team.id),
            team_name=team.name,
            player_id=str(player.id),
            player_name=f"{player.first_name} {player.last_name}",
            sport=submission.sport,
            stats=submission.stats,
            status=submission.status,
            created_at=submission.created_at,
        )