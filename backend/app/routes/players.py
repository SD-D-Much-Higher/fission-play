from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from app.db.database import db
from app.models.players import PlayerCreate, PlayerInDB, PlayerUpdate

router = APIRouter(prefix="/players", tags=["players"])


@router.get("/", response_model=List[PlayerInDB])
async def get_players():
    players = await db.players.find().to_list(length=None)
    return players


@router.get("/{player_id}", response_model=PlayerInDB)
async def get_player(player_id: str):
    if not ObjectId.is_valid(player_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid player id",
        )

    player = await db.players.find_one({"_id": ObjectId(player_id)})
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    return player


@router.post("/", response_model=PlayerInDB, status_code=status.HTTP_201_CREATED)
async def create_player(player: PlayerCreate):
    player_dict = player.model_dump(exclude_none=True)

    result = await db.players.insert_one(player_dict)
    created_player = await db.players.find_one({"_id": result.inserted_id})

    return created_player


@router.put("/{player_id}", response_model=PlayerInDB)
async def update_player(player_id: str, player_update: PlayerUpdate):
    if not ObjectId.is_valid(player_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid player id",
        )

    update_data = player_update.model_dump(exclude_unset=True, exclude_none=True)
    if not update_data:
        existing_player = await db.players.find_one({"_id": ObjectId(player_id)})
        if not existing_player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found",
            )
        return existing_player

    result = await db.players.update_one(
        {"_id": ObjectId(player_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    updated_player = await db.players.find_one({"_id": ObjectId(player_id)})
    return updated_player


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_player(player_id: str):
    if not ObjectId.is_valid(player_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid player id",
        )

    result = await db.players.delete_one({"_id": ObjectId(player_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )