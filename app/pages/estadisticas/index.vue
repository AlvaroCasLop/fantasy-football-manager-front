<script setup lang="ts">
import { ref } from 'vue'
import {
  BarChart3,
  Flame,
  Skull,
  Sparkles,
  Trophy,
} from 'lucide-vue-next'
import PageHeader from '~/components/ui/PageHeader.vue'

useHead({
  title: 'Estadísticas y Líderes · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'Líderes de anotación, bajas, puntos de estrellato y récords de temporada.',
    },
  ],
})

const topScorers = [
  { rank: 1, name: 'Johann Weiss', team: 'Reikland Reavers', race: 'Humanos', value: 8 },
  { rank: 2, name: 'Kritch Dientes-Afilados', team: 'Skavenblight Scramblers', race: 'Skaven', value: 7 },
  { rank: 3, name: 'Valen Swift', team: 'Darkside Cowboys', race: 'Elfos Oscuros', value: 6 },
  { rank: 4, name: 'Felix Baum', team: 'Reikland Reavers', race: 'Humanos', value: 4 },
  { rank: 5, name: 'Snikch', team: 'Skavenblight Scramblers', race: 'Skaven', value: 4 },
]

const topCasualties = [
  { rank: 1, name: 'Uglúk Rompe-Huesos', team: 'Gouged Eye', race: 'Orcos', value: 11 },
  { rank: 2, name: 'Olaf el Muro', team: 'Reikland Reavers', race: 'Humanos', value: 9 },
  { rank: 3, name: 'Gromril el Implacable', team: 'Dwarf Giants', race: 'Enanos', value: 8 },
  { rank: 4, name: 'Grashnak Black-Tooth', team: 'Gouged Eye', race: 'Orcos', value: 7 },
  { rank: 5, name: 'Plaguebearer Throt', team: 'Nurgle\'s Rotters', race: 'Nurgle', value: 6 },
]

const topSPP = [
  { rank: 1, name: 'Griff Oberwald Jr.', team: 'Reikland Reavers', race: 'Humanos', value: 24 },
  { rank: 2, name: 'Kurt Vance', team: 'Reikland Reavers', race: 'Humanos', value: 22 },
  { rank: 3, name: 'Olaf el Muro', team: 'Reikland Reavers', race: 'Humanos', value: 20 },
  { rank: 4, name: 'Hans Gruber', team: 'Reikland Reavers', race: 'Humanos', value: 18 },
  { rank: 5, name: 'Uglúk Rompe-Huesos', team: 'Gouged Eye', race: 'Orcos', value: 17 },
]
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Estadísticas y Líderes"
      subtitle="Los jugadores y franquicias más determinantes de todas las competiciones federadas."
    />

    <!-- Leaderboard Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Top Anotadores -->
      <div class="card-panel p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-border pb-2.5">
          <div class="flex items-center gap-1.5 text-amber-400">
            <Flame class="w-4 h-4" />
            <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-content-primary">
              Máximos Anotadores
            </h3>
          </div>
          <span class="text-2xs text-content-muted">TDs</span>
        </div>

        <div class="space-y-1.5">
          <div
            v-for="p in topScorers"
            :key="p.name"
            class="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 text-xs"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="font-mono text-content-muted text-2xs w-3.5">{{ p.rank }}.</span>
              <div class="truncate">
                <span class="font-heading font-semibold text-content-primary block truncate">{{ p.name }}</span>
                <span class="text-2xs text-content-muted block truncate">{{ p.team }}</span>
              </div>
            </div>
            <span class="font-mono font-bold text-amber-400 shrink-0">{{ p.value }}</span>
          </div>
        </div>
      </div>

      <!-- Más Violentos -->
      <div class="card-panel p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-border pb-2.5">
          <div class="flex items-center gap-1.5 text-crimson">
            <Skull class="w-4 h-4" />
            <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-content-primary">
              Bajas Causadas
            </h3>
          </div>
          <span class="text-2xs text-content-muted">Bajas</span>
        </div>

        <div class="space-y-1.5">
          <div
            v-for="p in topCasualties"
            :key="p.name"
            class="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 text-xs"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="font-mono text-content-muted text-2xs w-3.5">{{ p.rank }}.</span>
              <div class="truncate">
                <span class="font-heading font-semibold text-content-primary block truncate">{{ p.name }}</span>
                <span class="text-2xs text-content-muted block truncate">{{ p.team }}</span>
              </div>
            </div>
            <span class="font-mono font-bold text-crimson shrink-0">{{ p.value }}</span>
          </div>
        </div>
      </div>

      <!-- Puntos de Estrellato -->
      <div class="card-panel p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-border pb-2.5">
          <div class="flex items-center gap-1.5 text-blue-400">
            <Sparkles class="w-4 h-4" />
            <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-content-primary">
              Estrellas (SPP)
            </h3>
          </div>
          <span class="text-2xs text-content-muted">SPP</span>
        </div>

        <div class="space-y-1.5">
          <div
            v-for="p in topSPP"
            :key="p.name"
            class="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 text-xs"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="font-mono text-content-muted text-2xs w-3.5">{{ p.rank }}.</span>
              <div class="truncate">
                <span class="font-heading font-semibold text-content-primary block truncate">{{ p.name }}</span>
                <span class="text-2xs text-content-muted block truncate">{{ p.team }}</span>
              </div>
            </div>
            <span class="font-mono font-bold text-blue-400 shrink-0">{{ p.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
