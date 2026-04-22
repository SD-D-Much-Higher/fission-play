import { apiFetch } from "../lib/api";

export interface TeamResponse {
  id: string;
  name: string;
  sport: string;
  description?: string | null;
  school?: string | null;
  coach_name?: string | null;
}

export function getTeams() {
  return apiFetch<TeamResponse[]>("/teams/");
}

export function getTeamById(id: string) {
  return apiFetch<TeamResponse>(`/teams/${id}`);
}

export function getTeamPlayers(id: string) {
  return apiFetch<any[]>(`/teams/${id}/players`);
}

export function getTeamGames(id: string) {
  return apiFetch<any[]>(`/teams/${id}/games`);
}