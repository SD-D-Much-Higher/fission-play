from beanie import PydanticObjectId
from fastapi_users import schemas

from fastapi_users_db_beanie import BeanieBaseUserDocument


class User(BeanieBaseUserDocument):
    pass


class UserRead(schemas.BaseUser[PydanticObjectId]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass
