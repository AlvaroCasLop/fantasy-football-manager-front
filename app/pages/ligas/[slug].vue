<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Trophy,
  Users,
  Calendar,
  Shield,
  ChevronLeft,
  Swords,
} from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import MatchCard from '~/components/ui/MatchCard.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getLeagueBySlug, getTeams, getUpcomingMatches } = useBloodBowl()

const league = computed(() => getLeagueBySlug(slug.value))
const allTeams = getTeams()
const allMatches = getUpcomingMatches()

const activeTab = ref<'clasificacion' | 'jornadas' | 'equipos'>('clasificacion')

useHead({
  title: computed(() =>
    league.value
      ? `${league.value.name} · Blood Bowl Manager`
      : 'Detalle de Liga · Blood Bowl Manager'
  ),
})
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <div>
      <NuxtLink
        to="/ligas"
        class="inline-flex items-center gap-1.5 text-xs text-content-secondary hover:text-content-primary transition-colors font-medium"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
        <span>Volver a Ligas</span>
      </NuxtLink>
    </div>

    <!-- League Header Card -->
    <div v-if="league" class="card-panel p-5 sm:p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <StatusBadge :status="league.status" />
            <span class="text-2xs font-mono text-content-muted uppercase">
              {{ league.format }}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-heading font-black text-content-primary">
            {{ league.name }}
          </h1>
          <p v-if="league.description" class="text-xs text-content-secondary max-w-2xl leading-relaxed">
            {{ league.description }}
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 text-center text-xs">
          <div class="p-2.5 rounded bg-surface-muted border border-border">
            <span class="text-2xs text-content-muted block">Temporada</span>
            <span class="font-heading font-bold text-content-primary">{{ league.season }}</span>
          </div>
          <div class="p-2.5 rounded bg-surface-muted border border-border">
            <span class="text-2xs text-content-muted block">Equipos</span>
            <span class="font-heading font-bold text-content-primary">{{ league.teamsCount }} / {{ league.maxTeams }}</span>
          </div>
          <div class="p-2.5 rounded bg-surface-muted border border-border col-span-2 sm:col-span-1">
            <span class="text-2xs text-content-muted block">Progreso</span>
            <span class="font-heading font-bold text-crimson">Jornada {{ league.currentRound }}/{{ league.totalRounds }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-border/80 gap-2 pt-2">
        <button
          type="button"
          :class="[
            'px-3.5 py-2 text-xs font-heading font-medium border-b-2 transition-colors',
            activeTab === 'clasificacion'
              ? 'border-crimson text-content-primary font-bold'
              : 'border-transparent text-content-secondary hover:text-content-primary',
          ]"
          @click="activeTab = 'clasificacion'"
        >
          Clasificación
        </button>
        <button
          type="button"
          :class="[
            'px-3.5 py-2 text-xs font-heading font-medium border-b-2 transition-colors',
            activeTab === 'jornadas'
              ? 'border-crimson text-content-primary font-bold'
              : 'border-transparent text-content-secondary hover:text-content-primary',
          ]"
          @click="activeTab = 'jornadas'"
        >
          Jornadas y Partidos
        </button>
        <button
          type="button"
          :class="[
            'px-3.5 py-2 text-xs font-heading font-medium border-b-2 transition-colors',
            activeTab === 'equipos'
              ? 'border-crimson text-content-primary font-bold'
              : 'border-transparent text-content-secondary hover:text-content-primary',
          ]"
          @click="activeTab = 'equipos'"
        >
          Equipos Inscritos ({{ allTeams.length }})
        </button>
      </div>
    </div>

    <!-- TAB 1: Clasificación -->
    <div v-if="activeTab === 'clasificacion'" class="card-panel overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse table-dense">
          <thead>
            <tr>
              <th class="w-10 text-center">Pos</th>
              <th>Equipo</th>
              <th>Raza</th>
              <th class="text-center">PJ</th>
              <th class="text-center text-status-win">PG</th>
              <th class="text-center">PE</th>
              <th class="text-center text-status-loss">PP</th>
              <th class="text-center text-amber-400 font-bold">PTS</th>
              <th class="text-center">TD (Dif)</th>
              <th class="text-center">Bajas</th>
              <th class="text-right pr-4">TV</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(team, idx) in allTeams"
              :key="team.id"
              class="hover:bg-surface-hover/60 transition-colors"
            >
              <td class="text-center font-mono font-bold text-xs">
                <span
                  :class="[
                    'inline-flex items-center justify-center w-5 h-5 rounded-full text-2xs',
                    idx === 0 ? 'bg-amber-400 text-ground font-black' :
                    idx === 1 ? 'bg-slate-300 text-ground font-bold' :
                    idx === 2 ? 'bg-amber-700 text-content-primary font-bold' :
                    'text-content-muted'
                  ]"
                >
                  {{ idx + 1 }}
                </span>
              </td>
              <td>
                <NuxtLink
                  :to="`/equipos/${team.id}`"
                  class="font-heading font-bold text-xs text-content-primary hover:text-crimson transition-colors flex items-center gap-1.5"
                >
                  <Shield class="w-3.5 h-3.5 text-crimson" />
                  <span>{{ team.name }}</span>
                </NuxtLink>
              </td>
              <td class="text-2xs text-content-secondary">{{ team.race }}</td>
              <td class="text-center font-mono text-xs">{{ team.played }}</td>
              <td class="text-center font-mono text-xs text-status-win font-bold">{{ team.wins }}</td>
              <td class="text-center font-mono text-xs text-content-secondary">{{ team.draws }}</td>
              <td class="text-center font-mono text-xs text-status-loss">{{ team.losses }}</td>
              <td class="text-center font-mono text-xs font-black text-amber-400">{{ team.points }}</td>
              <td class="text-center font-mono text-xs">
                <span>{{ team.touchdownsFor }}:{{ team.touchdownsAgainst }}</span>
                <span class="text-2xs text-status-win ml-1">
                  (+{{ team.touchdownsFor - team.touchdownsAgainst }})
                </span>
              </td>
              <td class="text-center font-mono text-xs text-crimson font-bold">{{ team.casualtiesFor }}</td>
              <td class="text-right pr-4 font-mono text-xs text-content-secondary">
                {{ (team.teamValue / 1000).toFixed(0) }}k
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Jornadas y Partidos -->
    <div v-else-if="activeTab === 'jornadas'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <MatchCard
          v-for="m in allMatches"
          :key="m.id"
          :match="m"
        />
      </div>
    </div>

    <!-- TAB 3: Equipos Inscritos -->
    <div v-else-if="activeTab === 'equipos'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="t in allTeams"
        :key="t.id"
        :to="`/equipos/${t.id}`"
        class="card-panel p-4 hover:border-border-light hover:bg-surface-hover/50 transition-colors flex flex-col justify-between"
      >
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-2xs">
            <span class="px-2 py-0.5 rounded bg-surface-muted text-content-secondary font-mono border border-border">
              {{ t.race }}
            </span>
            <span class="font-mono text-amber-400 font-bold">
              TV {{ (t.teamValue / 1000).toFixed(0) }}k
            </span>
          </div>
          <h3 class="font-heading font-bold text-sm text-content-primary">
            {{ t.name }}
          </h3>
          <p class="text-2xs text-content-muted">
            Entrenador: <strong class="text-content-secondary">{{ t.coachName }}</strong>
          </p>
        </div>

        <div class="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-2xs text-content-secondary">
          <span>{{ t.played }} PJ ({{ t.wins }}V · {{ t.losses }}D)</span>
          <span class="text-crimson font-heading font-semibold">Ver plantilla →</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
