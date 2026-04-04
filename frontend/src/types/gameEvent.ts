export type GameResult = "win" | "loss" | "draw"

export type GameScore = {
  home: number
  away: number
}

export interface GameEvent {
  id: string
  teamId: string
  opponent: string
  date: string
  time: string
  location: string
  score?: GameScore
  result?: GameResult
}

