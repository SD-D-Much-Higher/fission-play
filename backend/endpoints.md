Teams
```
GET /api/v1/teams/
GET /api/v1/teams/{team_id}
POST /api/v1/teams/
PATCH /api/v1/teams/{team_id}
DELETE /api/v1/teams/{team_id}
GET /api/v1/teams/{team_id}/players
GET /api/v1/teams/{team_id}/games
```

Players
```
GET /api/v1/players/
GET /api/v1/players/{player_id}
POST /api/v1/players/
PATCH /api/v1/players/{player_id}
DELETE /api/v1/players/{player_id}
```

Games
```
GET /api/v1/games/
GET /api/v1/games/{game_id}
POST /api/v1/games/
PATCH /api/v1/games/{game_id}
DELETE /api/v1/games/{game_id}
```

Stats
```
POST /api/v1/stats/submit
GET /api/v1/stats/team/{team_id}/pending
GET /api/v1/stats/team/{team_id}/approved
GET /api/v1/stats/player/{player_id}/approved
PATCH /api/v1/stats/{submission_id}/approve
PATCH /api/v1/stats/{submission_id}/reject
```