<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '~/components/AppSidebar.vue'
import AppHeader from '~/components/AppHeader.vue'

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const openMobileSidebar = () => {
  mobileSidebarOpen.value = true
}

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-ground text-content-primary flex font-sans">
    <!-- Sidebar -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @toggle-collapse="toggleSidebar"
      @close-mobile="closeMobileSidebar"
    />

    <!-- Main Content Area -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-200',
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60',
      ]"
    >
      <!-- Top Header -->
      <AppHeader @open-mobile="openMobileSidebar" />

      <!-- Page View Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>

      <!-- Bottom Mini Footer -->
      <footer class="py-3 px-6 border-t border-border/40 text-center text-2xs text-content-muted flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Blood Bowl Manager · Sistema de Gestión Deportiva BB2025</span>
        <span class="font-mono">v1.2.0 · Federación Nuffle</span>
      </footer>
    </div>
  </div>
</template>
