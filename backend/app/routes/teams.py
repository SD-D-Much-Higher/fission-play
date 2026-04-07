from fastapi import APIRouter, HTTPException, status

from app.models.teams import Team, TeamCreate, TeamResponse, TeamUpdate

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/", response_model=list[TeamResponse])
async def get_teams() -> list[TeamResponse]:
    teams = await Team.find_all().to_list()
    return [TeamResponse.from_document(team) for team in teams]


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: str) -> TeamResponse:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    return TeamResponse.from_document(team)


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(payload: TeamCreate) -> TeamResponse:
    existing = await Team.find(Team.name == payload.name).first_or_none()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A team with that name already exists",
        )

    team = Team(**payload.model_dump())
    await team.insert()
    return TeamResponse.from_document(team)


@router.patch("/{team_id}", response_model=TeamResponse)
async def update_team(team_id: str, payload: TeamUpdate) -> TeamResponse:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    updates = payload.model_dump(exclude_unset=True)

    for field_name, value in updates.items():
        setattr(team, field_name, value)

    await team.save()
    return TeamResponse.from_document(team)


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(team_id: str) -> None:
    team = await Team.get(team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    await team.delete()
