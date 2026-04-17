from app.models.users import User
from app.models.teams import Team
from app.models.players import Player
from app.models.games import Game

""" Check if a user has permissions to modify a team. For now, this is just if they are an officer of the team or a superuser. """


async def check_permissions_team(
    team: Team,
    user: User,
):
    if user.is_superuser:
        return True

    if str(user.id) in team.officerIds:
        return True

    return False


""" Check if a user has permissions to modify a player. For now, this is just if they are an officer of the player's team or a superuser. """


async def check_permissions_player(
    player: Player,
    user: User,
):
    if user.is_superuser:
        return True

    team = await Team.get(player.teamId)
    if team is not None and str(user.id) in team.officerIds:
        return True

    return False
