from fastapi import APIRouter, HTTPException
from database import auth_users_collection
from auth.auth_utils import hash_password, verify_password
from auth.auth_models import RegisterRequest, LoginRequest

router = APIRouter()


# Register
@router.post("/register")
def register(user: RegisterRequest):
    existing_user = auth_users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "email": user.email,
        "username": user.username,
        "hashed_password": hash_password(user.password),
        "role": "player",
        "team_ids": [],
        "is_active": True,
    }

    auth_users_collection.insert_one(new_user)

    return {"message": "User registered successfully"}


# Login
@router.post("/login")
def login(user: LoginRequest):
    db_user = auth_users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "user_id": str(db_user["_id"]),
        "role": db_user["role"],
    }
