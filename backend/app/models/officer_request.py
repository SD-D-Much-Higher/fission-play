from datetime import datetime, timezone
from typing import cast

from beanie import Document, Link
from pydantic import BaseModel, Field

from app.models.users import User
from app.models.teams import Team


class OfficerRequest(Document):
    user: Link[User]
    team: Link[Team]
    full_name: str
    status: str = "pending"  # pending | approved | rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "officer_requests"
        validate_on_save = True


class OfficerRequestResponse(BaseModel):
    id: str
    full_name: str
    user_id: str
    user_email: str
    club_id: str
    club_name: str
    status: str
    created_at: datetime

    @classmethod
    async def from_document(cls, req: OfficerRequest) -> "OfficerRequestResponse":
        await req.fetch_all_links()
        user = cast(User, req.user)
        team = cast(Team, req.team)
        return cls(
            id=str(req.id),
            full_name=req.full_name,
            user_id=str(user.id),
            user_email=user.email,
            club_id=str(team.id),
            club_name=team.name,
            status=req.status,
            created_at=req.created_at,
        )
