<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Trophy,
  Users,
  Shield,
  Award,
  Flame,
  Skull,
  Coins,
  Edit3,
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { formatGold } from '~/lib/utils'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Input from '~/components/ui/Input.vue'

const api = useApi()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const loading = ref(true)
const error = ref<string | null>(null)
const profile = ref<any>(null)
const myTeams = ref<any[]>([])

// Edit Profile Modal
const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref<string | null>(null)
const editForm = ref({
  title: '',
  motto: '',
  bio: '',
  naf_number: '',
  naf_name: '',
  preferred_color: '#8b0000'
})

const loadProfile = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await api.getMyProfile()
    profile.value = data
    if (data) {
      editForm.value = {
        title: data.title || '',
        motto: data.motto || '',
        bio: data.bio || '',
        naf_number: data.naf_number || '',
        naf_name: data.naf_name || '',
        preferred_color: data.preferred_color || '#8b0000'
      }
      if (data.id) {
        myTeams.value = await api.getCoachTeams(data.id)
      }
    }
  } catch (err: any) {
    // If not authenticated or profile not found yet, create fallback display
    profile.value = {
      username: user.value?.email?.split('@')[0] || 'Entrenador Novato',
      title: 'Técnico de la Federación',
      motto: 'Por Nuffle y por la gloria sangrienta.',
      stats: {
        total_played: 0,
        total_wins: 0,
        total_draws: 0,
        total_losses: 0,
        win_rate: 0,
        total_tds: 0,
        total_cas: 0,
        total_fouls: 0
      },
      trophies: []
    }
  } finally {
    loading.value = false
  }
}

const handleUpdateProfile = async () => {
  editLoading.value = true
  editError.value = null
  try {
    const updated = await api.updateMyProfile(editForm.value)
    profile.value = { ...profile.value, ...updated }
    showEditModal.value = false
  } catch (err: any) {
    editError.value = err?.data?.detail || 'Error actualizando perfil.'
  } finally {
    editLoading.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-10 h-10 border-4 border-blood-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-parchment-400">Consultando el expediente disciplinario del entrenador...</p>
    </div>

    <div v-else-if="profile" class="space-y-8">
      <!-- Profile Hero Banner -->
      <div class="relative overflow-hidden rounded-2xl border border-blood-900/70 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-blood-950/40 p-6 sm:p-8 shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <!-- Avatar / Coach Badge -->
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blood-800 to-charcoal-950 border-2 border-blood-600 flex items-center justify-center font-heading font-black text-3xl text-amber-400 shadow-xl shrink-0">
              {{ (profile.username || 'E')[0].toUpperCase() }}
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-heading font-black text-parchment-100">
                  {{ profile.username || 'Entrenador' }}
                </h1>
                <Badge variant="gold" class="text-xs">
                  {{ profile.title || 'Veterano' }}
                </Badge>
                <Badge v-if="profile.naf_number" variant="secondary" class="text-xs">
                  NAF #{{ profile.naf_number }}
                </Badge>
              </div>

              <p v-if="profile.motto" class="text-xs text-parchment-400 italic">
                "{{ profile.motto }}"
              </p>

              <p v-if="user?.email" class="text-[11px] text-parchment-500 font-mono">
                {{ user.email }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              class="flex items-center gap-1.5"
              @click="showEditModal = true"
            >
              <Edit3 class="w-4 h-4" />
              <span>Editar Perfil</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              class="text-red-400 hover:bg-red-950/40"
              @click="handleLogout"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <!-- Career Statistics Grid -->
      <div class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100 flex items-center gap-2">
          <Trophy class="w-5 h-5 text-amber-400" />
          <span>Palmarés y Estadísticas de Carrera</span>
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-parchment-500 font-semibold block">Partidos</span>
            <span class="text-xl font-heading font-bold text-parchment-100">{{ profile.stats?.total_played || 0 }}</span>
          </div>

          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-emerald-400 font-semibold block">Victorias</span>
            <span class="text-xl font-heading font-bold text-emerald-400">{{ profile.stats?.total_wins || 0 }}</span>
          </div>

          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-parchment-400 font-semibold block">Empates</span>
            <span class="text-xl font-heading font-bold text-parchment-300">{{ profile.stats?.total_draws || 0 }}</span>
          </div>

          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-red-400 font-semibold block">Derrotas</span>
            <span class="text-xl font-heading font-bold text-red-400">{{ profile.stats?.total_losses || 0 }}</span>
          </div>

          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-amber-400 font-semibold block">% Victoria</span>
            <span class="text-xl font-heading font-bold text-amber-400">
              {{ Math.round((profile.stats?.win_rate || 0) * 100) }}%
            </span>
          </div>

          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-amber-400 font-semibold block">TDs Totales</span>
            <span class="text-xl font-heading font-bold text-parchment-100">{{ profile.stats?.total_tds || 0 }}</span>
          </div>

          <div class="glass-panel p-4 rounded-xl border border-blood-900/40">
            <span class="text-[10px] uppercase text-blood-400 font-semibold block">Bajas Causadas</span>
            <span class="text-xl font-heading font-bold text-blood-400">{{ profile.stats?.total_cas || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Trophies & Cabinet -->
      <div class="space-y-4">
        <h2 class="text-xl font-heading font-bold text-parchment-100 flex items-center gap-2">
          <Award class="w-5 h-5 text-amber-400" />
          <span>Vitrina de Trofeos</span>
        </h2>

        <div v-if="profile.trophies && profile.trophies.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(t, idx) in profile.trophies"
            :key="idx"
            class="glass-panel p-4 rounded-xl border border-amber-500/40 flex items-center gap-4 bg-gradient-to-r from-charcoal-900 to-amber-950/20"
          >
            <Trophy class="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 class="font-heading font-bold text-parchment-100 text-sm">{{ t.tournament_name }}</h4>
              <p class="text-xs text-parchment-400">Equipo Campeón: <span class="text-parchment-200">{{ t.winning_team_name }}</span></p>
            </div>
          </div>
        </div>

        <div v-else class="glass-panel p-8 text-center rounded-xl border border-blood-900/40">
          <Trophy class="w-10 h-10 text-parchment-600 mx-auto mb-2" />
          <p class="text-xs text-parchment-400">
            Aún no has ganado ningún trofeo oficial. ¡Inscribe tus franquicias y compite en los playoffs de liga!
          </p>
        </div>
      </div>

      <!-- My Franchises Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-heading font-bold text-parchment-100 flex items-center gap-2">
            <Shield class="w-5 h-5 text-blood-500" />
            <span>Mis Franquicias Gestionadas</span>
          </h2>
          <NuxtLink to="/teams">
            <Button variant="default" size="sm" class="flex items-center gap-1.5">
              <Plus class="w-4 h-4" />
              <span>Fundar Nuevo Equipo</span>
            </Button>
          </NuxtLink>
        </div>

        <div v-if="myTeams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink
            v-for="team in myTeams"
            :key="team.id"
            :to="`/teams/${team.id}`"
            class="group glass-card p-5 rounded-xl border border-blood-900/50 hover:border-blood-700/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-charcoal-800 text-parchment-400 border border-charcoal-700">
                  {{ team.race }}
                </span>
                <span class="text-xs font-mono font-bold text-amber-400">
                  TV {{ formatGold(team.team_value || 0) }}
                </span>
              </div>
              <h3 class="font-heading font-bold text-parchment-100 text-base group-hover:text-blood-400 transition-colors">
                {{ team.name }}
              </h3>
            </div>

            <div class="flex items-center justify-between text-xs text-parchment-400 pt-3 border-t border-blood-900/30 mt-3">
              <span>{{ team.played || 0 }} Partidos ({{ team.wins || 0 }}V - {{ team.losses || 0 }}D)</span>
              <span class="text-amber-400 font-mono">{{ formatGold(team.treasury || 0) }}</span>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="glass-panel p-8 text-center rounded-xl border border-blood-900/40">
          <Shield class="w-10 h-10 text-parchment-600 mx-auto mb-2" />
          <p class="text-xs text-parchment-400 mb-4">
            No tienes ninguna franquicia a tu cargo.
          </p>
          <NuxtLink to="/teams">
            <Button variant="secondary" size="sm">Ir al Creador de Equipos</Button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- EDIT PROFILE MODAL -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-blood-800/80 shadow-2xl space-y-5 bg-charcoal-900">
        <div class="flex items-center justify-between border-b border-blood-900/40 pb-3">
          <div class="flex items-center gap-2">
            <Edit3 class="w-5 h-5 text-blood-500" />
            <h3 class="text-lg font-heading font-bold text-parchment-100">Actualizar Ficha de Entrenador</h3>
          </div>
          <button
            type="button"
            @click="showEditModal = false"
            class="text-parchment-400 hover:text-parchment-100 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <div v-if="editError" class="p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded-lg">
            {{ editError }}
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Título Honorífico</label>
            <Input
              v-model="editForm.title"
              placeholder="Ej: Gran Mariscal de Nuffle, Carnicero del Reik..."
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Lema del Entrenador</label>
            <Input
              v-model="editForm.motto"
              placeholder="Ej: Si no hay sangre, no cuenta como touchdown."
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Número NAF Oficial</label>
              <Input
                v-model="editForm.naf_number"
                placeholder="Ej: 12345"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-heading font-semibold text-parchment-300">Nombre NAF</label>
              <Input
                v-model="editForm.naf_name"
                placeholder="Nombre registrado"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-heading font-semibold text-parchment-300">Biografía / Historial</label>
            <textarea
              v-model="editForm.bio"
              rows="3"
              class="w-full rounded-md border border-blood-800/60 bg-charcoal-900/90 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-600 focus:outline-none focus:ring-2 focus:ring-blood-500 font-sans"
              placeholder="Cuéntale a la liga tu trayectoria táctica..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-blood-900/40">
            <Button
              type="button"
              variant="ghost"
              @click="showEditModal = false"
              :disabled="editLoading"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              :disabled="editLoading"
            >
              <span v-if="editLoading">Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
