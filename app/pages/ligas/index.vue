<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trophy, Plus, Search, Filter } from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import PageHeader from '~/components/ui/PageHeader.vue'
import LeagueTable from '~/components/ui/LeagueTable.vue'
import CreateLeagueModal from '~/components/ui/CreateLeagueModal.vue'

useHead({
  title: 'Ligas y Competiciones · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'Listado oficial de ligas, copas y torneos en disputa.',
    },
  ],
})

const { getLeagues } = useBloodBowl()
const leagues = getLeagues()

const searchQuery = ref('')
const filterFormat = ref('ALL')
const isCreateModalOpen = ref(false)

const filteredLeagues = computed(() => {
  return leagues.value.filter((l) => {
    const matchesSearch =
      !searchQuery.value ||
      l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.season.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFormat =
      filterFormat.value === 'ALL' || l.format === filterFormat.value
    return matchesSearch && matchesFormat
  })
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Ligas y Competiciones"
      subtitle="Todas las temporadas oficiales activas y en fase de inscripción."
    >
      <template #actions>
        <button
          type="button"
          class="px-3.5 py-2 rounded bg-crimson hover:bg-crimson-hover text-xs font-heading font-bold text-content-primary transition-colors flex items-center gap-1.5 shadow-sm"
          @click="isCreateModalOpen = true"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Crear liga</span>
        </button>
      </template>
    </PageHeader>

    <!-- Filters & Search Bar -->
    <div class="card-panel p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-content-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar liga o temporada..."
          class="w-full h-8 pl-8 pr-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors"
        >
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <Filter class="w-3.5 h-3.5 text-content-muted shrink-0" />
        <select
          v-model="filterFormat"
          class="w-full sm:w-auto h-8 px-2.5 rounded bg-surface-muted border border-border text-xs text-content-primary focus:outline-none focus:border-border-light transition-colors"
        >
          <option value="ALL">Todos los formatos</option>
          <option value="Round Robin">Round Robin</option>
          <option value="Grupos + Eliminatoria">Grupos + Playoffs</option>
          <option value="Suizo">Sistema Suizo</option>
          <option value="Playoffs">Eliminatoria Directa</option>
        </select>
      </div>
    </div>

    <!-- League Table -->
    <LeagueTable :leagues="filteredLeagues" />

    <!-- Create League Modal -->
    <CreateLeagueModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
    />
  </div>
</template>
