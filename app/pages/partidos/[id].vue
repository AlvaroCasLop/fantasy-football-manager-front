<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Swords,
  ChevronLeft,
  Calendar,
  Shield,
  Award,
  Skull,
  Flame,
} from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import StatusBadge from '~/components/ui/StatusBadge.vue'

const route = useRoute()
const matchId = computed(() => route.params.id as string)

const { getMatchById } = useBloodBowl()
const match = computed(() => getMatchById(matchId.value) || {
  id: matchId.value,
  leagueId: 'l-01',
  leagueName: 'Liga del Viejo Mundo',
  round: 6,
  homeTeam: { id: 't-1', name: 'Reikland Reavers', race: 'Humanos', score: 2, casualties: 1 },
  awayTeam: { id: 't-2', name: 'Gouged Eye', race: 'Orcos', score: 1, casualties: 3 },
  date: 'Hoy, 20:30',
  status: 'programado',
  stadium: 'Reikland Meadow Stadium',
  mvp: 'Griff Oberwald Jr. (#1)',
})

useHead({
  title: computed(() =>
    `${match.value.homeTeam.name} vs ${match.value.awayTeam.name} · Blood Bowl Manager`
  ),
})
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <div>
      <NuxtLink
        to="/partidos"
        class="inline-flex items-center gap-1.5 text-xs text-content-secondary hover:text-content-primary transition-colors font-medium"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
        <span>Volver al Calendario</span>
      </NuxtLink>
    </div>

    <!-- Match Scoreboard Banner -->
    <div class="card-panel p-6 sm:p-8 space-y-6 text-center">
      <div class="flex items-center justify-center gap-2 text-2xs text-content-secondary">
        <span>{{ match.leagueName }}</span>
        <span>·</span>
        <span class="font-mono">Jornada {{ match.round }}</span>
        <span>·</span>
        <StatusBadge :status="match.status" size="sm" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <!-- Home -->
        <div class="space-y-1 md:text-right">
          <div class="w-12 h-12 rounded-lg bg-surface-muted border border-border mx-auto md:ml-auto md:mr-0 flex items-center justify-center mb-2">
            <Shield class="w-6 h-6 text-crimson" />
          </div>
          <h2 class="text-xl font-heading font-black text-content-primary">
            {{ match.homeTeam.name }}
          </h2>
          <span class="text-xs text-content-secondary font-mono">{{ match.homeTeam.race }}</span>
        </div>

        <!-- Center Score / Date -->
        <div class="space-y-2">
          <div class="text-4xl font-heading font-black text-content-primary tracking-widest font-mono">
            <span v-if="match.status === 'finalizado'">
              {{ match.homeTeam.score }} - {{ match.awayTeam.score }}
            </span>
            <span v-else class="text-content-muted text-2xl">
              VS
            </span>
          </div>
          <div class="inline-flex items-center gap-1.5 text-2xs text-content-muted bg-surface-muted px-2.5 py-1 rounded border border-border/60">
            <Calendar class="w-3 h-3" />
            <span>{{ match.date }} · {{ match.stadium || 'Estadio Oficial' }}</span>
          </div>
        </div>

        <!-- Away -->
        <div class="space-y-1 md:text-left">
          <div class="w-12 h-12 rounded-lg bg-surface-muted border border-border mx-auto md:mr-auto md:ml-0 flex items-center justify-center mb-2">
            <Shield class="w-6 h-6 text-blue-400" />
          </div>
          <h2 class="text-xl font-heading font-black text-content-primary">
            {{ match.awayTeam.name }}
          </h2>
          <span class="text-xs text-content-secondary font-mono">{{ match.awayTeam.race }}</span>
        </div>
      </div>
    </div>

    <!-- Match Events / Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card-panel p-4 space-y-3">
        <h3 class="text-xs font-heading font-bold text-content-primary flex items-center gap-1.5 border-b border-border pb-2">
          <Flame class="w-3.5 h-3.5 text-amber-400" />
          <span>Marcador y Anotaciones</span>
        </h3>
        <p class="text-xs text-content-secondary leading-relaxed">
          Encuentro programado según las normas oficiales de Blood Bowl 2025. El resultado se validará automáticamente tras la firma del acta por ambos entrenadores.
        </p>
      </div>

      <div class="card-panel p-4 space-y-3">
        <h3 class="text-xs font-heading font-bold text-content-primary flex items-center gap-1.5 border-b border-border pb-2">
          <Award class="w-3.5 h-3.5 text-crimson" />
          <span>Jugador Más Valioso (MVP)</span>
        </h3>
        <p class="text-xs text-content-secondary leading-relaxed">
          Asignación oficial: <strong class="text-content-primary">{{ match.mvp || 'Pendiente de votación' }}</strong> (+4 SPP tras el partido).
        </p>
      </div>
    </div>
  </div>
</template>
