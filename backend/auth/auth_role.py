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

    await team.fetch_link(Team.officers)

    if user in team.officers:
        return True

    return False


""" Check if a user has permissions to modify a player. For now, this is just if they are an officer of the player's team or a superuser. """


async def check_permissions_player(
    player: Player,
    user: User,
):
    if user.is_superuser:
        return True

    team = await player.fetch_link(Player.team)

    if user in team.officers:
        return True

    return False
