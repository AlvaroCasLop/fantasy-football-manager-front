<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Shield,
  Coins,
  Trophy,
  Users,
  Plus,
  AlertCircle,
  Skull,
  Sparkles,
  HeartPulse,
  UserCheck,
  Award,
  ChevronLeft
} from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { formatGold } from '~/lib/utils'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import Input from '~/components/ui/Input.vue'

const route = useRoute()
const api = useApi()
const teamId = computed(() => route.params.id as string)

const team = ref<any>(null)
const players = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Hire Player Modal
const showHireModal = ref(false)
const hireLoading = ref(false)
const hireError = ref<string | null>(null)
const newPlayer = ref({
  name: '',
  number: 1,
  position: 'Lineman',
  cost: 50000,
  ma: 6,
  st: 3,
  ag: '3+',
  pa: '4+',
  av: '8+'
})

const loadTeam = async () => {
  loading.value = true
  error.value = null
  try {
    const [teamData, playersData] = await Promise.allSettled([
      api.getTeam(teamId.value),
      api.getTeamPlayers(teamId.value)
    ])

    if (teamData.status === 'fulfilled') {
      team.value = teamData.value
      // If team detail already contains players
      if (team.value.players?.length) {
        players.value = team.value.players
      }
    } else {
      error.value = 'No se pudo encontrar el equipo especificado.'
      return
    }

    if (playersData.status === 'fulfilled' && (!players.value.length || playersData.value.length)) {
      players.value = playersData.value || []
    }

    // Set next available number
    if (players.value.length) {
      const maxNum = Math.max(...players.value.map((p) => p.number || 0))
      newPlayer.value.number = maxNum + 1 <= 16 ? maxNum + 1 : 1
    }
  } catch (err: any) {
    error.value = err?.message || 'Error cargando equipo'
  } finally {
    loading.value = false
  }
}

const handleHirePlayer = async () => {
  if (!newPlayer.value.name.trim()) {
    hireError.value = 'El nombre del jugador es obligatorio.'
    return
  }
  hireLoading.value = true
  hireError.value = null
  try {
    await api.hirePlayer(teamId.value, {
      ...newPlayer.value,
      team_id: teamId.value
    })
    showHireModal.value = false
    newPlayer.value.name = ''
    await loadTeam()
  } catch (err: any) {
    hireError.value = err?.data?.detail || 'Error al contratar jugador.'
  } finally {
    hireLoading.value = false
  }
}

onMounted(() => {
  loadTeam()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Back button -->
    <div>
      <NuxtLink to="/teams" class="inline-flex items-center gap-1.5 text-xs text-parchment-400 hover:text-parchment-100 transition-colors">
        <ChevronLeft class="w-4 h-4" />
        <span>Volver a Franquicias</span>
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-10 h-10 border-4 border-blood-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-parchment-400">Desenrollando pergaminos de la plantilla...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-8 text-center glass-panel rounded-xl border border-blood-900/60 max-w-xl mx-auto my-12">
      <AlertCircle class="w-12 h-12 text-blood-500 mx-auto mb-4" />
      <h2 class="text-xl font-heading font-bold text-parchment-100 mb-2">Error de Franquicia</h2>
      <p class="text-parchment-400 text-sm mb-6">{{ error }}</p>
      <NuxtLink to="/teams">
        <Button variant="secondary">Volver al listado de equipos</Button>
      </NuxtLink>
    </div>

    <!-- Team Content -->
    <div v-else-if="team" class="space-y-8">
      <!-- Team Banner -->
      <div class="relative overflow-hidden rounded-2xl border border-blood-900/70 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-blood-950/40 p-6 sm:p-8 shadow-2xl">
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded bg-charcoal-800 text-parchment-300 border border-charcoal-700">
                {{ team.race }}
              </span>
              <Badge variant="gold">
                TV {{ formatGold(team.team_value || 0) }}
              </Badge>
              <Badge v-if="team.apothecary" variant="green" class="flex items-center gap-1">
                <HeartPulse class="w-3 h-3" /> Boticario Disponible
              </Badge>
            </div>

            <h1 class="text-3xl sm:text-4xl font-heading font-black text-parchment-100 tracking-tight">
              {{ team.name }}
            </h1>

            <p class="text-sm text-parchment-400">
              Entrenador: <strong class="text-parchment-200">{{ team.coach_name || 'Desconocido' }}</strong>
            </p>
          </div>

          <!-- Staff / Treasury Stats Box -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 text-center shrink-0">
            <div class="p-3 rounded-xl border border-blood-800/40 bg-charcoal-900/80">
              <span class="text-[10px] uppercase tracking-wider text-parchment-400 block">Tesorería</span>
              <span class="text-sm font-mono font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Coins class="w-3.5 h-3.5" />
                {{ formatGold(team.treasury || 0) }}
              </span>
            </div>

            <div class="p-3 rounded-xl border border-blood-800/40 bg-charcoal-900/80">
              <span class="text-[10px] uppercase tracking-wider text-parchment-400 block">Segundas Oportunidades</span>
              <span class="text-sm font-heading font-bold text-parchment-100 block mt-0.5">
                {{ team.rerolls || 0 }} RR
              </span>
            </div>

            <div class="p-3 rounded-xl border border-blood-800/40 bg-charcoal-900/80">
              <span class="text-[10px] uppercase tracking-wider text-parchment-400 block">Hinchas Fieles</span>
              <span class="text-sm font-heading font-bold text-parchment-100 block mt-0.5">
                {{ team.dedicated_fans || 1 }} FF
              </span>
            </div>

            <div class="p-3 rounded-xl border border-blood-800/40 bg-charcoal-900/80">
              <span class="text-[10px] uppercase tracking-wider text-parchment-400 block">Asistentes / Animadoras</span>
              <span class="text-sm font-heading font-bold text-parchment-100 block mt-0.5">
                {{ team.assistant_coaches || 0 }} / {{ team.cheerleaders || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Record Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div class="glass-panel p-3 rounded-xl text-center border border-blood-900/40">
          <span class="text-[10px] uppercase text-parchment-500 font-semibold block">Partidos</span>
          <span class="text-lg font-heading font-bold text-parchment-100">{{ team.played || 0 }}</span>
        </div>
        <div class="glass-panel p-3 rounded-xl text-center border border-blood-900/40">
          <span class="text-[10px] uppercase text-emerald-400 font-semibold block">Victorias</span>
          <span class="text-lg font-heading font-bold text-emerald-400">{{ team.wins || 0 }}</span>
        </div>
        <div class="glass-panel p-3 rounded-xl text-center border border-blood-900/40">
          <span class="text-[10px] uppercase text-parchment-400 font-semibold block">Empates</span>
          <span class="text-lg font-heading font-bold text-parchment-200">{{ team.draws || 0 }}</span>
        </div>
        <div class="glass-panel p-3 rounded-xl text-center border border-blood-900/40">
          <span class="text-[10px] uppercase text-red-400 font-semibold block">Derrotas</span>
          <span class="text-lg font-heading font-bold text-red-400">{{ team.losses || 0 }}</span>
        </div>
        <div class="glass-panel p-3 rounded-xl text-center border border-blood-900/40">
          <span class="text-[10px] uppercase text-amber-400 font-semibold block">TDs (A favor / Contra)</span>
          <span class="text-lg font-heading font-bold text-parchment-100">{{ team.td_for || 0 }}:{{ team.td_against || 0 }}</span>
        </div>
        <div class="glass-panel p-3 rounded-xl text-center border border-blood-900/40">
          <span class="text-[10px] uppercase text-blood-400 font-semibold block">Bajas Causadas</span>
          <span class="text-lg font-heading font-bold text-blood-400">{{ team.cas_for || 0 }}</span>
        </div>
      </div>

      <!-- Players Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-xl font-heading font-bold text-parchment-100 flex items-center gap-2">
              <Users class="w-5 h-5 text-blood-500" />
              <span>Plantilla de Jugadores ({{ players.length }}/16)</span>
            </h2>
            <p class="text-xs text-parchment-400">
              Fichas individuales, atributos, habilidades adquiridas y SPP
            </p>
          </div>

          <Button
            variant="default"
            size="sm"
            class="flex items-center gap-1.5"
            :disabled="players.length >= 16"
            @click="showHireModal = true"
          >
            <Plus class="w-4 h-4" />
            <span>Fichar Jugador</span>
          </Button>
        </div>

        <!-- Roster Table -->
        <div class="glass-panel rounded-xl overflow-hidden border border-blood-900/60 shadow-xl">
          <Table>
            <TableHeader class="bg-charcoal-950/80">
              <TableRow>
                <TableHead class="w-12 text-center text-xs uppercase">#</TableHead>
                <TableHead class="text-xs uppercase">Nombre</TableHead>
                <TableHead class="text-xs uppercase">Posición</TableHead>
                <TableHead class="text-center text-xs uppercase w-10">MA</TableHead>
                <TableHead class="text-center text-xs uppercase w-10">ST</TableHead>
                <TableHead class="text-center text-xs uppercase w-10">AG</TableHead>
                <TableHead class="text-center text-xs uppercase w-10">PA</TableHead>
                <TableHead class="text-center text-xs uppercase w-10">AV</TableHead>
                <TableHead class="text-xs uppercase">Habilidades & Mejoras</TableHead>
                <TableHead class="text-center text-xs uppercase w-16">SPP</TableHead>
                <TableHead class="text-center text-xs uppercase w-20">Estado</TableHead>
                <TableHead class="text-right text-xs uppercase pr-4">Coste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="players.length > 0">
                <TableRow
                  v-for="p in players"
                  :key="p.id"
                  class="hover:bg-blood-950/20 transition-colors"
                >
                  <TableCell class="text-center font-mono font-bold text-sm text-parchment-300">
                    {{ p.number }}
                  </TableCell>
                  <TableCell>
                    <div class="font-heading font-semibold text-parchment-100 flex items-center gap-1.5">
                      <span>{{ p.name }}</span>
                      <Award v-if="p.is_captain" class="w-3.5 h-3.5 text-amber-400" title="Capitán del equipo" />
                    </div>
                  </TableCell>
                  <TableCell class="text-parchment-300 text-xs">{{ p.position }}</TableCell>
                  <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">
                    {{ p.ma }}
                  </TableCell>
                  <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">
                    {{ p.st }}
                  </TableCell>
                  <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">
                    {{ p.ag }}
                  </TableCell>
                  <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">
                    {{ p.pa || '-' }}
                  </TableCell>
                  <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">
                    {{ p.av }}
                  </TableCell>
                  <TableCell class="text-xs">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="(adv, idx) in (p.advancements || [])"
                        :key="idx"
                        class="px-1.5 py-0.5 rounded text-[10px] bg-blood-950 text-blood-300 border border-blood-800/60"
                      >
                        {{ adv.skill || adv }}
                      </span>
                      <span v-if="!p.advancements || !p.advancements.length" class="text-parchment-500 text-[11px] italic">
                        Estándar
                      </span>
                    </div>
                  </TableCell>
                  <TableCell class="text-center font-mono font-bold text-xs text-amber-400">
                    {{ p.spp || 0 }}
                  </TableCell>
                  <TableCell class="text-center">
                    <Badge
                      :variant="p.status === 'active' ? 'green' : p.status === 'dead' ? 'danger' : 'secondary'"
                      class="text-[10px] uppercase"
                    >
                      {{ p.status === 'active' ? 'Listo' : p.status }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-right text-xs text-parchment-300 pr-4 font-mono">
                    {{ formatGold(p.cost || 0) }}
                  </TableCell>
                </TableRow>
              </template>
              <TableRow v-else>
                <TableCell colspan="12" class="text-center py-12 text-parchment-500">
                  El vestuario está vacío. Ficha al menos 11 jugadores para poder disputar partidos oficiales.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>

    <!-- HIRE PLAYER MODAL -->
    <div
      v-if="showHireModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel w-full max-w-lg rounded-2xl p-6 border border-blood-800/80 shadow-2xl space-y-5 bg-charcoal-900 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-blood-900/40 pb-3">
          <div class="flex items-center gap-2">
            <UserCheck class="w-5 h-5 text-blood-500" />
            <h3 class="text-lg font-heading font-bold text-parchment-100">Fichar Jugador para la Plantilla</h3>
          </div>
          <button
            type="button"
            @click="showHireModal = false"
            class="text-parchment-400 hover:text-parchment-100 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="handleHirePlayer" class="space-y-4">
          <div v-if="hireError" class="p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded-lg">
            {{ hireError }}
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Dorsal (#) *</label>
              <Input
                v-model.number="newPlayer.number"
                type="number"
                min="1"
                max="16"
                required
              />
            </div>
            <div class="col-span-2 space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Nombre del Jugador *</label>
              <Input
                v-model="newPlayer.name"
                placeholder="Ej: Griff Oberwald, Varag..."
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Posición *</label>
              <Input
                v-model="newPlayer.position"
                placeholder="Ej: Lineman, Blitzer, Thrower, Catcher..."
                required
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Coste de Fichaje (Oro) *</label>
              <Input
                v-model.number="newPlayer.cost"
                type="number"
                step="5000"
                min="30000"
                required
              />
            </div>
          </div>

          <!-- Stats Line: MA / ST / AG / PA / AV -->
          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300 block">Línea de Atributos</label>
            <div class="grid grid-cols-5 gap-2">
              <div>
                <span class="text-[10px] text-parchment-400 block text-center mb-1">MA</span>
                <Input v-model.number="newPlayer.ma" type="number" min="1" max="10" class="text-center" />
              </div>
              <div>
                <span class="text-[10px] text-parchment-400 block text-center mb-1">ST</span>
                <Input v-model.number="newPlayer.st" type="number" min="1" max="8" class="text-center" />
              </div>
              <div>
                <span class="text-[10px] text-parchment-400 block text-center mb-1">AG</span>
                <Input v-model="newPlayer.ag" placeholder="3+" class="text-center" />
              </div>
              <div>
                <span class="text-[10px] text-parchment-400 block text-center mb-1">PA</span>
                <Input v-model="newPlayer.pa" placeholder="4+" class="text-center" />
              </div>
              <div>
                <span class="text-[10px] text-parchment-400 block text-center mb-1">AV</span>
                <Input v-model="newPlayer.av" placeholder="8+" class="text-center" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-blood-900/40">
            <Button
              type="button"
              variant="ghost"
              @click="showHireModal = false"
              :disabled="hireLoading"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              :disabled="hireLoading"
            >
              <span v-if="hireLoading">Firmando contrato...</span>
              <span v-else>Confirmar Fichaje</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
