<script setup lang="ts">
import { ref, onMounted } from 'vue'

const api = useApi()
const leagues = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')

// Modal state: Create League
const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')
const newLeague = ref({
  name: '',
  description: '',
  format: 'round_robin',
  is_double_round: false,
  is_public: true,
  game_mode: 'standard',
})

// Modal state: Join League
const showJoinModal = ref(false)
const joining = ref(false)
const joinError = ref('')
const joinCode = ref('')

const fetchLeagues = async () => {
  loading.value = true
  try {
    const data = await api.getLeagues()
    leagues.value = data || []
  } catch (err) {
    console.error('Error fetching leagues:', err)
  } finally {
    loading.value = false
  }
}

const filteredLeagues = computed(() => {
  return leagues.value.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (l.invite_code && l.invite_code.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesStatus =
      statusFilter.value === 'all' || l.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const handleCreateLeague = async () => {
  if (!newLeague.value.name.trim()) {
    createError.value = 'El nombre de la liga es obligatorio.'
    return
  }
  creating.value = true
  createError.value = ''

  try {
    const created = await api.createLeague(newLeague.value)
    showCreateModal.value = false
    newLeague.value = {
      name: '',
      description: '',
      format: 'round_robin',
      is_double_round: false,
      is_public: true,
      game_mode: 'standard',
    }
    await fetchLeagues()
    if (created && created.id) {
      navigateTo(`/leagues/${created.id}`)
    }
  } catch (err: any) {
    createError.value = err?.data?.detail || 'Error al crear la liga.'
  } finally {
    creating.value = false
  }
}

const handleJoinLeague = async () => {
  if (!joinCode.value.trim()) return
  joining.value = true
  joinError.value = ''

  try {
    const league = await api.getLeagueByCode(joinCode.value.trim().toUpperCase())
    if (league && league.id) {
      showJoinModal.value = false
      navigateTo(`/leagues/${league.id}`)
    } else {
      joinError.value = 'No se encontró ninguna liga con este código.'
    }
  } catch (err: any) {
    joinError.value = 'Código no encontrado o liga inexistente.'
  } finally {
    joining.value = false
  }
}

onMounted(() => {
  fetchLeagues()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        <div class="text-xs font-bold uppercase tracking-widest text-blood-400 mb-1">COMPETICIONES OFICIALES</div>
        <h1 class="text-3xl sm:text-4xl font-header font-black uppercase text-white">Ligas de Blood Bowl</h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="showJoinModal = true"
          class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-charcoal-800 hover:bg-charcoal-700 text-parchment-200 border border-white/10 transition-all cursor-pointer"
        >
          Unirse con Código
        </button>
        <button
          @click="showCreateModal = true"
          class="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blood-800 to-blood-600 hover:from-blood-700 hover:to-blood-500 text-parchment-200 border border-blood-500/50 shadow-glow transition-all active:scale-95 cursor-pointer"
        >
          + Nueva Liga
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="w-full sm:w-72 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o código..."
          class="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-parchment-200 placeholder:text-white/30 focus:outline-none focus:border-blood-500/60"
        />
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="text-xs text-parchment-200/50 font-bold uppercase">Estado:</span>
        <select
          v-model="statusFilter"
          class="bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-200 focus:outline-none"
        >
          <option value="all">Todas</option>
          <option value="draft">Borrador</option>
          <option value="active">Activas</option>
          <option value="completed">Finalizadas</option>
        </select>
      </div>
    </div>

    <!-- Leagues Grid -->
    <div v-if="loading" class="text-center py-20 text-sm font-mono text-parchment-200/50 animate-pulse">
      Cargando ligas desde FastAPI...
    </div>

    <div v-else-if="filteredLeagues.length === 0" class="glass-card rounded-2xl p-12 text-center text-parchment-200/60">
      <div class="text-4xl mb-3">🛡️</div>
      <h3 class="text-base font-bold text-white uppercase mb-1">No se encontraron ligas</h3>
      <p class="text-xs mb-4">Prueba ajustando los filtros de búsqueda o crea una nueva liga.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="l in filteredLeagues"
        :key="l.id"
        :to="`/leagues/${l.id}`"
        class="glass-card rounded-2xl p-6 group hover:border-blood-500/60 transition-all duration-300 block relative"
      >
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blood-950 text-blood-300 border border-blood-800">
            {{ l.invite_code }}
          </span>
          <span
            class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
            :class="l.status === 'active' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40' : 'bg-charcoal-800 text-white/50 border border-white/5'"
          >
            {{ l.status }}
          </span>
        </div>

        <h2 class="text-xl font-header font-bold text-white group-hover:text-blood-400 transition-colors uppercase leading-tight mb-2">
          {{ l.name }}
        </h2>

        <p class="text-xs text-parchment-200/60 line-clamp-2 mb-6 leading-relaxed">
          {{ l.description || 'Sin descripción especificada para esta liga.' }}
        </p>

        <div class="pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs font-mono text-parchment-200/70">
          <div>
            <span class="text-[10px] text-white/40 block uppercase">Equipos</span>
            <span class="font-bold text-parchment-200">{{ l.teams_count ?? 0 }}</span>
          </div>
          <div>
            <span class="text-[10px] text-white/40 block uppercase">Formato</span>
            <span class="font-bold text-parchment-200 capitalize">{{ l.format }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Modal: Create League -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="glass-panel rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-lg font-header font-bold uppercase text-white">Crear Nueva Liga</h3>
          <button @click="showCreateModal = false" class="text-white/50 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="handleCreateLeague" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-parchment-200/80 mb-1">Nombre de la Liga *</label>
            <input
              v-model="newLeague.name"
              type="text"
              required
              placeholder="Ej: Liga de Invierno Altdorf"
              class="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-200 focus:outline-none focus:border-blood-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-parchment-200/80 mb-1">Descripción</label>
            <textarea
              v-model="newLeague.description"
              rows="3"
              placeholder="Reglas locales, ritmo de jornadas..."
              class="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-200 focus:outline-none focus:border-blood-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase text-parchment-200/80 mb-1">Formato</label>
              <select
                v-model="newLeague.format"
                class="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-200 focus:outline-none"
              >
                <option value="round_robin">Round Robin (Todos vs Todos)</option>
                <option value="groups_playoffs">Grupos + Playoffs</option>
                <option value="conferences_groups">Conferencias</option>
                <option value="standard">Estándar</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-parchment-200/80 mb-1">Modo de Juego</label>
              <select
                v-model="newLeague.game_mode"
                class="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-200 focus:outline-none"
              >
                <option value="standard">Blood Bowl Estándar (11v11)</option>
                <option value="sevens">Blood Bowl Sevens (7v7)</option>
                <option value="dungeonbowl">Dungeonbowl</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input id="double_round" v-model="newLeague.is_double_round" type="checkbox" class="rounded accent-blood-600" />
            <label for="double_round" class="text-xs text-parchment-200/80">Ida y vuelta (Doble vuelta)</label>
          </div>

          <p v-if="createError" class="text-xs text-red-400">{{ createError }}</p>

          <div class="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-charcoal-800 hover:bg-charcoal-700 text-white/70"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-5 py-2 rounded-xl text-xs font-bold uppercase bg-blood-800 hover:bg-blood-700 text-parchment-200 border border-blood-500/50 shadow-glow disabled:opacity-50"
            >
              {{ creating ? 'Creando...' : 'Crear Liga' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Join League with Code -->
    <div v-if="showJoinModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="glass-panel rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-lg font-header font-bold uppercase text-white">Unirse a una Liga</h3>
          <button @click="showJoinModal = false" class="text-white/50 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="handleJoinLeague" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-parchment-200/80 mb-1">Código de Invitación</label>
            <input
              v-model="joinCode"
              type="text"
              required
              placeholder="BB-XXXXXX"
              class="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono uppercase text-parchment-200 focus:outline-none focus:border-blood-500 text-center"
              maxlength="12"
            />
          </div>

          <p v-if="joinError" class="text-xs text-red-400 font-mono">{{ joinError }}</p>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showJoinModal = false"
              class="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-charcoal-800 hover:bg-charcoal-700 text-white/70"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="joining || !joinCode.trim()"
              class="px-5 py-2 rounded-xl text-xs font-bold uppercase bg-amber-600 hover:bg-amber-500 text-charcoal-950 font-black disabled:opacity-50"
            >
              {{ joining ? 'Buscando...' : 'Acceder' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
