import { apiFetch } from "../lib/api"

export type StatSubmissionResponse = {
  id: string
  team_id: string
  team_name: string
  player_id: string
  player_name: string
  sport: string
  stats: Record<string, number | string>
  status: string
  created_at: string
}

export function submitStats(payload: {
  team_id: string
  game_id: string
  player_id: string
  sport: string
  stats: Record<string, number>
}) {
  return apiFetch<StatSubmissionResponse>("/stats/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getPendingStats(teamId: string) {
  return apiFetch<StatSubmissionResponse[]>(`/stats/team/${teamId}/pending`)
}

export function approveStatSubmission(submissionId: string) {
  return apiFetch<StatSubmissionResponse>(`/stats/${submissionId}/approve`, {
    method: "PATCH",
  })
}

export function rejectStatSubmission(submissionId: string) {
  return apiFetch<StatSubmissionResponse>(`/stats/${submissionId}/reject`, {
    method: "PATCH",
  })
}