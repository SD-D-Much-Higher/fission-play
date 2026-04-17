import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[3]
FRONTEND_MONGO_DIR = REPO_ROOT / "frontend" / "src" / "data" / "mongo"
OUTPUT_DIR = Path(__file__).resolve().parent / "mongo_import"


def load_json_array(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    if not isinstance(payload, list):
        raise ValueError(f"Expected JSON array in {path}")
    return payload


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2)
        file.write("\n")


def transform() -> None:
    team_source_path = FRONTEND_MONGO_DIR / "teams.json"
    if not team_source_path.exists():
        team_source_path = FRONTEND_MONGO_DIR / "clubs.json"

    teams = load_json_array(team_source_path)
    players = load_json_array(FRONTEND_MONGO_DIR / "players.json")
    games = load_json_array(FRONTEND_MONGO_DIR / "games.json")
    team_stats = load_json_array(FRONTEND_MONGO_DIR / "teamStats.json")

    # Backend now mirrors frontend mockData field naming/schema directly.
    write_json(OUTPUT_DIR / "teams.json", teams)
    write_json(OUTPUT_DIR / "players.json", players)
    write_json(OUTPUT_DIR / "games.json", games)
    write_json(OUTPUT_DIR / "teamStats.json", team_stats)

    print("Generated backend import JSON files:")
    print(f"- {OUTPUT_DIR / 'teams.json'}")
    print(f"- {OUTPUT_DIR / 'players.json'}")
    print(f"- {OUTPUT_DIR / 'games.json'}")
    print(f"- {OUTPUT_DIR / 'teamStats.json'}")


if __name__ == "__main__":
    transform()
