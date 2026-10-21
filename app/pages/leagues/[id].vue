<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Trophy,
  Users,
  Calendar,
  Crosshair,
  Award,
  Shield,
  Copy,
  Check,
  Plus,
  Flame,
  Swords,
  ChevronRight,
  Skull,
  Coins,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { formatGold } from '~/lib/utils'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import Input from '~/components/ui/Input.vue'

const route = useRoute()
const api = useApi()
const leagueId = computed(() => route.params.id as string)

// State
const loading = ref(true)
const error = ref<string | null>(null)
const league = ref<any>(null)
const standings = ref<any>(null)
const leaderboard = ref<any>(null)
const bounties = ref<any[]>([])
const rounds = ref<any[]>([])
const activeTab = ref<'standings' | 'leaderboard' | 'rounds' | 'bounties' | 'teams'>('standings')
const standingsView = ref<'overall' | 'group' | 'conference'>('overall')

// Invite Code copy state
const copied = ref(false)
const copyInviteCode = () => {
  if (league.value?.invite_code) {
    navigator.clipboard.writeText(league.value.invite_code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// Bounty Modal state
const showBountyModal = ref(false)
const bountyForm = ref({
  player_id: '',
  bounty_amount: 50000,
  reward_description: 'Por romperle la armadura en el campo de batalla.'
})
const bountyLoading = ref(false)
const bountyError = ref<string | null>(null)

// Load data
const loadLeagueData = async () => {
  loading.value = true
  error.value = null
  try {
    const [lData, sData, lboardData, bData, rData] = await Promise.allSettled([
      api.getLeague(leagueId.value),
      api.getLeagueStandings(leagueId.value),
      api.getLeagueLeaderboard(leagueId.value, 5),
      api.getLeagueBounties(leagueId.value),
      api.getLeagueRounds(leagueId.value)
    ])

    if (lData.status === 'fulfilled') {
      league.value = lData.value
    } else {
      error.value = 'No se pudo cargar la liga solicitada.'
      return
    }

    if (sData.status === 'fulfilled') standings.value = sData.value
    if (lboardData.status === 'fulfilled') leaderboard.value = lboardData.value
    if (bData.status === 'fulfilled') bounties.value = bData.value || []
    if (rData.status === 'fulfilled') rounds.value = rData.value || []
  } catch (err: any) {
    error.value = err?.message || 'Error cargando datos de la liga'
  } finally {
    loading.value = false
  }
}

const handleCreateBounty = async () => {
  if (!bountyForm.value.player_id) {
    bountyError.value = 'Debes introducir la ID del jugador objetivo.'
    return
  }
  bountyLoading.value = true
  bountyError.value = null
  try {
    await api.createLeagueBounty(leagueId.value, {
      player_id: bountyForm.value.player_id,
      bounty_amount: bountyForm.value.bounty_amount,
      reward_description: bountyForm.value.reward_description
    })
    showBountyModal.value = false
    // Refresh bounties
    bounties.value = await api.getLeagueBounties(leagueId.value)
  } catch (err: any) {
    bountyError.value = err?.data?.detail || 'Error al poner la recompensa.'
  } finally {
    bountyLoading.value = false
  }
}

onMounted(() => {
  loadLeagueData()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="w-12 h-12 border-4 border-blood-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-parchment-400 font-sans tracking-wide">Invocando pergaminos de la liga...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 text-center glass-panel rounded-xl border border-blood-900/60 max-w-xl mx-auto my-12">
      <AlertCircle class="w-12 h-12 text-blood-500 mx-auto mb-4" />
      <h2 class="text-xl font-heading font-bold text-parchment-100 mb-2">Error de Liga</h2>
      <p class="text-parchment-400 text-sm mb-6">{{ error }}</p>
      <NuxtLink to="/leagues">
        <Button variant="secondary">Volver al listado de ligas</Button>
      </NuxtLink>
    </div>

    <!-- League Header & Content -->
    <div v-else-if="league" class="space-y-8">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-2xl border border-blood-900/70 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-blood-950/40 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Trophy class="w-72 h-72 text-blood-500" />
        </div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <Badge :variant="league.status === 'EN_CURSO' ? 'gold' : league.status === 'FINALIZADA' ? 'secondary' : 'default'">
                <span class="inline-block w-2 h-2 rounded-full mr-1.5" :class="league.status === 'EN_CURSO' ? 'bg-amber-400 animate-pulse' : 'bg-gray-400'"></span>
                {{ league.status || 'INSCRIPCIÓN' }}
              </Badge>
              <span class="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-charcoal-800 text-parchment-400 border border-charcoal-700">
                {{ league.format || 'ROUND_ROBIN' }}
              </span>
              <span v-if="league.edition" class="text-xs text-parchment-400">
                Edición #{{ league.edition }}
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-heading font-black text-parchment-100 tracking-tight">
              {{ league.name }}
            </h1>

            <p v-if="league.description" class="text-parchment-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {{ league.description }}
            </p>

            <div class="flex flex-wrap items-center gap-6 pt-2 text-xs text-parchment-400 font-sans">
              <div class="flex items-center gap-1.5">
                <Users class="w-4 h-4 text-blood-400" />
                <span><strong class="text-parchment-200">{{ league.teams?.length || 0 }}</strong> / {{ league.max_teams }} Equipos</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4 text-parchment-300" />
                <span>{{ league.rounds_count || rounds.length || 0 }} Jornadas</span>
              </div>
              <div v-if="league.allow_bounties" class="flex items-center gap-1.5">
                <Crosshair class="w-4 h-4 text-amber-400" />
                <span class="text-amber-300 font-medium">Recompensas Habilitadas</span>
              </div>
            </div>
          </div>

          <!-- Quick Action: Invite Code -->
          <div class="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div class="p-4 rounded-xl border border-blood-800/40 bg-charcoal-900/80 backdrop-blur text-center">
              <span class="text-xs uppercase tracking-wider text-parchment-400 font-medium block mb-1">
                Código de Invitación
              </span>
              <div class="flex items-center justify-center gap-2">
                <span class="text-xl font-mono font-bold tracking-widest text-parchment-100 bg-charcoal-950 px-3 py-1 rounded border border-blood-900/60">
                  {{ league.invite_code || 'N/A' }}
                </span>
                <button
                  type="button"
                  @click="copyInviteCode"
                  title="Copiar código"
                  class="p-2 rounded bg-charcoal-800 hover:bg-blood-900/40 text-parchment-300 hover:text-parchment-100 transition-colors border border-charcoal-700"
                >
                  <Check v-if="copied" class="w-4 h-4 text-emerald-400" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>
              <p class="text-[11px] text-parchment-500 mt-1.5">Comparte este código con los entrenadores</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex overflow-x-auto border-b border-blood-900/40 gap-2 pb-1 scrollbar-thin">
        <button
          type="button"
          @click="activeTab = 'standings'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
            activeTab === 'standings'
              ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
          ]"
        >
          <Trophy class="w-4 h-4 text-amber-400" />
          <span>Clasificación</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'leaderboard'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
            activeTab === 'leaderboard'
              ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
          ]"
        >
          <Flame class="w-4 h-4 text-blood-400" />
          <span>Líderes y Estadísticas</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'rounds'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
            activeTab === 'rounds'
              ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
          ]"
        >
          <Calendar class="w-4 h-4 text-parchment-300" />
          <span>Jornadas y Partidos ({{ rounds.length }})</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'bounties'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
            activeTab === 'bounties'
              ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
          ]"
        >
          <Skull class="w-4 h-4 text-red-500" />
          <span>Recompensas ({{ bounties.length }})</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'teams'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
            activeTab === 'teams'
              ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
          ]"
        >
          <Shield class="w-4 h-4 text-blue-400" />
          <span>Equipos ({{ league.teams?.length || 0 }})</span>
        </button>
      </div>

      <!-- TAB 1: CLASIFICACIÓN -->
      <div v-if="activeTab === 'standings'" class="space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-xl font-heading font-bold text-parchment-100">Tabla de Clasificación</h2>
            <p class="text-xs text-parchment-400">Puntuaciones según el reglamento Blood Bowl 2025</p>
          </div>

          <!-- Filter overall vs group vs conference if available -->
          <div v-if="standings?.by_group && Object.keys(standings.by_group).length > 0" class="flex items-center bg-charcoal-900 rounded-lg p-1 border border-blood-900/40">
            <button
              type="button"
              @click="standingsView = 'overall'"
              :class="['px-3 py-1 text-xs rounded font-medium transition-colors', standingsView === 'overall' ? 'bg-blood-800 text-parchment-100' : 'text-parchment-400 hover:text-parchment-200']"
            >
              General
            </button>
            <button
              type="button"
              @click="standingsView = 'group'"
              :class="['px-3 py-1 text-xs rounded font-medium transition-colors', standingsView === 'group' ? 'bg-blood-800 text-parchment-100' : 'text-parchment-400 hover:text-parchment-200']"
            >
              Por Grupos
            </button>
          </div>
        </div>

        <!-- Standings Table -->
        <div class="glass-panel rounded-xl overflow-hidden border border-blood-900/60 shadow-xl">
          <Table>
            <TableHeader class="bg-charcoal-950/80">
              <TableRow>
                <TableHead class="w-12 text-center text-xs uppercase">Pos</TableHead>
                <TableHead class="text-xs uppercase">Equipo</TableHead>
                <TableHead class="text-xs uppercase">Raza</TableHead>
                <TableHead class="text-center text-xs uppercase">PJ</TableHead>
                <TableHead class="text-center text-xs uppercase">PG</TableHead>
                <TableHead class="text-center text-xs uppercase">PE</TableHead>
                <TableHead class="text-center text-xs uppercase">PP</TableHead>
                <TableHead class="text-center text-xs uppercase text-amber-400 font-bold">PTS</TableHead>
                <TableHead class="text-center text-xs uppercase">TD (Dif)</TableHead>
                <TableHead class="text-center text-xs uppercase">Bajas (Dif)</TableHead>
                <TableHead class="text-right text-xs uppercase pr-4">TV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="standings?.overall && standings.overall.length > 0">
                <TableRow
                  v-for="(row, idx) in standings.overall"
                  :key="row.team_id || idx"
                  class="hover:bg-blood-950/20 transition-colors"
                >
                  <TableCell class="text-center font-heading font-bold text-sm">
                    <span
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs"
                      :class="[
                        idx === 0 ? 'bg-amber-400 text-charcoal-950 font-black' :
                        idx === 1 ? 'bg-slate-300 text-charcoal-950 font-bold' :
                        idx === 2 ? 'bg-amber-700 text-parchment-100 font-bold' :
                        'text-parchment-400'
                      ]"
                    >
                      {{ idx + 1 }}
                    </span>
                  </TableCell>
                  <TableCell>
                    <NuxtLink :to="`/teams/${row.team_id}`" class="font-heading font-semibold text-parchment-100 hover:text-amber-400 transition-colors flex items-center gap-2">
                      <Shield class="w-3.5 h-3.5 text-blood-400" />
                      <span>{{ row.team_name }}</span>
                    </NuxtLink>
                  </TableCell>
                  <TableCell class="text-parchment-400 text-xs capitalize">{{ row.race || '-' }}</TableCell>
                  <TableCell class="text-center text-parchment-300 text-xs">{{ row.played || 0 }}</TableCell>
                  <TableCell class="text-center text-emerald-400 font-semibold text-xs">{{ row.wins || 0 }}</TableCell>
                  <TableCell class="text-center text-parchment-400 text-xs">{{ row.draws || 0 }}</TableCell>
                  <TableCell class="text-center text-red-400 text-xs">{{ row.losses || 0 }}</TableCell>
                  <TableCell class="text-center font-heading font-bold text-sm text-amber-400">{{ row.points || 0 }}</TableCell>
                  <TableCell class="text-center text-xs">
                    <span class="text-parchment-200">{{ row.td_for || 0 }}:{{ row.td_against || 0 }}</span>
                    <span :class="['ml-1 text-[11px] font-semibold', (row.td_diff || 0) >= 0 ? 'text-emerald-400' : 'text-red-400']">
                      ({{ (row.td_diff || 0) > 0 ? '+' : '' }}{{ row.td_diff || 0 }})
                    </span>
                  </TableCell>
                  <TableCell class="text-center text-xs">
                    <span class="text-parchment-200">{{ row.cas_for || 0 }}:{{ row.cas_against || 0 }}</span>
                    <span :class="['ml-1 text-[11px] font-semibold', (row.cas_diff || 0) >= 0 ? 'text-emerald-400' : 'text-red-400']">
                      ({{ (row.cas_diff || 0) > 0 ? '+' : '' }}{{ row.cas_diff || 0 }})
                    </span>
                  </TableCell>
                  <TableCell class="text-right text-xs text-parchment-400 pr-4 font-mono">
                    {{ formatGold(row.team_value || 0) }}
                  </TableCell>
                </TableRow>
              </template>
              <TableRow v-else>
                <TableCell colspan="11" class="text-center py-12 text-parchment-500">
                  Aún no hay partidos registrados en esta liga. ¡Comienza la temporada para ver la clasificación!
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- TAB 2: LÍDERES Y ESTADÍSTICAS -->
      <div v-if="activeTab === 'leaderboard'" class="space-y-6">
        <div>
          <h2 class="text-xl font-heading font-bold text-parchment-100">Cuadro de Honor de la Liga</h2>
          <p class="text-xs text-parchment-400">Los jugadores y equipos más determinantes de la competición</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Top Anotadores (Touchdowns) -->
          <Card class="border-blood-900/60 bg-charcoal-900/60">
            <CardHeader class="pb-3 border-b border-blood-900/40">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base font-heading flex items-center gap-2 text-amber-400">
                  <Flame class="w-4 h-4 text-amber-400" />
                  Máximos Anotadores
                </CardTitle>
                <span class="text-xs text-parchment-400">TDs</span>
              </div>
            </CardHeader>
            <CardContent class="pt-4 space-y-3">
              <template v-if="leaderboard?.top_scorers?.length">
                <div
                  v-for="(scorer, idx) in leaderboard.top_scorers"
                  :key="idx"
                  class="flex items-center justify-between text-sm py-1 border-b border-charcoal-800/80 last:border-0"
                >
                  <div class="flex items-center gap-2.5 overflow-hidden">
                    <span class="text-xs font-bold text-parchment-500 w-4">{{ idx + 1 }}.</span>
                    <div class="truncate">
                      <p class="font-heading font-semibold text-parchment-100 truncate">{{ scorer.player_name }}</p>
                      <p class="text-[11px] text-parchment-400 truncate">{{ scorer.team_name }}</p>
                    </div>
                  </div>
                  <Badge variant="gold" class="font-mono font-bold">{{ scorer.touchdowns }}</Badge>
                </div>
              </template>
              <p v-else class="text-xs text-parchment-500 text-center py-4">Sin datos de touchdowns registrados.</p>
            </CardContent>
          </Card>

          <!-- Top Violentos (Casualties) -->
          <Card class="border-blood-900/60 bg-charcoal-900/60">
            <CardHeader class="pb-3 border-b border-blood-900/40">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base font-heading flex items-center gap-2 text-blood-400">
                  <Skull class="w-4 h-4 text-blood-400" />
                  Terror del Campo (Bajas)
                </CardTitle>
                <span class="text-xs text-parchment-400">Bajas</span>
              </div>
            </CardHeader>
            <CardContent class="pt-4 space-y-3">
              <template v-if="leaderboard?.top_casualties?.length">
                <div
                  v-for="(cas, idx) in leaderboard.top_casualties"
                  :key="idx"
                  class="flex items-center justify-between text-sm py-1 border-b border-charcoal-800/80 last:border-0"
                >
                  <div class="flex items-center gap-2.5 overflow-hidden">
                    <span class="text-xs font-bold text-parchment-500 w-4">{{ idx + 1 }}.</span>
                    <div class="truncate">
                      <p class="font-heading font-semibold text-parchment-100 truncate">{{ cas.player_name }}</p>
                      <p class="text-[11px] text-parchment-400 truncate">{{ cas.team_name }}</p>
                    </div>
                  </div>
                  <Badge variant="default" class="font-mono font-bold">{{ cas.casualties }}</Badge>
                </div>
              </template>
              <p v-else class="text-xs text-parchment-500 text-center py-4">Sin bajas causadas todavía.</p>
            </CardContent>
          </Card>

          <!-- Top SPP (Jugadores Estrella) -->
          <Card class="border-blood-900/60 bg-charcoal-900/60">
            <CardHeader class="pb-3 border-b border-blood-900/40">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base font-heading flex items-center gap-2 text-parchment-200">
                  <Sparkles class="w-4 h-4 text-parchment-200" />
                  Estrellas en Ascenso (SPP)
                </CardTitle>
                <span class="text-xs text-parchment-400">SPP</span>
              </div>
            </CardHeader>
            <CardContent class="pt-4 space-y-3">
              <template v-if="leaderboard?.top_spp?.length">
                <div
                  v-for="(spp, idx) in leaderboard.top_spp"
                  :key="idx"
                  class="flex items-center justify-between text-sm py-1 border-b border-charcoal-800/80 last:border-0"
                >
                  <div class="flex items-center gap-2.5 overflow-hidden">
                    <span class="text-xs font-bold text-parchment-500 w-4">{{ idx + 1 }}.</span>
                    <div class="truncate">
                      <p class="font-heading font-semibold text-parchment-100 truncate">{{ spp.player_name }}</p>
                      <p class="text-[11px] text-parchment-400 truncate">{{ spp.team_name }}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" class="font-mono font-bold">{{ spp.spp }} SPP</Badge>
                </div>
              </template>
              <p v-else class="text-xs text-parchment-500 text-center py-4">Sin datos de SPP acumulados.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- TAB 3: JORNADAS Y PARTIDOS -->
      <div v-if="activeTab === 'rounds'" class="space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-xl font-heading font-bold text-parchment-100">Calendario de Jornadas</h2>
            <p class="text-xs text-parchment-400">Enfrentamientos programados y actas de partido</p>
          </div>
        </div>

        <div v-if="rounds.length > 0" class="space-y-6">
          <div
            v-for="round in rounds"
            :key="round.id"
            class="glass-panel rounded-xl p-5 border border-blood-900/50 space-y-4"
          >
            <div class="flex items-center justify-between border-b border-blood-900/40 pb-3">
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-1 rounded bg-blood-950 text-blood-400 font-heading font-bold text-xs uppercase border border-blood-800/60">
                  Jornada {{ round.round_number }}
                </span>
                <span class="text-sm font-semibold text-parchment-200">{{ round.name || `Ronda ${round.round_number}` }}</span>
              </div>
              <span v-if="round.start_date" class="text-xs text-parchment-500 flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" />
                {{ new Date(round.start_date).toLocaleDateString() }}
              </span>
            </div>

            <!-- Matches list for this round -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="m in round.matches"
                :key="m.id"
                class="p-4 rounded-lg bg-charcoal-900/80 border border-blood-950 hover:border-blood-800/60 transition-colors flex items-center justify-between gap-4"
              >
                <!-- Home Team -->
                <div class="flex-1 text-right">
                  <span class="font-heading font-bold text-parchment-100 text-sm block truncate">
                    {{ m.home_team_name || 'Local' }}
                  </span>
                </div>

                <!-- Score / Status -->
                <div class="px-3 py-1.5 rounded-md bg-charcoal-950 border border-blood-900/80 text-center shrink-0 min-w-[70px]">
                  <span v-if="m.status === 'COMPLETADO'" class="font-heading font-bold text-parchment-100 text-sm">
                    {{ m.home_score }} - {{ m.away_score }}
                  </span>
                  <span v-else class="text-xs uppercase font-medium text-parchment-500">
                    VS
                  </span>
                </div>

                <!-- Away Team -->
                <div class="flex-1 text-left">
                  <span class="font-heading font-bold text-parchment-100 text-sm block truncate">
                    {{ m.away_team_name || 'Visitante' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="glass-panel p-12 text-center rounded-xl border border-blood-900/40">
          <Calendar class="w-12 h-12 text-parchment-600 mx-auto mb-3" />
          <h3 class="font-heading font-bold text-parchment-200 text-base mb-1">Sin jornadas generadas</h3>
          <p class="text-xs text-parchment-400 max-w-md mx-auto">
            El comisario de la liga aún no ha generado el calendario de emparejamientos para esta temporada.
          </p>
        </div>
      </div>

      <!-- TAB 4: RECOMPENSAS (BOUNTIES) -->
      <div v-if="activeTab === 'bounties'" class="space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-xl font-heading font-bold text-parchment-100 flex items-center gap-2">
              <Skull class="w-5 h-5 text-red-500" />
              Tablón de Recompensas de Nuffle
            </h2>
            <p class="text-xs text-parchment-400">
              Ofrece oro a quien lesione de gravedad o retire a un jugador rival en esta liga
            </p>
          </div>

          <Button
            v-if="league.allow_bounties"
            variant="default"
            size="sm"
            class="flex items-center gap-1.5"
            @click="showBountyModal = true"
          >
            <Plus class="w-4 h-4" />
            <span>Poner Recompensa</span>
          </Button>
        </div>

        <div v-if="bounties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="b in bounties"
            :key="b.id"
            class="relative rounded-xl border border-blood-900/60 bg-gradient-to-b from-charcoal-900 to-blood-950/40 p-5 space-y-4 shadow-lg overflow-hidden"
          >
            <!-- Bounty stamp -->
            <div class="flex items-start justify-between">
              <Badge variant="danger" class="uppercase tracking-widest text-[10px] font-black">
                SE BUSCA
              </Badge>
              <div class="flex items-center gap-1 text-amber-400 font-heading font-black text-sm">
                <Coins class="w-4 h-4" />
                <span>{{ formatGold(b.bounty_amount) }}</span>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-heading font-bold text-parchment-100 flex items-center gap-1.5">
                <Crosshair class="w-4 h-4 text-blood-400" />
                {{ b.player_name || 'Jugador Marcado' }}
              </h3>
              <p class="text-xs text-parchment-400">Equipo: <strong class="text-parchment-200">{{ b.team_name || 'Desconocido' }}</strong></p>
            </div>

            <p class="text-xs text-parchment-300 italic bg-charcoal-950/60 p-3 rounded border border-blood-900/40">
              "{{ b.reward_description || 'Objetivo prioritario para la camilla.' }}"
            </p>

            <div class="pt-2 border-t border-blood-900/40 flex items-center justify-between text-[11px] text-parchment-500">
              <span>{{ b.is_claimed ? 'Cobrada por ' + b.claimed_by_team_name : 'Recompensa Activa' }}</span>
              <span v-if="b.is_claimed" class="text-emerald-400 font-bold">COBRADA</span>
              <span v-else class="text-red-400 font-bold">VIVO</span>
            </div>
          </div>
        </div>

        <div v-else class="glass-panel p-12 text-center rounded-xl border border-blood-900/40">
          <Crosshair class="w-12 h-12 text-parchment-600 mx-auto mb-3" />
          <h3 class="font-heading font-bold text-parchment-200 text-base mb-1">Sin recompensas activas</h3>
          <p class="text-xs text-parchment-400 max-w-md mx-auto">
            Ningún entrenador ha puesto precio a la cabeza de un rival todavía. ¿Quieres ser el primero en inaugurar el tablón?
          </p>
        </div>
      </div>

      <!-- TAB 5: EQUIPOS INSCRITOS -->
      <div v-if="activeTab === 'teams'" class="space-y-6">
        <div>
          <h2 class="text-xl font-heading font-bold text-parchment-100">Equipos Inscritos</h2>
          <p class="text-xs text-parchment-400">Las franquicias que lucharán por el trofeo</p>
        </div>

        <div v-if="league.teams && league.teams.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink
            v-for="t in league.teams"
            :key="t.id"
            :to="`/teams/${t.id}`"
            class="group p-5 rounded-xl border border-blood-900/40 bg-charcoal-900/60 hover:bg-blood-950/30 hover:border-blood-700/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-charcoal-800 text-parchment-400 border border-charcoal-700">
                  {{ t.race || 'Raza' }}
                </span>
                <span class="text-xs text-parchment-500 font-mono">{{ formatGold(t.team_value || 0) }}</span>
              </div>
              <h3 class="text-base font-heading font-bold text-parchment-100 group-hover:text-blood-400 transition-colors">
                {{ t.name }}
              </h3>
              <p v-if="t.coach_name" class="text-xs text-parchment-400 mt-1">Entrenador: <span class="text-parchment-200">{{ t.coach_name }}</span></p>
            </div>

            <div class="mt-4 pt-3 border-t border-blood-900/30 flex items-center justify-between text-xs text-parchment-400">
              <span>Ver plantilla completa</span>
              <ChevronRight class="w-4 h-4 text-blood-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>
        </div>

        <div v-else class="glass-panel p-12 text-center rounded-xl border border-blood-900/40">
          <Shield class="w-12 h-12 text-parchment-600 mx-auto mb-3" />
          <h3 class="font-heading font-bold text-parchment-200 text-base mb-1">Sin equipos inscritos</h3>
          <p class="text-xs text-parchment-400 max-w-md mx-auto">
            Aún no hay equipos inscritos en esta liga. Únete con tu equipo usando el código de invitación.
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL: PONER RECOMPENSA -->
    <div
      v-if="showBountyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-blood-800/80 shadow-2xl space-y-5 bg-charcoal-900">
        <div class="flex items-center justify-between border-b border-blood-900/40 pb-3">
          <div class="flex items-center gap-2">
            <Skull class="w-5 h-5 text-blood-500" />
            <h3 class="text-lg font-heading font-bold text-parchment-100">Poner Recompensa</h3>
          </div>
          <button
            type="button"
            @click="showBountyModal = false"
            class="text-parchment-400 hover:text-parchment-100 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="handleCreateBounty" class="space-y-4">
          <div v-if="bountyError" class="p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded-lg">
            {{ bountyError }}
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">ID del Jugador Objetivo *</label>
            <Input
              v-model="bountyForm.player_id"
              placeholder="UUID del jugador rival"
              required
            />
            <p class="text-[11px] text-parchment-500">Puedes encontrar la ID en la ficha del equipo rival.</p>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Oro Ofrecido (Tesorería) *</label>
            <Input
              v-model.number="bountyForm.bounty_amount"
              type="number"
              step="10000"
              min="10000"
              required
            />
            <p class="text-[11px] text-parchment-500">Mínimo 10.000 monedas de oro.</p>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Motivo / Mensaje</label>
            <textarea
              v-model="bountyForm.reward_description"
              rows="3"
              class="w-full rounded-md border border-blood-800/60 bg-charcoal-900/90 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-600 focus:outline-none focus:ring-2 focus:ring-blood-500 font-sans"
              placeholder="Ej: Por ese placaje traicionero de la temporada pasada."
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              @click="showBountyModal = false"
              :disabled="bountyLoading"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              :disabled="bountyLoading"
            >
              <span v-if="bountyLoading">Publicando...</span>
              <span v-else>Poner Precio</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
