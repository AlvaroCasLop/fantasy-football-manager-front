<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Trophy,
  Shield,
  Users,
  Swords,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  X,
} from 'lucide-vue-next'
import UserMenu from './UserMenu.vue'

const props = defineProps<{
  collapsed: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleCollapse'): void
  (e: 'closeMobile'): void
}>()

const route = useRoute()

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Ligas', path: '/ligas', icon: Trophy },
  { name: 'Equipos', path: '/equipos', icon: Shield },
  { name: 'Entrenadores', path: '/entrenadores', icon: Users },
  { name: 'Partidos', path: '/partidos', icon: Swords },
  { name: 'Estadísticas', path: '/estadisticas', icon: BarChart3 },
  { name: 'Configuración', path: '/configuracion', icon: Settings },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
      @click="emit('closeMobile')"
    />

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 z-40 bg-sidebar border-r border-border transition-all duration-200 flex flex-col justify-between',
        // Desktop collapsing
        collapsed ? 'w-16' : 'w-60',
        // Mobile sliding
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Top: Brand Header -->
      <div class="h-14 flex items-center justify-between px-3.5 border-b border-border shrink-0">
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 overflow-hidden group"
          @click="emit('closeMobile')"
        >
          <!-- Spiked Emblem Logo -->
          <div class="w-8 h-8 rounded bg-crimson flex items-center justify-center font-heading font-black text-sm text-content-primary shadow-sm group-hover:bg-crimson-hover transition-colors shrink-0">
            BB
          </div>
          <div v-if="!collapsed" class="truncate">
            <span class="font-heading font-black text-sm tracking-wide text-content-primary block leading-tight">
              BLOOD BOWL
            </span>
            <span class="text-[9px] uppercase tracking-widest text-crimson font-mono font-bold block leading-tight">
              MANAGER
            </span>
          </div>
        </NuxtLink>

        <!-- Mobile Close Button -->
        <button
          type="button"
          class="p-1 rounded text-content-muted hover:text-content-primary lg:hidden"
          @click="emit('closeMobile')"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Desktop Collapse Button -->
        <button
          v-if="!collapsed"
          type="button"
          class="hidden lg:flex p-1 rounded text-content-muted hover:text-content-primary hover:bg-surface transition-colors"
          title="Colapsar menú lateral"
          @click="emit('toggleCollapse')"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
      </div>

      <!-- Center: Nav Items List -->
      <nav class="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-heading transition-colors group relative',
            isActive(item.path)
              ? 'bg-crimson/15 text-content-primary font-bold border-l-2 border-crimson'
              : 'text-content-secondary hover:text-content-primary hover:bg-surface/60 font-medium',
            collapsed ? 'justify-center px-0' : '',
          ]"
          :title="collapsed ? item.name : undefined"
          @click="emit('closeMobile')"
        >
          <component
            :is="item.icon"
            :class="[
              'w-4 h-4 shrink-0 transition-colors',
              isActive(item.path) ? 'text-crimson' : 'text-content-muted group-hover:text-content-primary',
            ]"
          />
          <span v-if="!collapsed" class="truncate">
            {{ item.name }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Bottom: User & Status Widget -->
      <div class="p-2.5 border-t border-border shrink-0 space-y-2">
        <div v-if="collapsed" class="flex justify-center">
          <button
            type="button"
            class="p-1.5 rounded text-content-muted hover:text-content-primary hover:bg-surface transition-colors"
            title="Expandir menú lateral"
            @click="emit('toggleCollapse')"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <UserMenu v-else />
      </div>
    </aside>
  </div>
</template>
