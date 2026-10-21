export type LeagueStatus = 'activa' | 'en_curso' | 'inscripcion' | 'finalizada' | 'borrador'

export interface League {
  id: string
  name: string
  slug: string
  season: string
  format: 'Round Robin' | 'Playoffs' | 'Suizo' | 'Grupos + Eliminatoria'
  teamsCount: number
  maxTeams: number
  matchesPlayed: number
  totalMatches: number
  status: LeagueStatus
  description?: string
  currentRound: number
  totalRounds: number
}

export interface Team {
  id: string
  name: string
  race: string
  coachId: string
  coachName: string
  leagueId?: string
  leagueName?: string
  played: number
  wins: number
  draws: number
  losses: number
  points: number
  touchdownsFor: number
  touchdownsAgainst: number
  casualtiesFor: number
  casualtiesAgainst: number
  teamValue: number
  treasury: number
  rerolls: number
}

export interface Coach {
  id: string
  name: string
  title: string
  nafNumber?: string
  motto?: string
  teamsCount: number
  stats: {
    played: number
    wins: number
    draws: number
    losses: number
    winRate: number
    touchdowns: number
    casualties: number
  }
}

export type MatchStatus = 'programado' | 'en_curso' | 'finalizado' | 'aplazado'

export interface MatchParticipant {
  id: string
  name: string
  race: string
  score?: number
  casualties?: number
}

export interface Match {
  id: string
  leagueId: string
  leagueName: string
  round: number
  homeTeam: MatchParticipant
  awayTeam: MatchParticipant
  date: string
  status: MatchStatus
  stadium?: string
  mvp?: string
}

export type ActivityEventType =
  | 'match_finished'
  | 'result_recorded'
  | 'injury'
  | 'team_registered'
  | 'league_created'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  title: string
  description: string
  timestamp: string
  timeAgo: string
}

export interface DashboardStats {
  activeLeagues: number
  registeredTeams: number
  playedMatches: number
  pendingMatches: number
}
