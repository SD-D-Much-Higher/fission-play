from app.models.users import User
from app.models.teams import Team
from app.models.players import Player
from app.models.games import Game

""" Check if a user has permissions to modify a team. For now, this is just if they are an officer of the team or a superuser. """


async def check_admin(
    user: User,
):
    return user.requested_role == "admin"


async def check_permissions_team(
    team: Team,
    user: User,
):
    if user.requested_role == "admin":
        return True

    if str(user.club_id) == str(team.id):
        return True

    return False


""" Check if a user has permissions to modify a player. For now, this is just if they are an officer of the player's team or a superuser. """


async def check_permissions_player(
    player: Player,
    user: User,
):
    if user.requested_role == "admin":
        return True

    # player.team may already be a resolved Team object (when the player was
    # fetched with fetch_links=True). fetch_link() returns None in that case,
    # so we use the already-resolved value when available.
    team = (
        player.team
        if isinstance(player.team, Team)
        else await player.fetch_link(Player.team)
    )

    if team is None:
        return False

    if str(user.club_id) == str(team.id):
        return True

    return False
