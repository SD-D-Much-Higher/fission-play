from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator


class PyObjectId(str):
    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

    @classmethod
    def validate(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return str(value)


class PlayerBase(BaseModel):
    first_name: str
    last_name: str
    team_id: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None  # Freshman, Sophomore, etc.

    @field_validator("team_id")
    @classmethod
    def validate_team_id(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not ObjectId.is_valid(value):
            raise ValueError("Invalid team_id")
        return value


class PlayerCreate(PlayerBase):
    pass


class PlayerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    team_id: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    year: Optional[str] = None

    @field_validator("team_id")
    @classmethod
    def validate_team_id(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not ObjectId.is_valid(value):
            raise ValueError("Invalid team_id")
        return value


class PlayerInDB(PlayerBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )
