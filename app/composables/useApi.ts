import type { FetchOptions } from 'ofetch'

export function useApi() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  // Helper to get Supabase JWT token if user is signed in
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
      const supabase = useSupabaseClient()
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (token) {
        return { Authorization: `Bearer ${token}` }
      }
    } catch {
      // In SSR or unauthenticated context, proceed without token
    }
    return {}
  }

  const request = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
    const authHeaders = await getAuthHeaders()
    const url = `${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

    return $fetch<T>(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
    })
  }

  return {
    // Health
    getHealth: () => request<{ status: string }>('/health'),

    // Leagues
    getLeagues: (params?: { is_public?: boolean; status?: string; creator_id?: string }) =>
      request<any[]>('/leagues', { params }),
    getLeague: (id: string) => request<any>(`/leagues/${id}`),
    getLeagueByCode: (code: string) => request<any>(`/leagues/code/${code}`),
    createLeague: (data: any) => request<any>('/leagues', { method: 'POST', body: data }),
    updateLeague: (id: string, data: any) => request<any>(`/leagues/${id}`, { method: 'PATCH', body: data }),
    joinLeague: (data: { invite_code: string; team_id?: string }) =>
      request<any>('/leagues/join', { method: 'POST', body: data }),
    getLeagueStandings: (leagueId: string) => request<any>(`/leagues/${leagueId}/standings`),
    getLeagueLeaderboard: (leagueId: string, limit: number = 5) =>
      request<any>(`/leagues/${leagueId}/leaderboard`, { params: { limit } }),
    getLeagueBounties: (leagueId: string) => request<any[]>(`/leagues/${leagueId}/bounties`),
    createLeagueBounty: (leagueId: string, data: { player_id: string; bounty_amount: number; reward_description?: string }) =>
      request<any>(`/leagues/${leagueId}/bounties`, { method: 'POST', body: data }),
    deleteLeagueBounty: (leagueId: string, bountyId: string) =>
      request<void>(`/leagues/${leagueId}/bounties/${bountyId}`, { method: 'DELETE' }),
    getLeagueRounds: (leagueId: string, phase?: number) =>
      request<any[]>(`/leagues/${leagueId}/rounds`, { params: { phase } }),
    generateSchedule: (leagueId: string, data: any) =>
      request<any>(`/leagues/${leagueId}/generate-schedule`, { method: 'POST', body: data }),
    generatePlayoffs: (leagueId: string, data: any) =>
      request<any>(`/leagues/${leagueId}/playoffs`, { method: 'POST', body: data }),

    // Matches
    getMatches: (params?: { league_id?: string; round_id?: string; team_id?: string; status?: string }) =>
      request<any[]>('/matches', { params }),
    getMatch: (id: string) => request<any>(`/matches/${id}`),
    createMatch: (data: any) => request<any>('/matches', { method: 'POST', body: data }),
    recordMatchResult: (matchId: string, result: any) =>
      request<any>(`/matches/${matchId}/result`, { method: 'POST', body: result }),
    validateMatch: (matchId: string) => request<any>(`/matches/${matchId}/validate`, { method: 'POST' }),
    disputeMatch: (matchId: string, reason: string) =>
      request<any>(`/matches/${matchId}/dispute`, { method: 'POST', body: { reason } }),

    // Teams
    getTeams: (params?: { league_id?: string; owner_id?: string }) =>
      request<any[]>('/teams', { params }),
    getTeam: (id: string) => request<any>(`/teams/${id}`),
    createTeam: (data: any) => request<any>('/teams', { method: 'POST', body: data }),
    updateTeam: (id: string, data: any) => request<any>(`/teams/${id}`, { method: 'PATCH', body: data }),

    // Players
    getTeamPlayers: (teamId: string) => request<any[]>(`/teams/${teamId}/players`),
    getPlayer: (id: string) => request<any>(`/players/${id}`),
    hirePlayer: (teamId: string, data: any) =>
      request<any>(`/teams/${teamId}/players`, { method: 'POST', body: data }),
    addAdvancement: (playerId: string, adv: any) =>
      request<any>(`/players/${playerId}/advancements`, { method: 'POST', body: adv }),

    // Reference Data
    getSkills: (category?: string, eliteOnly: boolean = false) =>
      request<any>('/reference/skills', { params: { category, elite_only: eliteOnly } }),
    getRaces: () => request<Record<string, any>>('/reference/races'),
    getRace: (name: string) => request<any>(`/reference/races/${name}`),
    getStars: () => request<any[]>('/reference/stars'),
    getInducements: () => request<any[]>('/reference/inducements'),

    // Coaches & Hall of Fame
    getMyProfile: () => request<any>('/coaches/me'),
    updateMyProfile: (data: any) => request<any>('/coaches/me', { method: 'PATCH', body: data }),
    getHallOfFame: (limit: number = 10) => request<any>('/coaches/hall-of-fame', { params: { limit } }),
    getCoaches: (q?: string, limit: number = 50, offset: number = 0) =>
      request<any[]>('/coaches', { params: { q, limit, offset } }),
    getCoach: (coachId: string) => request<any>(`/coaches/${coachId}`),
    getCoachTeams: (coachId: string) => request<any[]>(`/coaches/${coachId}/teams`),
  }
}
