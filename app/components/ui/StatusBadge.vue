<script setup lang="ts">
import { computed } from 'vue'
import type { LeagueStatus, MatchStatus } from '~/types/blood-bowl'

const props = withDefaults(
  defineProps<{
    status: LeagueStatus | MatchStatus | string
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'sm',
  }
)

const config = computed(() => {
  switch (props.status) {
    case 'activa':
    case 'en_curso':
      return {
        label: props.status === 'activa' ? 'Activa' : 'En curso',
        dotClass: 'bg-emerald-400',
        badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
      }
    case 'inscripcion':
      return {
        label: 'Inscripción',
        dotClass: 'bg-blue-400',
        badgeClass: 'bg-blue-950/40 text-blue-300 border-blue-800/40',
      }
    case 'finalizada':
      return {
        label: 'Finalizada',
        dotClass: 'bg-content-muted',
        badgeClass: 'bg-surface-muted text-content-secondary border-border',
      }
    case 'programado':
      return {
        label: 'Programado',
        dotClass: 'bg-amber-400',
        badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
      }
    case 'aplazado':
      return {
        label: 'Aplazado',
        dotClass: 'bg-crimson',
        badgeClass: 'bg-crimson-dark/40 text-crimson-hover border-crimson/30',
      }
    default:
      return {
        label: props.status,
        dotClass: 'bg-content-muted',
        badgeClass: 'bg-surface-muted text-content-secondary border-border',
      }
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-sans font-medium border rounded-md uppercase tracking-wider',
      size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs',
      config.badgeClass,
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full shrink-0', config.dotClass]" />
    <span>{{ config.label }}</span>
  </span>
</template>
