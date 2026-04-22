from typing import Annotated, cast

from beanie import Link
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.officer_request import OfficerRequest, OfficerRequestResponse
from app.models.teams import Team
from app.models.users import User
from auth.auth_user import current_active_user

router = APIRouter(prefix="/officer-requests", tags=["officer-requests"])


def _require_admin(current_user: User) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.get("/", response_model=list[OfficerRequestResponse])
async def list_officer_requests(
    current_user: Annotated[User, Depends(current_active_user)],
) -> list[OfficerRequestResponse]:
    """Return all pending officer requests. Admin only."""
    _require_admin(current_user)

    requests = await OfficerRequest.find(
        OfficerRequest.status == "pending"
    ).to_list()

    return [await OfficerRequestResponse.from_document(r) for r in requests]


@router.post(
    "/{request_id}/approve",
    response_model=OfficerRequestResponse,
)
async def approve_officer_request(
    request_id: str,
    current_user: Annotated[User, Depends(current_active_user)],
) -> OfficerRequestResponse:
    """Approve a pending officer request. Adds the user to team.officers."""
    _require_admin(current_user)

    req = await OfficerRequest.get(request_id, fetch_links=True)
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=409, detail="Request already resolved")

    user = cast(User, req.user)
    team = cast(Team, req.team)

    # Fetch team officers so we can check / update the list
    await team.fetch_link(Team.officers)
    officer_ids = {str(o.id) for o in team.officers}  # type: ignore

    if str(user.id) not in officer_ids:
        team.officers.append(cast(Link[User], user))  # type: ignore
        await team.save()

    req.status = "approved"
    await req.save()

    return await OfficerRequestResponse.from_document(req)


@router.post(
    "/{request_id}/reject",
    response_model=OfficerRequestResponse,
)
async def reject_officer_request(
    request_id: str,
    current_user: Annotated[User, Depends(current_active_user)],
) -> OfficerRequestResponse:
    """Reject a pending officer request."""
    _require_admin(current_user)

    req = await OfficerRequest.get(request_id)
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=409, detail="Request already resolved")

    req.status = "rejected"
    await req.save()

    return await OfficerRequestResponse.from_document(req)