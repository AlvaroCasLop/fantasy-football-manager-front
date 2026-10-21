<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  User,
  Settings,
  LogOut,
  ChevronUp,
  Shield,
} from 'lucide-vue-next'

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="menuRef" class="relative">
    <button
      type="button"
      class="w-full p-2 rounded-lg bg-surface/60 hover:bg-surface border border-border flex items-center justify-between gap-2.5 transition-colors text-left"
      @click="toggleMenu"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <!-- Coach Avatar -->
        <div class="w-8 h-8 rounded bg-crimson-dark/60 border border-crimson/50 flex items-center justify-center font-heading font-black text-xs text-content-primary shrink-0">
          G
        </div>
        <div class="truncate">
          <span class="text-xs font-heading font-bold text-content-primary block truncate">
            Grombrindal
          </span>
          <span class="text-2xs text-content-secondary block truncate">
            Comisario Oficial
          </span>
        </div>
      </div>
      <ChevronUp
        class="w-4 h-4 text-content-muted shrink-0 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute bottom-full left-0 right-0 mb-1.5 rounded-lg bg-surface border border-border shadow-dropdown p-1.5 space-y-0.5 z-50 text-xs"
    >
      <NuxtLink
        to="/entrenadores"
        class="flex items-center gap-2 px-2.5 py-2 rounded text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
        @click="isOpen = false"
      >
        <User class="w-3.5 h-3.5 text-content-muted" />
        <span>Mi Ficha de Entrenador</span>
      </NuxtLink>

      <NuxtLink
        to="/equipos"
        class="flex items-center gap-2 px-2.5 py-2 rounded text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
        @click="isOpen = false"
      >
        <Shield class="w-3.5 h-3.5 text-content-muted" />
        <span>Mis Franquicias</span>
      </NuxtLink>

      <NuxtLink
        to="/configuracion"
        class="flex items-center gap-2 px-2.5 py-2 rounded text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
        @click="isOpen = false"
      >
        <Settings class="w-3.5 h-3.5 text-content-muted" />
        <span>Configuración</span>
      </NuxtLink>

      <div class="border-t border-border/60 my-1" />

      <NuxtLink
        to="/login"
        class="flex items-center gap-2 px-2.5 py-2 rounded text-crimson hover:bg-crimson-dark/30 transition-colors"
        @click="isOpen = false"
      >
        <LogOut class="w-3.5 h-3.5" />
        <span>Cerrar Sesión</span>
      </NuxtLink>
    </div>
  </div>
</template>
