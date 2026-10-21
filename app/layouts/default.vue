<script setup lang="ts">
import { ref, onMounted } from 'vue'

const api = useApi()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const apiConnected = ref<boolean | null>(null)
const mobileMenuOpen = ref(false)

const checkApiStatus = async () => {
  try {
    await api.getHealth()
    apiConnected.value = true
  } catch {
    apiConnected.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}

onMounted(() => {
  checkApiStatus()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#0d0d10] text-[#f4e4c1]">
    <!-- Top Ambient Glow -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-gradient-to-b from-blood-900/25 to-transparent blur-3xl pointer-events-none z-0"></div>

    <!-- Navigation Header -->
    <header class="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blood-700 to-blood-900 border border-blood-500/50 flex items-center justify-center text-xl shadow-glow group-hover:scale-105 transition-transform">
            🏈
          </div>
          <div>
            <div class="font-header font-black text-base sm:text-lg tracking-wider text-parchment-200 flex items-center gap-1.5">
              <span>BLOOD BOWL</span>
              <span class="text-blood-500 text-xs px-1.5 py-0.5 rounded bg-blood-950/80 border border-blood-800">API</span>
            </div>
            <div class="text-[10px] text-parchment-200/50 font-bold uppercase tracking-widest leading-none">Manager Platform</div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/"
            class="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:text-white hover:bg-white/5"
            active-class="text-blood-400 bg-blood-950/40 border border-blood-800/40"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/leagues"
            class="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:text-white hover:bg-white/5"
            active-class="text-blood-400 bg-blood-950/40 border border-blood-800/40"
          >
            Ligas
          </NuxtLink>
          <NuxtLink
            to="/teams"
            class="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:text-white hover:bg-white/5"
            active-class="text-blood-400 bg-blood-950/40 border border-blood-800/40"
          >
            Equipos
          </NuxtLink>
          <NuxtLink
            to="/hall-of-fame"
            class="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:text-white hover:bg-white/5"
            active-class="text-blood-400 bg-blood-950/40 border border-blood-800/40"
          >
            🏆 Salón de la Fama
          </NuxtLink>
          <NuxtLink
            to="/reference"
            class="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:text-white hover:bg-white/5"
            active-class="text-blood-400 bg-blood-950/40 border border-blood-800/40"
          >
            Catálogo & Reglas
          </NuxtLink>
        </nav>

        <!-- Right Side: API Status & User Session -->
        <div class="hidden sm:flex items-center gap-3">
          <!-- API Status Pill -->
          <div
            class="px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 border"
            :class="apiConnected === true ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' : apiConnected === false ? 'bg-amber-950/60 text-amber-300 border-amber-800/50' : 'bg-charcoal-800 text-white/50 border-white/5'"
            :title="apiConnected === true ? 'FastAPI conectado y listo' : 'Verifica que FastAPI esté corriendo en puerto 8000 o Railway'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="apiConnected === true ? 'bg-emerald-400 animate-pulse' : apiConnected === false ? 'bg-amber-400' : 'bg-white/30'"></span>
            <span>FastAPI: {{ apiConnected === true ? 'ONLINE' : apiConnected === false ? 'OFFLINE' : '...' }}</span>
          </div>

          <!-- Auth Button / Profile -->
          <template v-if="user">
            <NuxtLink
              to="/profile"
              class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 transition-colors"
            >
              <div class="w-6 h-6 rounded-full bg-blood-800 text-parchment-200 text-xs font-bold flex items-center justify-center">
                {{ user.email?.[0]?.toUpperCase() || 'C' }}
              </div>
              <span class="text-xs font-bold text-parchment-200 truncate max-w-[120px]">
                {{ user.user_metadata?.username || user.email?.split('@')[0] || 'Mi Perfil' }}
              </span>
            </NuxtLink>
            <button
              @click="handleLogout"
              class="text-xs text-parchment-200/50 hover:text-parchment-200 p-2 rounded-lg hover:bg-white/5 transition-colors"
              title="Cerrar sesión"
            >
              ✕
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blood-800 hover:bg-blood-700 text-parchment-200 border border-blood-500/50 shadow-glow transition-all active:scale-95"
            >
              Iniciar Sesión
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-parchment-200 hover:bg-white/5"
        >
          <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 bg-charcoal-900/95 px-4 py-4 space-y-2">
        <NuxtLink
          to="/"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          Inicio
        </NuxtLink>
        <NuxtLink
          to="/leagues"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          Ligas & Clasificación
        </NuxtLink>
        <NuxtLink
          to="/teams"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          Equipos
        </NuxtLink>
        <NuxtLink
          to="/hall-of-fame"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          🏆 Salón de la Fama
        </NuxtLink>
        <NuxtLink
          to="/reference"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          Catálogo & Reglas
        </NuxtLink>
        <NuxtLink
          v-if="user"
          to="/profile"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-charcoal-800"
        >
          Mi Perfil de Entrenador
        </NuxtLink>
        <NuxtLink
          v-else
          to="/login"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-blood-800 text-center"
        >
          Iniciar Sesión
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content View -->
    <main class="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 glass-panel py-8 mt-16 text-center text-xs text-parchment-200/50">
      <div class="max-w-7xl mx-auto px-4 space-y-3">
        <div class="flex flex-wrap items-center justify-center gap-6 text-parchment-200/70">
          <NuxtLink to="/leagues" class="hover:text-parchment-200">Ligas Oficiales</NuxtLink>
          <NuxtLink to="/hall-of-fame" class="hover:text-parchment-200">Salón de la Fama</NuxtLink>
          <NuxtLink to="/reference" class="hover:text-parchment-200">Reglas 2025 & Nuffle</NuxtLink>
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener" class="hover:text-blood-400 flex items-center gap-1">
            API Docs (FastAPI) ↗
          </a>
        </div>
        <p>© 2026 Fantasy Football Manager Platform — Construido con Nuxt 4, Vue 3, Tailwind CSS & FastAPI.</p>
      </div>
    </footer>
  </div>
</template>
