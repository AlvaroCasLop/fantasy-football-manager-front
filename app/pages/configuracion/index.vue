<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Shield, Bell, Database, Check } from 'lucide-vue-next'
import PageHeader from '~/components/ui/PageHeader.vue'

useHead({
  title: 'Configuración · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'Ajustes de la aplicación, reglamento deportivo e integraciones de servidor.',
    },
  ],
})

const saved = ref(false)
const appSettings = ref({
  ruleEdition: 'Blood Bowl 2025 (Official)',
  allowBounties: true,
  enableSppProgression: true,
  autoValidateMatches: false,
  notificationAlerts: true,
  apiEndpoint: 'http://localhost:8000/api/v1',
})

const handleSave = () => {
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2500)
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <PageHeader
      title="Configuración de la Aplicación"
      subtitle="Reglamento federativo, parámetros de liga e integraciones del sistema."
    />

    <form class="space-y-5" @submit.prevent="handleSave">
      <!-- Section: Reglamento Deportivo -->
      <div class="card-panel p-5 space-y-4">
        <h3 class="text-xs font-heading font-bold uppercase tracking-wider text-content-primary flex items-center gap-2 border-b border-border pb-2.5">
          <Shield class="w-4 h-4 text-crimson" />
          <span>Reglamento y Competición</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
              Edición Oficial de Reglas
            </label>
            <input
              v-model="appSettings.ruleEdition"
              type="text"
              class="w-full h-8 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary focus:outline-none focus:border-border-light"
            >
          </div>

          <div class="space-y-1">
            <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
              Puntos por Victoria / Empate / Derrota
            </label>
            <input
              type="text"
              value="3 pts / 1 pt / 0 pts"
              disabled
              class="w-full h-8 px-3 rounded bg-surface-muted border border-border text-xs text-content-muted cursor-not-allowed font-mono"
            >
          </div>
        </div>

        <div class="space-y-2 pt-1">
          <label class="flex items-center gap-2.5 cursor-pointer text-xs text-content-primary">
            <input
              v-model="appSettings.allowBounties"
              type="checkbox"
              class="w-4 h-4 rounded bg-surface-muted border-border text-crimson focus:ring-crimson"
            >
            <span>Habilitar tablón de recompensas (Bounties) sobre jugadores rivales</span>
          </label>

          <label class="flex items-center gap-2.5 cursor-pointer text-xs text-content-primary">
            <input
              v-model="appSettings.enableSppProgression"
              type="checkbox"
              class="w-4 h-4 rounded bg-surface-muted border-border text-crimson focus:ring-crimson"
            >
            <span>Aplicar tabla oficial de costes de SPP para mejoras de atributos y habilidades</span>
          </label>
        </div>
      </div>

      <!-- Section: Servidor e Integración -->
      <div class="card-panel p-5 space-y-4">
        <h3 class="text-xs font-heading font-bold uppercase tracking-wider text-content-primary flex items-center gap-2 border-b border-border pb-2.5">
          <Database class="w-4 h-4 text-blue-400" />
          <span>Conexión Backend (FastAPI)</span>
        </h3>

        <div class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Punto de Enlace API (FastAPI Base URL)
          </label>
          <input
            v-model="appSettings.apiEndpoint"
            type="text"
            class="w-full h-8 px-3 rounded bg-surface-muted border border-border text-xs font-mono text-content-primary focus:outline-none focus:border-border-light"
          >
          <p class="text-2xs text-content-muted">
            Dirección del backend para sincronización de actas, autenticación y persistencia de base de datos.
          </p>
        </div>
      </div>

      <!-- Submit Action -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <span v-if="saved" class="text-xs text-status-win flex items-center gap-1 font-medium animate-in fade-in">
          <Check class="w-4 h-4" />
          <span>Ajustes guardados correctamente</span>
        </span>

        <button
          type="submit"
          class="px-4 py-2 rounded bg-crimson hover:bg-crimson-hover text-xs font-heading font-bold text-content-primary transition-colors shadow-sm"
        >
          Guardar Configuración
        </button>
      </div>
    </form>
  </div>
</template>
