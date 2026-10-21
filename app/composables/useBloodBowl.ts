import { ref, computed } from 'vue'
import type {
  League,
  Team,
  Coach,
  Match,
  ActivityEvent,
  DashboardStats,
} from '~/types/blood-bowl'
import {
  mockDashboardStats,
  mockLeagues,
  mockUpcomingMatches,
  mockRecentActivity,
  mockTeams,
  mockCoaches,
} from '~/data/mockBloodBowlData'

// Global reactive store for the frontend session
const leaguesState = ref<League[]>([...mockLeagues])
const matchesState = ref<Match[]>([...mockUpcomingMatches])
const activityState = ref<ActivityEvent[]>([...mockRecentActivity])
const teamsState = ref<Team[]>([...mockTeams])
const coachesState = ref<Coach[]>([...mockCoaches])
const statsState = ref<DashboardStats>({ ...mockDashboardStats })

export function useBloodBowl() {
  // Stats
  const getStats = () => computed(() => statsState.value)

  // Leagues
  const getLeagues = () => computed(() => leaguesState.value)

  const getLeagueBySlug = (slug: string): League | undefined => {
    return leaguesState.value.find((l) => l.slug === slug || l.id === slug)
  }

  const createLeague = (newLeagueData: Partial<League>): League => {
    const id = `l-${Date.now().toString().slice(-4)}`
    const slug = (newLeagueData.name || 'nueva-liga')
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')

    const league: League = {
      id,
      name: newLeagueData.name || 'Nueva Liga',
      slug,
      season: newLeagueData.season || 'Temporada 2026',
      format: newLeagueData.format || 'Round Robin',
      teamsCount: 0,
      maxTeams: newLeagueData.maxTeams || 8,
      matchesPlayed: 0,
      totalMatches: (newLeagueData.maxTeams || 8) * ((newLeagueData.maxTeams || 8) - 1) / 2,
      status: 'inscripcion',
      description: newLeagueData.description || 'Competición oficial de Blood Bowl Manager.',
      currentRound: 0,
      totalRounds: (newLeagueData.maxTeams || 8) - 1,
    }

    leaguesState.value.unshift(league)
    statsState.value.activeLeagues += 1

    // Add activity event
    activityState.value.unshift({
      id: `act-${Date.now()}`,
      type: 'league_created',
      title: 'Liga creada',
      description: `${league.name} (${league.season}) registrada por el Comisario`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Justo ahora',
    })

    return league
  }

  // Matches
  const getUpcomingMatches = () => computed(() => matchesState.value)

  const getMatchById = (id: string): Match | undefined => {
    return matchesState.value.find((m) => m.id === id)
  }

  // Activity
  const getRecentActivity = () => computed(() => activityState.value)

  // Teams
  const getTeams = () => computed(() => teamsState.value)

  const getTeamById = (id: string): Team | undefined => {
    return teamsState.value.find((t) => t.id === id)
  }

  // Coaches
  const getCoaches = () => computed(() => coachesState.value)

  return {
    getStats,
    getLeagues,
    getLeagueBySlug,
    createLeague,
    getUpcomingMatches,
    getMatchById,
    getRecentActivity,
    getTeams,
    getTeamById,
    getCoaches,
  }
}
