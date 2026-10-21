<script setup lang="ts">
import { ref } from 'vue'
import { Trophy, X } from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import type { League } from '~/types/blood-bowl'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', league: League): void
}>()

const { createLeague } = useBloodBowl()

const name = ref('')
const season = ref('Temporada 2026')
const format = ref<League['format']>('Round Robin')
const maxTeams = ref(8)
const description = ref('')
const loading = ref(false)

const handleCreate = () => {
  if (!name.value.trim()) return
  loading.value = true

  const created = createLeague({
    name: name.value.trim(),
    season: season.value,
    format: format.value,
    maxTeams: Number(maxTeams.value),
    description: description.value.trim(),
  })

  loading.value = false
  emit('created', created)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[2px]">
    <div class="w-full max-w-md rounded-lg bg-surface border border-border shadow-dropdown p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border pb-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded bg-crimson-dark/40 border border-crimson/30 text-crimson">
            <Trophy class="w-4 h-4" />
          </div>
          <h2 class="text-sm font-heading font-bold text-content-primary">
            Crear Nueva Liga
          </h2>
        </div>
        <button
          type="button"
          class="text-content-muted hover:text-content-primary p-1 rounded hover:bg-surface-hover transition-colors"
          @click="emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form -->
      <form class="space-y-3.5" @submit.prevent="handleCreate">
        <div class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Nombre de la Competición *
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Ej: Copa de los Reinos, Liga Imperial..."
            required
            class="w-full h-9 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-crimson transition-colors"
          >
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
              Temporada
            </label>
            <input
              v-model="season"
              type="text"
              class="w-full h-9 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary focus:outline-none focus:border-crimson transition-colors"
            >
          </div>

          <div class="space-y-1">
            <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
              Máx. Equipos
            </label>
            <select
              v-model.number="maxTeams"
              class="w-full h-9 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary focus:outline-none focus:border-crimson transition-colors"
            >
              <option :value="4">4 Equipos</option>
              <option :value="8">8 Equipos</option>
              <option :value="12">12 Equipos</option>
              <option :value="16">16 Equipos</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Formato de Competición
          </label>
          <select
            v-model="format"
            class="w-full h-9 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary focus:outline-none focus:border-crimson transition-colors"
          >
            <option value="Round Robin">Round Robin (Liga todos contra todos)</option>
            <option value="Grupos + Eliminatoria">Fase de Grupos + Playoffs</option>
            <option value="Playoffs">Eliminatoria Directa</option>
            <option value="Suizo">Sistema Suizo</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Descripción o Reglas Especiales
          </label>
          <textarea
            v-model="description"
            rows="2"
            placeholder="Detalles sobre el reglamento, árbitros sobornados, clima..."
            class="w-full px-3 py-2 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-crimson transition-colors resize-none"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            class="px-3 py-1.5 rounded text-xs text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors font-medium"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !name.trim()"
            class="px-4 py-1.5 rounded bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-xs font-heading font-bold text-content-primary transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span v-if="loading">Registrando...</span>
            <span v-else>Confirmar Liga</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
