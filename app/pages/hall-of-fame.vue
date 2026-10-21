<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Trophy,
  Flame,
  Skull,
  Sparkles,
  Shield,
  Crown,
  Users,
  Award,
  Zap,
  ChevronRight,
  TrendingUp
} from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { formatGold } from '~/lib/utils'
import Badge from '~/components/ui/Badge.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'

const api = useApi()
const loading = ref(true)
const error = ref<string | null>(null)
const hof = ref<any>(null)
const activeTab = ref<'summary' | 'spp' | 'scorers' | 'violent' | 'teams' | 'coaches'>('summary')

const loadHallOfFame = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await api.getHallOfFame(10)
    hof.value = data
  } catch (err: any) {
    error.value = err?.message || 'Error cargando el Salón de la Fama'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHallOfFame()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Hero Banner -->
    <div class="relative overflow-hidden rounded-2xl border border-blood-900/70 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-blood-950/40 p-8 sm:p-10 shadow-2xl text-center">
      <div class="relative z-10 max-w-2xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-heading font-bold uppercase tracking-wider">
          <Crown class="w-3.5 h-3.5" />
          <span>Inmortalidad en Blood Bowl</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-heading font-black text-parchment-100 tracking-tight">
          Salón de la Fama
        </h1>
        <p class="text-parchment-300 text-sm sm:text-base leading-relaxed">
          Los nombres de aquellos jugadores, franquicias y estrategas grabados en el mármol eterno del templo de Nuffle.
        </p>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex overflow-x-auto border-b border-blood-900/40 gap-2 pb-1 scrollbar-thin">
      <button
        type="button"
        @click="activeTab = 'summary'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'summary'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Crown class="w-4 h-4 text-amber-400" />
        <span>Resumen General</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'spp'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'spp'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Sparkles class="w-4 h-4 text-parchment-200" />
        <span>Puntos de Estrellato (SPP)</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'scorers'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'scorers'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Flame class="w-4 h-4 text-amber-400" />
        <span>Máximos Anotadores (TD)</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'violent'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'violent'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Skull class="w-4 h-4 text-blood-400" />
        <span>Carniceros del Campo (Bajas)</span>
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
        <span>Equipos Legendarios</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'coaches'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'coaches'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Users class="w-4 h-4 text-emerald-400" />
        <span>Estrategas Ilustres</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="w-10 h-10 border-4 border-blood-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-parchment-400">Consultando los anales de la historia...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-8 text-center glass-panel rounded-xl border border-blood-900/60 max-w-xl mx-auto">
      <p class="text-blood-400 text-sm mb-4">{{ error }}</p>
      <button @click="loadHallOfFame" class="text-xs text-parchment-300 underline">Reintentar</button>
    </div>

    <!-- Content -->
    <div v-else-if="hof" class="space-y-8">
      <!-- TAB: RESUMEN GENERAL -->
      <div v-if="activeTab === 'summary'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Top SPP -->
        <Card class="border-blood-900/60 bg-charcoal-900/70">
          <CardHeader class="pb-3 border-b border-blood-900/40">
            <CardTitle class="text-base font-heading flex items-center justify-between text-amber-400">
              <span class="flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                Leyendas SPP
              </span>
              <button @click="activeTab = 'spp'" class="text-xs text-parchment-400 hover:text-parchment-100">Ver todo</button>
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-4 space-y-3">
            <template v-if="hof.top_spp_players?.length">
              <div
                v-for="(p, idx) in hof.top_spp_players.slice(0, 5)"
                :key="p.player_id"
                class="flex items-center justify-between text-sm py-1.5 border-b border-charcoal-800/80 last:border-0"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <span
                    class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    :class="idx === 0 ? 'bg-amber-400 text-charcoal-950' : idx === 1 ? 'bg-slate-300 text-charcoal-950' : idx === 2 ? 'bg-amber-700 text-parchment-100' : 'text-parchment-500'"
                  >
                    {{ idx + 1 }}
                  </span>
                  <div class="truncate">
                    <p class="font-heading font-semibold text-parchment-100 text-xs truncate">{{ p.player_name }}</p>
                    <p class="text-[10px] text-parchment-400 truncate">{{ p.team_name }} ({{ p.team_race }})</p>
                  </div>
                </div>
                <Badge variant="gold" class="font-mono text-xs font-bold">{{ p.value }} SPP</Badge>
              </div>
            </template>
            <p v-else class="text-xs text-parchment-500 text-center py-6">Aún no hay leyendas consagradas.</p>
          </CardContent>
        </Card>

        <!-- Top Touchdowns -->
        <Card class="border-blood-900/60 bg-charcoal-900/70">
          <CardHeader class="pb-3 border-b border-blood-900/40">
            <CardTitle class="text-base font-heading flex items-center justify-between text-amber-400">
              <span class="flex items-center gap-2">
                <Flame class="w-4 h-4" />
                Máximos Anotadores
              </span>
              <button @click="activeTab = 'scorers'" class="text-xs text-parchment-400 hover:text-parchment-100">Ver todo</button>
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-4 space-y-3">
            <template v-if="hof.top_scorers_players?.length">
              <div
                v-for="(p, idx) in hof.top_scorers_players.slice(0, 5)"
                :key="p.player_id"
                class="flex items-center justify-between text-sm py-1.5 border-b border-charcoal-800/80 last:border-0"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <span
                    class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    :class="idx === 0 ? 'bg-amber-400 text-charcoal-950' : idx === 1 ? 'bg-slate-300 text-charcoal-950' : idx === 2 ? 'bg-amber-700 text-parchment-100' : 'text-parchment-500'"
                  >
                    {{ idx + 1 }}
                  </span>
                  <div class="truncate">
                    <p class="font-heading font-semibold text-parchment-100 text-xs truncate">{{ p.player_name }}</p>
                    <p class="text-[10px] text-parchment-400 truncate">{{ p.team_name }}</p>
                  </div>
                </div>
                <Badge variant="gold" class="font-mono text-xs font-bold">{{ p.value }} TD</Badge>
              </div>
            </template>
            <p v-else class="text-xs text-parchment-500 text-center py-6">Sin anotaciones históricas registradas.</p>
          </CardContent>
        </Card>

        <!-- Top Casualties -->
        <Card class="border-blood-900/60 bg-charcoal-900/70">
          <CardHeader class="pb-3 border-b border-blood-900/40">
            <CardTitle class="text-base font-heading flex items-center justify-between text-blood-400">
              <span class="flex items-center gap-2">
                <Skull class="w-4 h-4 text-blood-400" />
                Más Violentos
              </span>
              <button @click="activeTab = 'violent'" class="text-xs text-parchment-400 hover:text-parchment-100">Ver todo</button>
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-4 space-y-3">
            <template v-if="hof.top_violent_players?.length">
              <div
                v-for="(p, idx) in hof.top_violent_players.slice(0, 5)"
                :key="p.player_id"
                class="flex items-center justify-between text-sm py-1.5 border-b border-charcoal-800/80 last:border-0"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <span
                    class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    :class="idx === 0 ? 'bg-amber-400 text-charcoal-950' : idx === 1 ? 'bg-slate-300 text-charcoal-950' : idx === 2 ? 'bg-amber-700 text-parchment-100' : 'text-parchment-500'"
                  >
                    {{ idx + 1 }}
                  </span>
                  <div class="truncate">
                    <p class="font-heading font-semibold text-parchment-100 text-xs truncate">{{ p.player_name }}</p>
                    <p class="text-[10px] text-parchment-400 truncate">{{ p.team_name }}</p>
                  </div>
                </div>
                <Badge variant="danger" class="font-mono text-xs font-bold">{{ p.value }} Bajas</Badge>
              </div>
            </template>
            <p v-else class="text-xs text-parchment-500 text-center py-6">Sin bajas letales registradas.</p>
          </CardContent>
        </Card>
      </div>

      <!-- TAB: SPP DETALLADO -->
      <div v-if="activeTab === 'spp'" class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100">Top Estrellas por Puntos de Estrellato</h2>
        <div class="glass-panel rounded-xl overflow-hidden border border-blood-900/60">
          <div
            v-for="(p, idx) in (hof.top_spp_players || [])"
            :key="p.player_id"
            class="flex items-center justify-between p-4 border-b border-blood-900/30 hover:bg-blood-950/20 transition-colors"
          >
            <div class="flex items-center gap-4">
              <span class="w-8 font-heading font-black text-lg text-center" :class="idx === 0 ? 'text-amber-400' : 'text-parchment-500'">
                #{{ idx + 1 }}
              </span>
              <div>
                <p class="font-heading font-bold text-parchment-100 text-base">{{ p.player_name }}</p>
                <p class="text-xs text-parchment-400">
                  Posición: <span class="text-parchment-200">{{ p.player_position }}</span> | Franquicia: <span class="text-parchment-200">{{ p.team_name }}</span> ({{ p.team_race }})
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-lg font-mono font-bold text-amber-400">{{ p.value }} SPP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: SCORERS DETALLADO -->
      <div v-if="activeTab === 'scorers'" class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100">Máximos Anotadores de Todos los Tiempos</h2>
        <div class="glass-panel rounded-xl overflow-hidden border border-blood-900/60">
          <div
            v-for="(p, idx) in (hof.top_scorers_players || [])"
            :key="p.player_id"
            class="flex items-center justify-between p-4 border-b border-blood-900/30 hover:bg-blood-950/20 transition-colors"
          >
            <div class="flex items-center gap-4">
              <span class="w-8 font-heading font-black text-lg text-center" :class="idx === 0 ? 'text-amber-400' : 'text-parchment-500'">
                #{{ idx + 1 }}
              </span>
              <div>
                <p class="font-heading font-bold text-parchment-100 text-base">{{ p.player_name }}</p>
                <p class="text-xs text-parchment-400">
                  {{ p.team_name }} ({{ p.team_race }})
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-lg font-mono font-bold text-amber-400">{{ p.value }} Touchdowns</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: VIOLENT DETALLADO -->
      <div v-if="activeTab === 'violent'" class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100">Terror del Campo: Bajas Causadas</h2>
        <div class="glass-panel rounded-xl overflow-hidden border border-blood-900/60">
          <div
            v-for="(p, idx) in (hof.top_violent_players || [])"
            :key="p.player_id"
            class="flex items-center justify-between p-4 border-b border-blood-900/30 hover:bg-blood-950/20 transition-colors"
          >
            <div class="flex items-center gap-4">
              <span class="w-8 font-heading font-black text-lg text-center" :class="idx === 0 ? 'text-red-500' : 'text-parchment-500'">
                #{{ idx + 1 }}
              </span>
              <div>
                <p class="font-heading font-bold text-parchment-100 text-base">{{ p.player_name }}</p>
                <p class="text-xs text-parchment-400">
                  {{ p.team_name }} ({{ p.team_race }})
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-lg font-mono font-bold text-blood-400">{{ p.value }} Bajas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: EQUIPOS DETALLADO -->
      <div v-if="activeTab === 'teams'" class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100">Franquicias Más Laureadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(team, idx) in (hof.top_teams || [])"
            :key="team.team_id"
            class="glass-panel p-5 rounded-xl border border-blood-900/50 flex flex-col justify-between"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="font-heading font-black text-lg text-amber-400">#{{ idx + 1 }}</span>
                <div>
                  <h3 class="font-heading font-bold text-parchment-100 text-base">{{ team.team_name }}</h3>
                  <p class="text-xs text-parchment-400">{{ team.team_race }}</p>
                </div>
              </div>
              <Badge variant="gold">
                {{ Math.round((team.win_rate || 0) * 100) }}% Victorias
              </Badge>
            </div>

            <div class="grid grid-cols-4 gap-2 pt-3 border-t border-blood-900/30 text-center text-xs">
              <div>
                <span class="text-parchment-500 block text-[10px]">PJ</span>
                <span class="font-bold text-parchment-200">{{ team.played }}</span>
              </div>
              <div>
                <span class="text-emerald-400 block text-[10px]">PG</span>
                <span class="font-bold text-emerald-400">{{ team.wins }}</span>
              </div>
              <div>
                <span class="text-amber-400 block text-[10px]">TD</span>
                <span class="font-bold text-amber-400">{{ team.td_for }}</span>
              </div>
              <div>
                <span class="text-blood-400 block text-[10px]">CAS</span>
                <span class="font-bold text-blood-400">{{ team.cas_for }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: COACHES DETALLADO -->
      <div v-if="activeTab === 'coaches'" class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100">Top Entrenadores y Tácticos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="(coach, idx) in (hof.top_coaches || [])"
            :key="coach.id"
            class="glass-card p-5 rounded-xl border border-blood-900/60 space-y-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blood-950 border border-blood-800 flex items-center justify-center font-heading font-black text-amber-400">
                #{{ idx + 1 }}
              </div>
              <div>
                <h4 class="font-heading font-bold text-parchment-100">{{ coach.username || 'Entrenador' }}</h4>
                <p class="text-[11px] text-parchment-400">{{ coach.title || 'Veterano de Nuffle' }}</p>
              </div>
            </div>

            <div v-if="coach.stats" class="grid grid-cols-3 gap-2 pt-2 border-t border-blood-900/30 text-center text-xs">
              <div>
                <span class="text-parchment-500 text-[10px] block">Victorias</span>
                <span class="font-bold text-emerald-400">{{ coach.stats.total_wins }}</span>
              </div>
              <div>
                <span class="text-parchment-500 text-[10px] block">% Vic.</span>
                <span class="font-bold text-amber-400">{{ Math.round((coach.stats.win_rate || 0) * 100) }}%</span>
              </div>
              <div>
                <span class="text-parchment-500 text-[10px] block">Bajas</span>
                <span class="font-bold text-blood-400">{{ coach.stats.total_cas }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
