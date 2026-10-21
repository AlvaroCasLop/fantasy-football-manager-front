<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, Search, Trophy, Skull, Flame } from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import PageHeader from '~/components/ui/PageHeader.vue'

useHead({
  title: 'Entrenadores y Tácticos · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'Estrategas y técnicos registrados en la federación.',
    },
  ],
})

const { getCoaches } = useBloodBowl()
const coaches = getCoaches()

const searchQuery = ref('')

const filteredCoaches = computed(() => {
  return coaches.value.filter((c) => {
    return (
      !searchQuery.value ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (c.nafNumber && c.nafNumber.includes(searchQuery.value))
    )
  })
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Entrenadores y Estrategas"
      subtitle="El registro oficial de comisarios y directores técnicos de Blood Bowl."
    />

    <!-- Search Bar -->
    <div class="card-panel p-3.5 flex items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-content-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, título o NAF..."
          class="w-full h-8 pl-8 pr-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors"
        >
      </div>
      <span class="text-2xs text-content-muted hidden sm:inline font-mono">
        {{ filteredCoaches.length }} entrenadores registrados
      </span>
    </div>

    <!-- Coaches Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="coach in filteredCoaches"
        :key="coach.id"
        class="card-panel p-5 space-y-3.5 hover:border-border-light transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-surface-muted border border-border flex items-center justify-center font-heading font-black text-sm text-crimson shrink-0">
              {{ coach.name.charAt(0) }}
            </div>
            <div>
              <h3 class="font-heading font-bold text-base text-content-primary">
                {{ coach.name }}
              </h3>
              <p class="text-2xs text-content-secondary">
                {{ coach.title }}
              </p>
            </div>
          </div>

          <span v-if="coach.nafNumber" class="px-2 py-0.5 rounded bg-surface-muted text-content-muted font-mono text-2xs border border-border">
            NAF #{{ coach.nafNumber }}
          </span>
        </div>

        <p v-if="coach.motto" class="text-2xs text-content-secondary italic bg-surface-muted/40 p-2.5 rounded border border-border/40">
          "{{ coach.motto }}"
        </p>

        <!-- Stats Bar -->
        <div class="grid grid-cols-4 gap-2 pt-1 border-t border-border/50 text-center text-xs">
          <div>
            <span class="text-2xs text-content-muted block">PJ</span>
            <span class="font-mono font-bold text-content-primary">{{ coach.stats.played }}</span>
          </div>
          <div>
            <span class="text-2xs text-status-win block">Victorias</span>
            <span class="font-mono font-bold text-status-win">{{ coach.stats.wins }}</span>
          </div>
          <div>
            <span class="text-2xs text-amber-400 block">% Vic.</span>
            <span class="font-mono font-bold text-amber-400">{{ Math.round(coach.stats.winRate * 100) }}%</span>
          </div>
          <div>
            <span class="text-2xs text-crimson block">Bajas</span>
            <span class="font-mono font-bold text-crimson">{{ coach.stats.casualties }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
