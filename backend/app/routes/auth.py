from typing import Any, Annotated, cast

from beanie import Link, PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi_users.manager import BaseUserManager

from auth.auth_user import auth_backend, fastapi_users, get_user_manager
from app.models.users import UserRead, UserCreate, UserUpdate, User
from app.models.teams import Team
from app.models.players import Player
from app.models.officer_request import OfficerRequest

router = APIRouter(prefix="/auth", tags=["auth"])

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
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


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    request: Request,
    payload: UserCreate,
    user_manager: Annotated[BaseUserManager, Depends(get_user_manager)],
) -> UserRead:
    if payload.requested_role not in {"club-member", "officer", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid requested_role",
        )

    team = None
    matched_player = None

    if payload.requested_role in {"club-member", "officer"}:
        if not payload.club_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="club_id is required for club-member and officer accounts",
            )

        team = await Team.get(payload.club_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Selected club not found",
            )

    if payload.requested_role == "club-member":
        name_parts = payload.full_name.strip().split(maxsplit=1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        players = await Player.find(
            cast(Any, Player.team).id == PydanticObjectId(payload.club_id),
            fetch_links=True,
        ).to_list()

        for player in players:
            if (
                player.first_name.strip().lower() == first_name.strip().lower()
                and player.last_name.strip().lower() == last_name.strip().lower()
            ):
                matched_player = player
                break

        if matched_player and matched_player.user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A player profile with this name is already linked to a user",
            )

    user = await user_manager.create(payload, safe=True, request=request)

    if payload.requested_role == "club-member" and team is not None:
        name_parts = payload.full_name.strip().split(maxsplit=1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        if matched_player:
            matched_player.user = cast(Link[User], user)
            await matched_player.save()
        else:
            new_player = Player(
                first_name=first_name,
                last_name=last_name,
                team=cast(Link[Team], team),
                user=cast(Link[User], user),
            )
            await new_player.insert()

    # When someone requests officer access, create a pending OfficerRequest
    # for an admin to review and approve.
    if payload.requested_role == "officer" and team is not None:
        officer_request = OfficerRequest(
            user=cast(Link[User], user),
            team=cast(Link[Team], team),
            full_name=payload.full_name,
        )
        await officer_request.insert()

    return UserRead(
        id=user.id,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        is_verified=user.is_verified,
        full_name=user.full_name,
        requested_role=user.requested_role,
        club_id=user.club_id,
    )
