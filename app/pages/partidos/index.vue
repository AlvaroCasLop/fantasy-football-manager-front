<script setup lang="ts">
import { ref, computed } from 'vue'
import { Swords, Calendar, Filter } from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import PageHeader from '~/components/ui/PageHeader.vue'
import MatchCard from '~/components/ui/MatchCard.vue'

useHead({
  title: 'Calendario de Partidos · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'Enfrentamientos oficiales, resultados y actas de jornada.',
    },
  ],
})

const { getUpcomingMatches } = useBloodBowl()
const matches = getUpcomingMatches()

const statusFilter = ref<'all' | 'programado' | 'finalizado'>('all')

const filteredMatches = computed(() => {
  if (statusFilter.value === 'all') return matches.value
  return matches.value.filter((m) => m.status === statusFilter.value)
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Calendario y Encuentros"
      subtitle="Partidos programados, marcadores en directo y actas oficiales validadas."
    />

    <!-- Filter Pills -->
    <div class="card-panel p-3 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          :class="[
            'px-3 py-1.5 rounded text-xs font-heading font-medium transition-colors',
            statusFilter === 'all'
              ? 'bg-crimson text-content-primary font-bold'
              : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover',
          ]"
          @click="statusFilter = 'all'"
        >
          Todos los Partidos
        </button>
        <button
          type="button"
          :class="[
            'px-3 py-1.5 rounded text-xs font-heading font-medium transition-colors',
            statusFilter === 'programado'
              ? 'bg-crimson text-content-primary font-bold'
              : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover',
          ]"
          @click="statusFilter = 'programado'"
        >
          Próximos Encuentros
        </button>
        <button
          type="button"
          :class="[
            'px-3 py-1.5 rounded text-xs font-heading font-medium transition-colors',
            statusFilter === 'finalizado'
              ? 'bg-crimson text-content-primary font-bold'
              : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover',
          ]"
          @click="statusFilter = 'finalizado'"
        >
          Finalizados
        </button>
      </div>

      <span class="text-2xs text-content-muted font-mono hidden sm:inline">
        {{ filteredMatches.length }} encuentros listados
      </span>
    </div>

    <!-- Matches Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="m in filteredMatches"
        :key="m.id"
        class="relative group"
      >
        <MatchCard :match="m" />
        <NuxtLink
          :to="`/partidos/${m.id}`"
          class="absolute inset-0 z-10"
          title="Ver acta del partido"
        />
      </div>
    </div>
  </div>
</template>
