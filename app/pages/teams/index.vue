<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Shield,
  Search,
  Plus,
  Coins,
  Trophy,
  Users,
  ChevronRight,
  Filter,
  Sparkles,
  Award
} from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { formatGold } from '~/lib/utils'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const api = useApi()

const teams = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedRace = ref('ALL')

// Create Team Modal
const showCreateModal = ref(false)
const createLoading = ref(false)
const createError = ref<string | null>(null)
const newTeam = ref({
  name: '',
  race: 'humans',
  treasury: 1000000,
  rerolls: 2,
  assistant_coaches: 0,
  cheerleaders: 0,
  apothecary: false,
  dedicated_fans: 1
})

const availableRaces = [
  { id: 'humans', name: 'Humanos' },
  { id: 'orcs', name: 'Orcos' },
  { id: 'skaven', name: 'Skaven' },
  { id: 'dwarfs', name: 'Enanos' },
  { id: 'wood_elves', name: 'Elfos Silvanos' },
  { id: 'chaos_chosen', name: 'Elegidos del Caos' },
  { id: 'dark_elves', name: 'Elfos Oscuros' },
  { id: 'undead', name: 'No-Muertos' },
  { id: 'lizardmen', name: 'Hombres Lagarto' },
  { id: 'necromantic_horror', name: 'Horror Necromántico' },
  { id: 'halflings', name: 'Halflings' },
  { id: 'goblins', name: 'Goblins' },
  { id: 'nurgle', name: 'Nurgle' },
  { id: 'norse', name: 'Nórdicos' },
  { id: 'tomb_kings', name: 'Reyes Funerarios' }
]

const loadTeams = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await api.getTeams()
    teams.value = data || []
  } catch (err: any) {
    error.value = err?.message || 'Error cargando equipos'
  } finally {
    loading.value = false
  }
}

const filteredTeams = computed(() => {
  return teams.value.filter((team) => {
    const matchesSearch = !searchQuery.value ||
      team.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (team.coach_name && team.coach_name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesRace = selectedRace.value === 'ALL' ||
      team.race?.toLowerCase() === selectedRace.value.toLowerCase()
    return matchesSearch && matchesRace
  })
})

const handleCreateTeam = async () => {
  if (!newTeam.value.name.trim()) {
    createError.value = 'El nombre del equipo es obligatorio.'
    return
  }
  createLoading.value = true
  createError.value = null
  try {
    const created = await api.createTeam(newTeam.value)
    showCreateModal.value = false
    newTeam.value.name = ''
    // Navigate to new team
    await navigateTo(`/teams/${created.id}`)
  } catch (err: any) {
    createError.value = err?.data?.detail || 'Error al fundar el equipo.'
  } finally {
    createLoading.value = false
  }
}

onMounted(() => {
  loadTeams()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-heading font-black text-parchment-100 flex items-center gap-3">
          <Shield class="w-8 h-8 text-blood-500" />
          <span>Equipos y Franquicias</span>
        </h1>
        <p class="text-sm text-parchment-400 mt-1">
          Rosters oficiales registrados en la Federación de Blood Bowl
        </p>
      </div>

      <Button
        variant="default"
        class="flex items-center gap-2 shadow-lg"
        @click="showCreateModal = true"
      >
        <Plus class="w-4 h-4" />
        <span>Fundar Nuevo Equipo</span>
      </Button>
    </div>

    <!-- Filters & Search -->
    <div class="glass-panel p-4 rounded-xl border border-blood-900/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 absolute left-3 top-3 text-parchment-500" />
        <Input
          v-model="searchQuery"
          placeholder="Buscar franquicia o entrenador..."
          class="pl-9"
        />
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <Filter class="w-4 h-4 text-parchment-400 shrink-0" />
        <select
          v-model="selectedRace"
          class="w-full sm:w-auto bg-charcoal-900 border border-blood-800/60 rounded-md px-3 py-2 text-sm text-parchment-100 focus:outline-none focus:ring-2 focus:ring-blood-500"
        >
          <option value="ALL">Todas las Razas</option>
          <option v-for="race in availableRaces" :key="race.id" :value="race.id">
            {{ race.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-10 h-10 border-4 border-blood-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-parchment-400">Consultando el libro de actas...</p>
    </div>

    <!-- Teams Grid -->
    <div v-else-if="filteredTeams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="team in filteredTeams"
        :key="team.id"
        :to="`/teams/${team.id}`"
        class="group glass-card rounded-xl border border-blood-900/50 p-6 flex flex-col justify-between hover:border-blood-700/80 transition-all hover:shadow-xl"
      >
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-charcoal-800 text-parchment-300 border border-charcoal-700">
              {{ team.race || 'Raza' }}
            </span>
            <span class="text-xs font-mono font-bold text-amber-400">
              TV {{ formatGold(team.team_value || 0) }}
            </span>
          </div>

          <h3 class="text-lg font-heading font-black text-parchment-100 group-hover:text-blood-400 transition-colors">
            {{ team.name }}
          </h3>

          <p v-if="team.coach_name" class="text-xs text-parchment-400 mt-1">
            Entrenador: <strong class="text-parchment-200">{{ team.coach_name }}</strong>
          </p>

          <!-- Record Stats -->
          <div class="grid grid-cols-4 gap-2 my-4 py-2 border-y border-blood-900/30 text-center text-xs">
            <div>
              <span class="text-parchment-500 block text-[10px]">PJ</span>
              <span class="font-bold text-parchment-200">{{ team.played || 0 }}</span>
            </div>
            <div>
              <span class="text-emerald-500/80 block text-[10px]">PG</span>
              <span class="font-bold text-emerald-400">{{ team.wins || 0 }}</span>
            </div>
            <div>
              <span class="text-parchment-500 block text-[10px]">PE</span>
              <span class="font-bold text-parchment-300">{{ team.draws || 0 }}</span>
            </div>
            <div>
              <span class="text-red-500/80 block text-[10px]">PP</span>
              <span class="font-bold text-red-400">{{ team.losses || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-parchment-400 pt-2">
          <div class="flex items-center gap-1 text-amber-400/90 font-mono">
            <Coins class="w-3.5 h-3.5" />
            <span>{{ formatGold(team.treasury || 0) }}</span>
          </div>
          <span class="flex items-center gap-1 group-hover:text-parchment-100 transition-colors">
            Ver Roster <ChevronRight class="w-3.5 h-3.5 text-blood-500 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="glass-panel p-16 text-center rounded-xl border border-blood-900/40 max-w-lg mx-auto">
      <Shield class="w-16 h-16 text-parchment-600 mx-auto mb-4" />
      <h3 class="text-lg font-heading font-bold text-parchment-200 mb-1">No se encontraron franquicias</h3>
      <p class="text-xs text-parchment-400 mb-6">
        No hay ningún equipo que coincida con tus criterios de búsqueda. ¡Crea el primero!
      </p>
      <Button variant="default" @click="showCreateModal = true">
        Fundar Equipo Ahora
      </Button>
    </div>

    <!-- CREATE TEAM MODAL -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel w-full max-w-lg rounded-2xl p-6 border border-blood-800/80 shadow-2xl space-y-5 bg-charcoal-900 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-blood-900/40 pb-3">
          <div class="flex items-center gap-2">
            <Shield class="w-5 h-5 text-blood-500" />
            <h3 class="text-lg font-heading font-bold text-parchment-100">Fundar Nueva Franquicia</h3>
          </div>
          <button
            type="button"
            @click="showCreateModal = false"
            class="text-parchment-400 hover:text-parchment-100 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="handleCreateTeam" class="space-y-4">
          <div v-if="createError" class="p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded-lg">
            {{ createError }}
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Nombre del Equipo *</label>
            <Input
              v-model="newTeam.name"
              placeholder="Ej: Reikland Reavers, Gouged Eye..."
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Raza / Facción *</label>
            <select
              v-model="newTeam.race"
              class="w-full bg-charcoal-900 border border-blood-800/60 rounded-md px-3 py-2 text-sm text-parchment-100 focus:outline-none focus:ring-2 focus:ring-blood-500"
            >
              <option v-for="race in availableRaces" :key="race.id" :value="race.id">
                {{ race.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Presupuesto Inicial (Oro)</label>
              <Input
                v-model.number="newTeam.treasury"
                type="number"
                step="50000"
                min="500000"
                max="2000000"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Segundas Oportunidades (RR)</label>
              <Input
                v-model.number="newTeam.rerolls"
                type="number"
                min="0"
                max="8"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Hinchas Fieles</label>
              <Input
                v-model.number="newTeam.dedicated_fans"
                type="number"
                min="1"
                max="6"
              />
            </div>
            <div class="flex items-center gap-2 pt-6">
              <input
                id="apothecary-checkbox"
                type="checkbox"
                v-model="newTeam.apothecary"
                class="w-4 h-4 rounded border-blood-800 bg-charcoal-900 text-blood-600 focus:ring-blood-500"
              />
              <label for="apothecary-checkbox" class="text-xs text-parchment-300 select-none">
                Contratar Boticario
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-blood-900/40">
            <Button
              type="button"
              variant="ghost"
              @click="showCreateModal = false"
              :disabled="createLoading"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              :disabled="createLoading"
            >
              <span v-if="createLoading">Inscribiendo...</span>
              <span v-else>Confirmar Franquicia</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
