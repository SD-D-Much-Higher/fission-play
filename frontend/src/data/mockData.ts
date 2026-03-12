export const clubs = [
  {
    id: "mens-basketball",
    name: "Men's Basketball",
    description: "Competitive club basketball team representing RPI.",
    sport: "Basketball",
    members: 18,
    bannerImage:
      "https://images.unsplash.com/photo-1546519638-68e109acd27d",
  },
]

export const players = [
  {
    id: "p1",
    clubId: "mens-basketball",
    name: "Jordan Banks",
    number: 12,
    position: "Guard",
    status: "active",
    stats: {
      gamesPlayed: 8,
      points: 120,
      rebounds: 35,
      assists: 28,
    },
  },
  {
    id: "p2",
    clubId: "mens-basketball",
    name: "Marcus Lee",
    number: 23,
    position: "Forward",
    status: "active",
    stats: {
      gamesPlayed: 8,
      points: 98,
      rebounds: 52,
      assists: 12,
    },
  },
]

export const games = [
  {
    id: "g1",
    clubId: "mens-basketball",
    opponent: "Union College",
    date: "2026-03-20",
    time: "7:00 PM",
    location: "Houston Field House",
    score: {
      home: 72,
      away: 65,
    },
    result: "win",
  },
  {
    id: "g2",
    clubId: "mens-basketball",
    opponent: "Siena Club Team",
    date: "2026-03-28",
    time: "6:00 PM",
    location: "Siena Gymnasium",
  },
]

export const teamStats = {
  "mens-basketball": {
    wins: 6,
    losses: 2,
    winPercentage: 75,
    activeRoster: 18,
    avgPointsFor: 78,
  },
}