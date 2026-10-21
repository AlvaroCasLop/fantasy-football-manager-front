<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  Shield,
  Trophy,
} from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'openMobile'): void
}>()

const route = useRoute()
const searchInput = ref('')
const showNotifications = ref(false)

const breadcrumb = computed(() => {
  const path = route.path
  if (path === '/') return { section: 'Panel de Control', current: 'Dashboard' }
  if (path.startsWith('/ligas')) return { section: 'Competiciones', current: 'Ligas' }
  if (path.startsWith('/equipos')) return { section: 'Franquicias', current: 'Equipos' }
  if (path.startsWith('/entrenadores')) return { section: 'Comunidad', current: 'Entrenadores' }
  if (path.startsWith('/partidos')) return { section: 'Calendario', current: 'Partidos' }
  if (path.startsWith('/estadisticas')) return { section: 'Métricas', current: 'Estadísticas' }
  if (path.startsWith('/configuracion')) return { section: 'Sistema', current: 'Configuración' }
  return { section: 'Blood Bowl', current: 'Manager' }
})
</script>

<template>
  <header class="h-14 bg-surface/70 border-b border-border px-4 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
    <!-- Left: Hamburger (mobile) + Breadcrumbs -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        type="button"
        class="p-1.5 rounded text-content-secondary hover:text-content-primary hover:bg-surface lg:hidden"
        title="Abrir menú"
        @click="emit('openMobile')"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div class="hidden sm:flex items-center gap-1.5 text-xs">
        <span class="text-content-muted">
          {{ breadcrumb.section }}
        </span>
        <ChevronRight class="w-3.5 h-3.5 text-content-muted" />
        <span class="font-heading font-bold text-content-primary">
          {{ breadcrumb.current }}
        </span>
      </div>
    </div>

    <!-- Center: Search bar -->
    <div class="flex-1 max-w-md mx-auto hidden md:block">
      <div class="relative">
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-content-muted" />
        <input
          v-model="searchInput"
          type="text"
          placeholder="Buscar ligas, equipos, entrenadores..."
          class="w-full h-8 pl-8 pr-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors font-sans"
        >
      </div>
    </div>

    <!-- Right: Notifications & Quick Profile -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- Notification Button -->
      <div class="relative">
        <button
          type="button"
          class="p-2 rounded text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors relative"
          title="Notificaciones"
          @click="showNotifications = !showNotifications"
        >
          <Bell class="w-4 h-4" />
          <span class="w-2 h-2 rounded-full bg-crimson absolute top-1.5 right-1.5 ring-2 ring-surface" />
        </button>

        <!-- Notification Dropdown -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-1.5 w-72 rounded-lg bg-surface border border-border shadow-dropdown p-3 space-y-2 z-50 text-xs"
        >
          <div class="flex items-center justify-between border-b border-border pb-1.5">
            <span class="font-heading font-bold text-content-primary">Notificaciones</span>
            <span class="text-2xs text-crimson font-medium">3 nuevas</span>
          </div>
          <div class="space-y-1.5">
            <div class="p-2 rounded bg-surface-muted/60 text-2xs space-y-0.5">
              <span class="font-bold text-content-primary block">Acta validada</span>
              <p class="text-content-secondary">Jornada 5 de Liga del Viejo Mundo confirmada.</p>
            </div>
            <div class="p-2 rounded bg-surface-muted/60 text-2xs space-y-0.5">
              <span class="font-bold text-content-primary block">Baja de jugador</span>
              <p class="text-content-secondary">Grashnak sufrió lesión permanente en la última ronda.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick User Pill -->
      <NuxtLink
        to="/entrenadores"
        class="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-surface-muted border border-border hover:border-border-light transition-colors"
      >
        <div class="w-5 h-5 rounded-full bg-crimson-dark flex items-center justify-center text-[10px] font-bold text-content-primary">
          G
        </div>
        <span class="text-xs font-heading font-semibold text-content-primary hidden sm:inline">
          Grombrindal
        </span>
      </NuxtLink>
    </div>
  </header>
</template>
