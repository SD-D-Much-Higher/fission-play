import os
import asyncio
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.models.users import User
from app.models.players import Player
from app.models.teams import Team, TeamResponse
from app.models.players import PlayerResponse
from app.models.games import Game
from app.models.stat_submissions import StatSubmission

Team.model_rebuild()
TeamResponse.model_rebuild()
Player.model_rebuild()
PlayerResponse.model_rebuild()

load_dotenv()


async def seed_database():
    client = AsyncMongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db_name = os.getenv("DB_NAME", "appdb")
    db = client[db_name]

    await init_beanie(
        database=db,
        document_models=[User, Team, Player, Game, StatSubmission],
    )

    await StatSubmission.delete_all()
    await Game.delete_all()
    await Player.delete_all()
    await Team.delete_all()

    # ── Teams ────────────────────────────────────────────────────────────────
    soccer = Team(
        name="Men's Club Soccer",
        sport="Soccer",
        description="Competitive club soccer team at RPI.",
        coach_name="Coach Daniels",
        players=[],
    )
    basketball = Team(
        name="Men's Club Basketball",
        sport="Basketball",
        description="Club basketball team representing RPI.",
        coach_name="Coach Nguyen",
        players=[],
    )
    volleyball = Team(
        name="Men's Club Volleyball",
        sport="Volleyball",
        description="RPI club volleyball team.",
        coach_name="Coach Carter",
        players=[],
    )
    hockey = Team(
        name="ACHA Men's Ice Hockey",
        sport="Ice Hockey",
        description="RPI's ACHA-affiliated men's ice hockey club competing at the collegiate level.",
        players=[],
    )
    badminton = Team(
        name="Badminton Club",
        sport="Badminton",
        description="Casual and competitive badminton for all skill levels at RPI.",
        players=[],
    )
    baseball = Team(
        name="Club Baseball",
        sport="Baseball",
        description="RPI club baseball team competing against other collegiate club programs.",
        players=[],
    )
    racquetball = Team(
        name="Club Racquetball",
        sport="Racquetball",
        description="Competitive racquetball club open to all RPI students.",
        players=[],
    )
    code_red = Team(
        name="Code Red",
        sport="Esports",
        description="RPI's premier esports and competitive gaming organization.",
        players=[],
    )
    ddr = Team(
        name="Dance Dance Revolution",
        sport="Dance",
        description="Rhythm gaming and dance club celebrating DDR and related games.",
        players=[],
    )
    equestrian = Team(
        name="Equestrian Team",
        sport="Equestrian",
        description="RPI's equestrian club competing in IHSA-sanctioned horse shows.",
        players=[],
    )
    judo = Team(
        name="Judo Club",
        sport="Judo",
        description="Traditional judo training and competition for RPI students.",
        players=[],
    )
    outing = Team(
        name="Outing Club",
        sport="Outdoor Recreation",
        description="Hiking, camping, and outdoor adventure trips for the RPI community.",
        players=[],
    )
    quadball = Team(
        name="Quadball",
        sport="Quadball",
        description="RPI's quadball (formerly quidditch) team competing in regional tournaments.",
        players=[],
    )
    crew = Team(
        name="Rensselaer Crew Club",
        sport="Rowing",
        description="Competitive rowing club representing RPI on the Hudson River.",
        players=[],
    )
    ballroom = Team(
        name="RPI Ballroom Dance",
        sport="Dance",
        description="Ballroom and Latin dance instruction and performance at RPI.",
        players=[],
    )
    boxing = Team(
        name="RPI Boxing Club",
        sport="Boxing",
        description="Fitness and competitive boxing training open to all RPI students.",
        players=[],
    )
    swim = Team(
        name="RPI Club Swim",
        sport="Swimming",
        description="Competitive club swimming for RPI students of all abilities.",
        players=[],
    )
    club_volleyball = Team(
        name="RPI Club Volleyball",
        sport="Volleyball",
        description="Co-ed recreational and competitive volleyball at RPI.",
        players=[],
    )
    cycling = Team(
        name="RPI Cycling",
        sport="Cycling",
        description="Road and mountain biking club for RPI students.",
        players=[],
    )
    dance_club = Team(
        name="RPI Dance Club",
        sport="Dance",
        description="Student-run dance club featuring a wide variety of dance styles.",
        players=[],
    )
    dance_team = Team(
        name="RPI Dance Team",
        sport="Dance",
        description="Performance dance team representing RPI at competitions and events.",
        players=[],
    )
    disc_golf = Team(
        name="RPI Disc Golf Club",
        sport="Disc Golf",
        description="Casual and competitive disc golf for RPI students.",
        players=[],
    )
    fencing = Team(
        name="RPI Fencing Club",
        sport="Fencing",
        description="Foil, épée, and sabre fencing instruction and competition at RPI.",
        players=[],
    )
    fishing = Team(
        name="RPI Fishing Club",
        sport="Fishing",
        description="Recreational and competitive fishing club for RPI students.",
        players=[],
    )
    juggling = Team(
        name="RPI Juggling and Unicycling",
        sport="Circus Arts",
        description="Learn juggling, unicycling, and other circus arts at RPI.",
        players=[],
    )
    kendo = Team(
        name="RPI Meitokukan Kendo Dojo",
        sport="Kendo",
        description="Traditional Japanese kendo training affiliated with the Meitokukan school.",
        players=[],
    )
    rudras = Team(
        name="RPI Rudras",
        sport="Bhangra",
        description="RPI's competitive Bhangra dance team performing at regional competitions.",
        players=[],
    )
    taekwondo = Team(
        name="RPI Tae Kwon Do Club",
        sport="Taekwondo",
        description="ATA-affiliated taekwondo club offering instruction for all belt levels.",
        players=[],
    )
    water_polo = Team(
        name="RPI Water Polo",
        sport="Water Polo",
        description="Competitive club water polo team representing RPI.",
        players=[],
    )
    womens_soccer = Team(
        name="RPI Women's Club Soccer",
        sport="Soccer",
        description="Competitive women's club soccer team at RPI.",
        players=[],
    )
    wrestling = Team(
        name="RPI Wrestling",
        sport="Wrestling",
        description="Folkstyle and freestyle wrestling club open to all RPI students.",
        players=[],
    )
    rugby = Team(
        name="Rugby",
        sport="Rugby",
        description="RPI rugby club competing in collegiate rugby union.",
        players=[],
    )
    ski_snowboard = Team(
        name="Ski and Snowboard Club",
        sport="Skiing / Snowboarding",
        description="Recreational and competitive skiing and snowboarding at RPI.",
        players=[],
    )
    ski_team = Team(
        name="Ski Team",
        sport="Skiing",
        description="RPI's competitive alpine and nordic ski racing team.",
        players=[],
    )
    ultimate = Team(
        name="Ultimate Frisbee",
        sport="Ultimate Frisbee",
        description="Competitive ultimate frisbee club representing RPI in USAU events.",
        players=[],
    )
    weightlifting = Team(
        name="Weightlifting",
        sport="Weightlifting",
        description="Powerlifting and Olympic weightlifting club for RPI students.",
        players=[],
    )
    wcbb = Team(
        name="Women's Club Basketball (WCBB)",
        sport="Basketball",
        description="Women's club basketball team competing at the collegiate club level.",
        players=[],
    )

    all_teams = [
        soccer, basketball, volleyball, hockey, badminton, baseball, racquetball,
        code_red, ddr, equestrian, judo, outing, quadball, crew, ballroom, boxing,
        swim, club_volleyball, cycling, dance_club, dance_team, disc_golf, fencing,
        fishing, juggling, kendo, rudras, taekwondo, water_polo, womens_soccer,
        wrestling, rugby, ski_snowboard, ski_team, ultimate, weightlifting, wcbb,
    ]

    for team in all_teams:
        await team.insert()

    # ── Players ───────────────────────────────────────────────────────────────
    players = [
        # Soccer
        Player(first_name="Ethan", last_name="Miller", team=soccer, jersey_number=9, position="Forward", year="Sophomore"),
        Player(first_name="Jordan", last_name="Lee", team=soccer, jersey_number=7, position="Midfielder", year="Junior"),
        Player(first_name="Marcus", last_name="Webb", team=soccer, jersey_number=3, position="Defender", year="Senior"),
        Player(first_name="Tyler", last_name="Grant", team=soccer, jersey_number=11, position="Forward", year="Freshman"),
        Player(first_name="Devon", last_name="Shaw", team=soccer, jersey_number=1, position="Goalkeeper", year="Junior"),
        Player(first_name="Ryan", last_name="Castillo", team=soccer, jersey_number=5, position="Midfielder", year="Sophomore"),
        Player(first_name="Noah", last_name="Fleming", team=soccer, jersey_number=8, position="Midfielder", year="Senior"),
        Player(first_name="Luke", last_name="Morales", team=soccer, jersey_number=14, position="Defender", year="Junior"),
        # Basketball
        Player(first_name="Chris", last_name="Patel", team=basketball, jersey_number=4, position="Guard", year="Senior"),
        Player(first_name="Jamal", last_name="Harris", team=basketball, jersey_number=12, position="Center", year="Junior"),
        Player(first_name="DeShawn", last_name="Brooks", team=basketball, jersey_number=21, position="Forward", year="Sophomore"),
        Player(first_name="Kevin", last_name="Tran", team=basketball, jersey_number=3, position="Point Guard", year="Freshman"),
        Player(first_name="Marcus", last_name="Okafor", team=basketball, jersey_number=33, position="Center", year="Senior"),
        Player(first_name="Justin", last_name="Reed", team=basketball, jersey_number=10, position="Shooting Guard", year="Junior"),
        Player(first_name="Andre", last_name="Mitchell", team=basketball, jersey_number=5, position="Forward", year="Sophomore"),
        # Volleyball
        Player(first_name="Maya", last_name="Rodriguez", team=volleyball, jersey_number=12, position="Setter", year="Sophomore"),
        Player(first_name="Aisha", last_name="Coleman", team=volleyball, jersey_number=7, position="Outside Hitter", year="Junior"),
        Player(first_name="Priya", last_name="Nair", team=volleyball, jersey_number=3, position="Libero", year="Senior"),
        Player(first_name="Grace", last_name="Kim", team=volleyball, jersey_number=15, position="Middle Blocker", year="Freshman"),
        Player(first_name="Sofia", last_name="Reyes", team=volleyball, jersey_number=9, position="Opposite Hitter", year="Sophomore"),
        Player(first_name="Hannah", last_name="Park", team=volleyball, jersey_number=1, position="Setter", year="Junior"),
        Player(first_name="Lily", last_name="Thompson", team=volleyball, jersey_number=11, position="Outside Hitter", year="Senior"),
        # Hockey
        Player(first_name="Tyler", last_name="Brooks", team=hockey, jersey_number=19, position="Center", year="Junior"),
        Player(first_name="Sam", last_name="Nguyen", team=hockey, jersey_number=31, position="Goalie", year="Senior"),
        Player(first_name="Alex", last_name="Kim", team=wcbb, jersey_number=10, position="Point Guard", year="Freshman"),
        Player(first_name="Jamie", last_name="Torres", team=wcbb, jersey_number=23, position="Forward", year="Junior"),
        Player(first_name="Priya", last_name="Sharma", team=womens_soccer, jersey_number=8, position="Midfielder", year="Sophomore"),
        Player(first_name="Olivia", last_name="Chen", team=womens_soccer, jersey_number=1, position="Goalkeeper", year="Senior"),
        Player(first_name="Marcus", last_name="Johnson", team=rugby, jersey_number=6, position="Flanker", year="Junior"),
        Player(first_name="Liam", last_name="Walsh", team=rugby, jersey_number=9, position="Scrum-half", year="Sophomore"),
        Player(first_name="Derek", last_name="Stone", team=ultimate, jersey_number=None, position="Handler", year="Senior"),
        Player(first_name="Nina", last_name="Patel", team=ultimate, jersey_number=None, position="Cutter", year="Freshman"),
        Player(first_name="Carlos", last_name="Rivera", team=baseball, jersey_number=22, position="Pitcher", year="Junior"),
        Player(first_name="Ben", last_name="Foster", team=baseball, jersey_number=14, position="Shortstop", year="Sophomore"),
        Player(first_name="Aiden", last_name="Park", team=swim, jersey_number=None, position="Freestyle", year="Junior"),
        Player(first_name="Zoe", last_name="Martin", team=crew, jersey_number=None, position="Stroke", year="Senior"),
        Player(first_name="Leo", last_name="Zhang", team=fencing, jersey_number=None, position="Épée", year="Sophomore"),
        Player(first_name="Sara", last_name="Wilson", team=water_polo, jersey_number=7, position="Center Forward", year="Junior"),
    ]

    for player in players:
        await player.insert()

    # ── Games ─────────────────────────────────────────────────────────────────
    games = [
        Game(
            home_team=soccer,
            opponent_name="Union Club Soccer",
            game_date=datetime(2026, 4, 2, 18, 0, tzinfo=timezone.utc),
            location="RPI Harkness Field",
            home_score=3, away_score=1,
            status="completed",
        ),
        Game(
            home_team=soccer,
            opponent_name="Albany Club Soccer",
            game_date=datetime(2026, 4, 23, 16, 0, tzinfo=timezone.utc),
            location="RPI Harkness Field",
            status="scheduled",
        ),
        Game(
            home_team=basketball,
            opponent_name="Union Club Basketball",
            game_date=datetime(2026, 4, 5, 19, 0, tzinfo=timezone.utc),
            location="East Campus Athletic Village (ECAV)",
            status="scheduled",
        ),
        Game(
            home_team=basketball,
            opponent_name="Skidmore Club Basketball",
            game_date=datetime(2026, 3, 28, 18, 0, tzinfo=timezone.utc),
            location="East Campus Athletic Village (ECAV)",
            home_score=72, away_score=65,
            status="completed",
        ),
        Game(
            home_team=volleyball,
            away_team=basketball,
            game_date=datetime(2026, 4, 8, 20, 0, tzinfo=timezone.utc),
            location="East Campus Athletic Village (ECAV)",
            home_score=2, away_score=1,
            status="completed",
        ),
        Game(
            home_team=hockey,
            opponent_name="Clarkson ACHA Hockey",
            game_date=datetime(2026, 4, 10, 19, 30, tzinfo=timezone.utc),
            location="Troy Sports Center",
            home_score=4, away_score=2,
            status="completed",
        ),
        Game(
            home_team=hockey,
            opponent_name="Albany ACHA Hockey",
            game_date=datetime(2026, 4, 25, 20, 0, tzinfo=timezone.utc),
            location="Troy Sports Center",
            status="scheduled",
        ),
        Game(
            home_team=wcbb,
            opponent_name="Siena Women's Club Basketball",
            game_date=datetime(2026, 4, 12, 14, 0, tzinfo=timezone.utc),
            location="East Campus Athletic Village (ECAV)",
            home_score=58, away_score=50,
            status="completed",
        ),
        Game(
            home_team=womens_soccer,
            opponent_name="Union Women's Club Soccer",
            game_date=datetime(2026, 4, 19, 15, 0, tzinfo=timezone.utc),
            location="RPI Harkness Field",
            status="scheduled",
        ),
        Game(
            home_team=rugby,
            opponent_name="Albany Rugby Club",
            game_date=datetime(2026, 4, 6, 13, 0, tzinfo=timezone.utc),
            location="RPI East Campus Fields",
            home_score=24, away_score=17,
            status="completed",
        ),
        Game(
            home_team=ultimate,
            opponent_name="Skidmore Ultimate",
            game_date=datetime(2026, 4, 26, 11, 0, tzinfo=timezone.utc),
            location="RPI East Campus Fields",
            status="scheduled",
        ),
        Game(
            home_team=baseball,
            opponent_name="Union Club Baseball",
            game_date=datetime(2026, 4, 15, 14, 0, tzinfo=timezone.utc),
            location="Beman Park",
            home_score=7, away_score=3,
            status="completed",
        ),
    ]

    for game in games:
        await game.insert()

    # ── Stat Submissions (approved, for demo) ────────────────────────────────
    ethan    = next(p for p in players if p.first_name == "Ethan")
    jordan   = next(p for p in players if p.first_name == "Jordan")
    marcus_w = next(p for p in players if p.first_name == "Marcus" and p.last_name == "Webb")
    tyler_g  = next(p for p in players if p.first_name == "Tyler" and p.last_name == "Grant")
    devon    = next(p for p in players if p.first_name == "Devon")
    ryan     = next(p for p in players if p.first_name == "Ryan")
    noah     = next(p for p in players if p.first_name == "Noah")
    luke     = next(p for p in players if p.first_name == "Luke")

    chris    = next(p for p in players if p.first_name == "Chris")
    jamal    = next(p for p in players if p.first_name == "Jamal")
    deshawn  = next(p for p in players if p.first_name == "DeShawn")
    kevin    = next(p for p in players if p.first_name == "Kevin")
    marcus_o = next(p for p in players if p.first_name == "Marcus" and p.last_name == "Okafor")
    justin   = next(p for p in players if p.first_name == "Justin")
    andre    = next(p for p in players if p.first_name == "Andre")

    maya     = next(p for p in players if p.first_name == "Maya")
    aisha    = next(p for p in players if p.first_name == "Aisha")
    priya    = next(p for p in players if p.first_name == "Priya" and p.last_name == "Nair")
    grace    = next(p for p in players if p.first_name == "Grace")
    sofia    = next(p for p in players if p.first_name == "Sofia")
    hannah   = next(p for p in players if p.first_name == "Hannah")
    lily     = next(p for p in players if p.first_name == "Lily")

    soccer_game     = games[0]   # Men's Club Soccer vs Union (completed)
    basketball_game = games[3]   # Basketball vs Skidmore (completed)
    volleyball_game = games[4]   # Volleyball vs Basketball (completed)

    stat_submissions = [
        # ── Soccer ──────────────────────────────────────────────────────────
        StatSubmission(team=soccer, game=soccer_game, player=ethan,
            sport="Men's Club Soccer",
            stats={"goals": 2, "assists": 1, "shots_on_goal": 5, "saves": 0}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=jordan,
            sport="Men's Club Soccer",
            stats={"goals": 1, "assists": 2, "shots_on_goal": 3, "saves": 0}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=marcus_w,
            sport="Men's Club Soccer",
            stats={"goals": 0, "assists": 1, "shots_on_goal": 1, "saves": 0}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=tyler_g,
            sport="Men's Club Soccer",
            stats={"goals": 0, "assists": 0, "shots_on_goal": 2, "saves": 0}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=devon,
            sport="Men's Club Soccer",
            stats={"goals": 0, "assists": 0, "shots_on_goal": 0, "saves": 4}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=ryan,
            sport="Men's Club Soccer",
            stats={"goals": 0, "assists": 1, "shots_on_goal": 2, "saves": 0}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=noah,
            sport="Men's Club Soccer",
            stats={"goals": 0, "assists": 0, "shots_on_goal": 1, "saves": 0}, status="approved"),
        StatSubmission(team=soccer, game=soccer_game, player=luke,
            sport="Men's Club Soccer",
            stats={"goals": 0, "assists": 0, "shots_on_goal": 0, "saves": 0}, status="approved"),
        # ── Basketball ──────────────────────────────────────────────────────
        StatSubmission(team=basketball, game=basketball_game, player=chris,
            sport="Men's Club Basketball",
            stats={"points": 24, "rebounds": 7, "assists": 5, "steals": 3, "blocks": 1}, status="approved"),
        StatSubmission(team=basketball, game=basketball_game, player=jamal,
            sport="Men's Club Basketball",
            stats={"points": 18, "rebounds": 12, "assists": 2, "steals": 1, "blocks": 4}, status="approved"),
        StatSubmission(team=basketball, game=basketball_game, player=deshawn,
            sport="Men's Club Basketball",
            stats={"points": 15, "rebounds": 6, "assists": 3, "steals": 2, "blocks": 0}, status="approved"),
        StatSubmission(team=basketball, game=basketball_game, player=kevin,
            sport="Men's Club Basketball",
            stats={"points": 9, "rebounds": 3, "assists": 8, "steals": 4, "blocks": 0}, status="approved"),
        StatSubmission(team=basketball, game=basketball_game, player=marcus_o,
            sport="Men's Club Basketball",
            stats={"points": 6, "rebounds": 9, "assists": 1, "steals": 0, "blocks": 3}, status="approved"),
        StatSubmission(team=basketball, game=basketball_game, player=justin,
            sport="Men's Club Basketball",
            stats={"points": 11, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0}, status="approved"),
        StatSubmission(team=basketball, game=basketball_game, player=andre,
            sport="Men's Club Basketball",
            stats={"points": 8, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 2}, status="approved"),
        # ── Volleyball ──────────────────────────────────────────────────────
        StatSubmission(team=volleyball, game=volleyball_game, player=maya,
            sport="Men's Club Volleyball",
            stats={"kills": 14, "assists": 8, "digs": 10, "blocks": 3, "aces": 2}, status="approved"),
        StatSubmission(team=volleyball, game=volleyball_game, player=aisha,
            sport="Men's Club Volleyball",
            stats={"kills": 11, "assists": 2, "digs": 8, "blocks": 2, "aces": 3}, status="approved"),
        StatSubmission(team=volleyball, game=volleyball_game, player=priya,
            sport="Men's Club Volleyball",
            stats={"kills": 1, "assists": 3, "digs": 18, "blocks": 0, "aces": 1}, status="approved"),
        StatSubmission(team=volleyball, game=volleyball_game, player=grace,
            sport="Men's Club Volleyball",
            stats={"kills": 9, "assists": 1, "digs": 5, "blocks": 6, "aces": 0}, status="approved"),
        StatSubmission(team=volleyball, game=volleyball_game, player=sofia,
            sport="Men's Club Volleyball",
            stats={"kills": 7, "assists": 1, "digs": 4, "blocks": 4, "aces": 1}, status="approved"),
        StatSubmission(team=volleyball, game=volleyball_game, player=hannah,
            sport="Men's Club Volleyball",
            stats={"kills": 2, "assists": 32, "digs": 6, "blocks": 1, "aces": 2}, status="approved"),
        StatSubmission(team=volleyball, game=volleyball_game, player=lily,
            sport="Men's Club Volleyball",
            stats={"kills": 8, "assists": 1, "digs": 7, "blocks": 2, "aces": 1}, status="approved"),
    ]

    for sub in stat_submissions:
        await sub.insert()

    print(f"DB seeded successfully with {len(all_teams)} teams, {len(players)} players, {len(games)} games, and {len(stat_submissions)} stat submissions!")
    await client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())