<script setup lang="ts">
import { ref, computed } from 'vue'
import { Shield, Search, Plus, Filter, Coins } from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import PageHeader from '~/components/ui/PageHeader.vue'

useHead({
  title: 'Equipos y Franquicias · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'Franquicias federadas, valor de equipo y registros de temporada.',
    },
  ],
})

const { getTeams } = useBloodBowl()
const teams = getTeams()

const searchQuery = ref('')
const selectedRace = ref('ALL')

const filteredTeams = computed(() => {
  return teams.value.filter((t) => {
    const matchesSearch =
      !searchQuery.value ||
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.coachName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRace =
      selectedRace.value === 'ALL' || t.race.toLowerCase() === selectedRace.value.toLowerCase()
    return matchesSearch && matchesRace
  })
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Equipos y Franquicias"
      subtitle="Rosters registrados en la Federación Nuffle y su trayectoria deportiva."
    />

    <!-- Filter Bar -->
    <div class="card-panel p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-content-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar franquicia o entrenador..."
          class="w-full h-8 pl-8 pr-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors"
        >
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <Filter class="w-3.5 h-3.5 text-content-muted shrink-0" />
        <select
          v-model="selectedRace"
          class="w-full sm:w-auto h-8 px-2.5 rounded bg-surface-muted border border-border text-xs text-content-primary focus:outline-none focus:border-border-light transition-colors"
        >
          <option value="ALL">Todas las Razas</option>
          <option value="Humanos">Humanos</option>
          <option value="Orcos">Orcos</option>
          <option value="Skaven">Skaven</option>
          <option value="Enanos">Enanos</option>
          <option value="Elfos Oscuros">Elfos Oscuros</option>
          <option value="No-Muertos">No-Muertos</option>
          <option value="Nurgle">Nurgle</option>
        </select>
      </div>
    </div>

    <!-- Teams Table / Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="t in filteredTeams"
        :key="t.id"
        :to="`/equipos/${t.id}`"
        class="card-panel p-4.5 hover:border-border-light hover:bg-surface-hover/50 transition-colors flex flex-col justify-between group"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between text-2xs">
            <span class="px-2 py-0.5 rounded bg-surface-muted text-content-secondary font-mono border border-border">
              {{ t.race }}
            </span>
            <span class="font-mono text-amber-400 font-bold">
              TV {{ (t.teamValue / 1000).toFixed(0) }}k
            </span>
          </div>

          <h3 class="font-heading font-black text-base text-content-primary group-hover:text-crimson transition-colors">
            {{ t.name }}
          </h3>

          <p class="text-2xs text-content-muted">
            Entrenador: <strong class="text-content-secondary">{{ t.coachName }}</strong>
          </p>

          <!-- Record Stats -->
          <div class="grid grid-cols-4 gap-1.5 py-2 border-y border-border/40 text-center text-xs">
            <div>
              <span class="text-2xs text-content-muted block">PJ</span>
              <span class="font-bold text-content-primary font-mono">{{ t.played }}</span>
            </div>
            <div>
              <span class="text-2xs text-status-win block">PG</span>
              <span class="font-bold text-status-win font-mono">{{ t.wins }}</span>
            </div>
            <div>
              <span class="text-2xs text-content-muted block">PE</span>
              <span class="font-bold text-content-secondary font-mono">{{ t.draws }}</span>
            </div>
            <div>
              <span class="text-2xs text-status-loss block">PP</span>
              <span class="font-bold text-status-loss font-mono">{{ t.losses }}</span>
            </div>
          </div>
        </div>

        <div class="pt-2.5 flex items-center justify-between text-2xs text-content-secondary">
          <span class="flex items-center gap-1 font-mono text-amber-400/90">
            <Coins class="w-3 h-3" />
            {{ (t.treasury / 1000).toFixed(0) }}k oro
          </span>
          <span class="text-crimson font-heading font-semibold group-hover:translate-x-0.5 transition-transform">
            Ver plantilla →
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
