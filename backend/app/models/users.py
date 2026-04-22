from typing import Optional

from beanie import PydanticObjectId
from fastapi_users import schemas
from fastapi_users_db_beanie import BeanieBaseUserDocument


class User(BeanieBaseUserDocument):
    full_name: Optional[str] = None
    requested_role: str = "club-member"
    club_id: Optional[str] = None


class UserRead(schemas.BaseUser[PydanticObjectId]):
    full_name: Optional[str] = None
    requested_role: str = "club-member"
    club_id: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    full_name: str
    requested_role: str = "club-member"
    club_id: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    full_name: Optional[str] = None
    requested_role: Optional[str] = None
    club_id: Optional[str] = None
