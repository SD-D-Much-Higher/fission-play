export const clubs = [
  {
    id: "mens-basketball",
    name: "Men's Basketball",
    description: "Competitive club basketball team representing RPI.",
    sport: "Basketball",
    members: 18,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mens-soccer",
    name: "Men's Soccer",
    description: "RPI's premier soccer club with a strong competitive history.",
    sport: "Soccer",
    members: 22,
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "womens-volleyball",
    name: "Women's Volleyball",
    description: "High-energy volleyball team competing at the collegiate club level.",
    sport: "Volleyball",
    members: 18,
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
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
  {
    id: "p3",
    clubId: "mens-soccer",
    name: "Ethan Cruz",
    number: 10,
    position: "Midfielder",
    status: "active",
    stats: {
      gamesPlayed: 7,
      points: 6,
      rebounds: 0,
      assists: 4,
    },
  },
  {
    id: "p4",
    clubId: "mens-soccer",
    name: "Noah Patel",
    number: 7,
    position: "Forward",
    status: "active",
    stats: {
      gamesPlayed: 7,
      points: 8,
      rebounds: 0,
      assists: 2,
    },
  },
  {
    id: "p5",
    clubId: "womens-volleyball",
    name: "Maya Thompson",
    number: 5,
    position: "Setter",
    status: "active",
    stats: {
      gamesPlayed: 9,
      points: 32,
      rebounds: 0,
      assists: 41,
    },
  },
  {
    id: "p6",
    clubId: "womens-volleyball",
    name: "Lila Chen",
    number: 14,
    position: "Outside Hitter",
    status: "active",
    stats: {
      gamesPlayed: 9,
      points: 67,
      rebounds: 0,
      assists: 11,
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
  {
    id: "g3",
    clubId: "mens-soccer",
    opponent: "Union College",
    date: "2026-03-22",
    time: "5:00 PM",
    location: "ECAV Stadium",
    score: {
      home: 3,
      away: 1,
    },
    result: "win",
  },
  {
    id: "g4",
    clubId: "mens-soccer",
    opponent: "Skidmore Club Team",
    date: "2026-03-30",
    time: "4:00 PM",
    location: "Skidmore Turf Field",
  },
  {
    id: "g5",
    clubId: "womens-volleyball",
    opponent: "RIT Club Volleyball",
    date: "2026-03-24",
    time: "6:30 PM",
    location: "East Campus Arena",
    score: {
      home: 3,
      away: 2,
    },
    result: "win",
  },
  {
    id: "g6",
    clubId: "womens-volleyball",
    opponent: "Union College",
    date: "2026-03-29",
    time: "1:00 PM",
    location: "Union Gymnasium",
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
  "mens-soccer": {
    wins: 5,
    losses: 2,
    winPercentage: 71,
    activeRoster: 22,
    avgPointsFor: 2.4,
  },
  "womens-volleyball": {
    wins: 7,
    losses: 3,
    winPercentage: 70,
    activeRoster: 18,
    avgPointsFor: 3.0,
  },
}