from fastapi import APIRouter, HTTPException, status, Depends
from auth.auth_user import auth_backend, current_active_user, fastapi_users
from app.models.users import UserRead, UserCreate, UserUpdate


router = APIRouter(prefix="/auth", tags=["auth"])
router.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/jwt", tags=["auth"]
)
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_reset_password_router(),
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_verify_router(UserRead),
    tags=["auth"],
)
