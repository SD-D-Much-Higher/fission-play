export type GameResult = "win" | "loss" | "draw"

export type GameScore = {
  rpi: number
  opponent: number
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

