from beanie import Document, Link
from typing import Optional

from pydantic import BaseModel, Field

from app.models.teams import Team, TeamResponseBase
from app.models.users import User


class Player(Document):
    first_name: str
    last_name: str
    team: Link["Team"]
    user: Optional[Link[User]] = None
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
    user_id: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None


class PlayerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    team_id: Optional[str] = None
    user_id: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None


class PlayerResponseBase(BaseModel):
    id: str = Field(..., alias="id")
    first_name: str
    last_name: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None

    @classmethod
    async def from_document(cls, player: "Player") -> "PlayerResponseBase":
        await player.fetch_all_links()

        linked_user_id = None
        linked_user_email = None

        if player.user is not None and isinstance(player.user, User):
            linked_user_id = str(player.user.id)
            linked_user_email = player.user.email

        return cls(
            id=str(player.id),
            first_name=player.first_name,
            last_name=player.last_name,
            user_id=linked_user_id,
            user_email=linked_user_email,
            jersey_number=player.jersey_number,
            position=player.position,
            year=player.year,
        )


class PlayerResponse(PlayerResponseBase):
    team: TeamResponseBase

    @classmethod
    async def from_document(cls, player: "Player") -> "PlayerResponse":
        await player.fetch_all_links()

        linked_user_id = None
        linked_user_email = None

        if player.user is not None and isinstance(player.user, User):
            linked_user_id = str(player.user.id)
            linked_user_email = player.user.email

        return cls(
            id=str(player.id),
            first_name=player.first_name,
            last_name=player.last_name,
            user_id=linked_user_id,
            user_email=linked_user_email,
            team=await TeamResponseBase.from_document(player.team),  # type: ignore
            jersey_number=player.jersey_number,
            position=player.position,
            year=player.year,
        )