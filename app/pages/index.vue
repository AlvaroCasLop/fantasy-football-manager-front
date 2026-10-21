<script setup lang="ts">
import { ref, onMounted } from 'vue'

const api = useApi()
const leagues = ref<any[]>([])
const hallOfFame = ref<any | null>(null)
const inviteCodeInput = ref('')
const loading = ref(true)
const joining = ref(false)
const joinError = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const [leaguesRes, hofRes] = await Promise.allSettled([
      api.getLeagues({ is_public: true }),
      api.getHallOfFame(5),
    ])

    if (leaguesRes.status === 'fulfilled') {
      leagues.value = leaguesRes.value || []
    }
    if (hofRes.status === 'fulfilled') {
      hallOfFame.value = hofRes.value || null
    }
  } catch (err) {
    console.error('Error loading home data:', err)
  } finally {
    loading.value = false
  }
}

const handleQuickJoin = async () => {
  if (!inviteCodeInput.value.trim()) return
  joining.value = true
  joinError.value = ''

  try {
    const code = inviteCodeInput.value.trim().toUpperCase()
    const league = await api.getLeagueByCode(code)
    if (league && league.id) {
      navigateTo(`/leagues/${league.id}`)
    } else {
      joinError.value = 'Código de invitación no encontrado.'
    }
  } catch (err: any) {
    joinError.value = 'No se encontró ninguna liga con este código.'
  } finally {
    joining.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="relative text-center pt-8 pb-12 overflow-hidden">
      <!-- Glow ambient circles -->
      <div class="absolute -top-10 left-1/4 w-72 h-72 bg-blood-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-20 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 max-w-4xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blood-950/80 border border-blood-700/50 text-blood-300 text-xs font-bold uppercase tracking-widest shadow-glow">
          <span>⚔️ TEMPORADA OFICIAL FANTASY FOOTBALL 2025/2026</span>
        </div>

        <h1 class="text-4xl sm:text-6xl md:text-7xl font-header font-black tracking-tight text-white leading-none uppercase">
          DOMINA EL TERRENO <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blood-500 via-amber-400 to-parchment-200">
            EN SANGRE Y GLORIA
          </span>
        </h1>

        <p class="text-sm sm:text-base text-parchment-200/70 max-w-2xl mx-auto leading-relaxed">
          Plataforma desacoplada de alto rendimiento para Blood Bowl. Gestión integral de clasificaciones, actas de partido en directo, cálculo automático de SPP y tablón de recompensas.
        </p>

        <!-- Action Bar: Explore or Join with Invite Code -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <NuxtLink
            to="/leagues"
            class="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blood-800 to-blood-600 hover:from-blood-700 hover:to-blood-500 text-parchment-200 border border-blood-500/50 shadow-glow transition-all active:scale-95 text-center"
          >
            Explorar Ligas Activas
          </NuxtLink>

          <!-- Quick Code Join Form -->
          <form @submit.prevent="handleQuickJoin" class="w-full sm:w-auto flex items-center gap-1.5 bg-charcoal-900/90 border border-white/10 rounded-xl p-1 shadow-xl">
            <input
              v-model="inviteCodeInput"
              type="text"
              placeholder="CÓDIGO: BB-XXXXXX"
              class="bg-transparent px-3 py-2 text-xs font-mono uppercase text-parchment-200 focus:outline-none w-36 placeholder:text-white/30"
              maxlength="12"
            />
            <button
              type="submit"
              :disabled="joining || !inviteCodeInput.trim()"
              class="px-3 py-2 rounded-lg text-xs font-bold uppercase bg-amber-600 hover:bg-amber-500 text-charcoal-950 transition-all disabled:opacity-50 cursor-pointer"
            >
              {{ joining ? '...' : 'Entrar' }}
            </button>
          </form>
        </div>
        <p v-if="joinError" class="text-xs text-red-400 font-mono">{{ joinError }}</p>
      </div>
    </section>

    <!-- Core Features Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink to="/leagues" class="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 block">
        <div class="w-12 h-12 rounded-xl bg-blood-950/80 border border-blood-700/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          🏆
        </div>
        <h2 class="text-base font-header font-bold uppercase text-parchment-200 mb-2">Clasificación & Ligas</h2>
        <p class="text-xs text-parchment-200/60 leading-relaxed">
          Tablas oficiales en tiempo real ordenadas por criterios Nuffle (Puntos, Dif. TD, CAS y TV) con soporte para grupos y conferencias.
        </p>
      </NuxtLink>

      <NuxtLink to="/teams" class="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 block">
        <div class="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          🛡️
        </div>
        <h2 class="text-base font-header font-bold uppercase text-parchment-200 mb-2">Gestión de Equipos</h2>
        <p class="text-xs text-parchment-200/60 leading-relaxed">
          Control de plantilla, tesorería, valor de equipo (TV), contratación de posicionales y subidas de nivel con gasto estricto de SPP.
        </p>
      </NuxtLink>

      <NuxtLink to="/hall-of-fame" class="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 block">
        <div class="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          ⭐
        </div>
        <h2 class="text-base font-header font-bold uppercase text-parchment-200 mb-2">Salón de la Fama</h2>
        <p class="text-xs text-parchment-200/60 leading-relaxed">
          Récords globales de la plataforma: máximos anotadores históricos, líderes en bajas, mejores equipos y entrenadores legendarios.
        </p>
      </NuxtLink>

      <NuxtLink to="/reference" class="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 block">
        <div class="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          📜
        </div>
        <h2 class="text-base font-header font-bold uppercase text-parchment-200 mb-2">Catálogo Oficial</h2>
        <p class="text-xs text-parchment-200/60 leading-relaxed">
          Reglas de la Temporada 3 (2025): todas las razas, fichas de jugadores estrella e índices completos de habilidades primarias y secundarias.
        </p>
      </NuxtLink>
    </section>

    <!-- Active Leagues Preview Section -->
    <section class="space-y-6">
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-header font-black uppercase text-white flex items-center gap-2">
            <span>🏟️</span> Ligas Destacadas
          </h2>
          <p class="text-xs text-parchment-200/60">Competiciones activas gestionadas por la API</p>
        </div>
        <NuxtLink to="/leagues" class="text-xs font-bold uppercase text-blood-400 hover:text-blood-300">
          Ver todas ({{ leagues.length }}) →
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12 text-sm text-parchment-200/50 animate-pulse font-mono">
        Consultando competiciones en FastAPI...
      </div>

      <div v-else-if="leagues.length === 0" class="glass-card rounded-2xl p-8 text-center text-parchment-200/60">
        <p class="text-base font-bold mb-2">No hay ligas públicas creadas todavía.</p>
        <p class="text-xs mb-4">Crea una nueva liga o conéctate con tu backend de desarrollo.</p>
        <NuxtLink to="/leagues" class="inline-block px-4 py-2 rounded-xl text-xs font-bold uppercase bg-blood-800 text-parchment-200">
          Crear Primera Liga
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="l in leagues.slice(0, 3)"
          :key="l.id"
          :to="`/leagues/${l.id}`"
          class="glass-card rounded-2xl p-6 group hover:border-blood-500/50 transition-all block relative"
        >
          <div class="flex items-start justify-between gap-2 mb-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blood-950 text-blood-300 border border-blood-800">
              {{ l.invite_code }}
            </span>
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" :class="l.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-charcoal-800 text-white/50'">
              {{ l.status }}
            </span>
          </div>

          <h3 class="text-lg font-header font-bold text-white group-hover:text-blood-400 transition-colors uppercase leading-tight mb-2">
            {{ l.name }}
          </h3>
          <p class="text-xs text-parchment-200/60 line-clamp-2 mb-4 leading-relaxed">
            {{ l.description || 'Sin descripción especificada.' }}
          </p>

          <div class="flex items-center justify-between text-xs pt-3 border-t border-white/5 font-mono text-parchment-200/70">
            <span>Equipos: {{ l.teams_count ?? 0 }}</span>
            <span class="capitalize">{{ l.format }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Hall of Fame Spotlight Section -->
    <section v-if="hallOfFame" class="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-900/30">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-amber-400">✨ Salón de la Fama</span>
          <h2 class="text-2xl font-header font-black uppercase text-white">Líderes de la Plataforma</h2>
        </div>
        <NuxtLink to="/hall-of-fame" class="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition-all text-center">
          Ver Salón Completo →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Top SPP -->
        <div class="bg-black/40 rounded-xl p-4 border border-white/5">
          <div class="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-2">⭐ Mayor SPP</div>
          <div v-if="hallOfFame.top_spp_players?.[0]">
            <div class="font-header font-bold text-white text-base truncate">{{ hallOfFame.top_spp_players[0].player_name }}</div>
            <div class="text-[10px] text-parchment-200/50 uppercase truncate">{{ hallOfFame.top_spp_players[0].team_name }}</div>
            <div class="text-xl font-header font-black text-amber-400 mt-2">{{ hallOfFame.top_spp_players[0].value }} <span class="text-[10px] text-white/50">SPP</span></div>
          </div>
          <div v-else class="text-xs text-white/30 italic">Sin datos registrados</div>
        </div>

        <!-- Top Scorer -->
        <div class="bg-black/40 rounded-xl p-4 border border-white/5">
          <div class="text-[10px] text-blood-400 font-bold uppercase tracking-wider mb-2">🏈 Máximo Anotador</div>
          <div v-if="hallOfFame.top_scorers_players?.[0]">
            <div class="font-header font-bold text-white text-base truncate">{{ hallOfFame.top_scorers_players[0].player_name }}</div>
            <div class="text-[10px] text-parchment-200/50 uppercase truncate">{{ hallOfFame.top_scorers_players[0].team_name }}</div>
            <div class="text-xl font-header font-black text-blood-400 mt-2">{{ hallOfFame.top_scorers_players[0].value }} <span class="text-[10px] text-white/50">TDs</span></div>
          </div>
          <div v-else class="text-xs text-white/30 italic">Sin datos registrados</div>
        </div>

        <!-- Most Violent -->
        <div class="bg-black/40 rounded-xl p-4 border border-white/5">
          <div class="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-2">💥 Más Violento</div>
          <div v-if="hallOfFame.top_violent_players?.[0]">
            <div class="font-header font-bold text-white text-base truncate">{{ hallOfFame.top_violent_players[0].player_name }}</div>
            <div class="text-[10px] text-parchment-200/50 uppercase truncate">{{ hallOfFame.top_violent_players[0].team_name }}</div>
            <div class="text-xl font-header font-black text-red-500 mt-2">{{ hallOfFame.top_violent_players[0].value }} <span class="text-[10px] text-white/50">Bajas</span></div>
          </div>
          <div v-else class="text-xs text-white/30 italic">Sin datos registrados</div>
        </div>

        <!-- Best Team -->
        <div class="bg-black/40 rounded-xl p-4 border border-white/5">
          <div class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">👑 Mejor Equipo</div>
          <div v-if="hallOfFame.top_teams?.[0]">
            <div class="font-header font-bold text-white text-base truncate">{{ hallOfFame.top_teams[0].team_name }}</div>
            <div class="text-[10px] text-parchment-200/50 uppercase truncate">{{ hallOfFame.top_teams[0].team_race }}</div>
            <div class="text-xl font-header font-black text-emerald-400 mt-2">{{ hallOfFame.top_teams[0].wins }} <span class="text-[10px] text-white/50">Victorias ({{ hallOfFame.top_teams[0].win_rate }}%)</span></div>
          </div>
          <div v-else class="text-xs text-white/30 italic">Sin datos registrados</div>
        </div>
      </div>
    </section>
  </div>
</template>
