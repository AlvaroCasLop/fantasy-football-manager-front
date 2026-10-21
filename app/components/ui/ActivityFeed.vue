<script setup lang="ts">
import {
  Trophy,
  CheckCircle2,
  Skull,
  ShieldPlus,
  Flame,
  Swords,
} from 'lucide-vue-next'
import type { ActivityEvent, ActivityEventType } from '~/types/blood-bowl'

defineProps<{
  events: ActivityEvent[]
}>()

const getEventIcon = (type: ActivityEventType) => {
  switch (type) {
    case 'match_finished':
      return Swords
    case 'result_recorded':
      return CheckCircle2
    case 'injury':
      return Skull
    case 'team_registered':
      return ShieldPlus
    case 'league_created':
      return Trophy
    default:
      return Flame
  }
}

const getEventColor = (type: ActivityEventType) => {
  switch (type) {
    case 'match_finished':
      return 'text-amber-400 bg-amber-950/40 border-amber-800/40'
    case 'result_recorded':
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
    case 'injury':
      return 'text-crimson bg-crimson-dark/40 border-crimson/40'
    case 'team_registered':
      return 'text-blue-400 bg-blue-950/40 border-blue-800/40'
    case 'league_created':
      return 'text-amber-300 bg-surface-muted border-border'
    default:
      return 'text-content-secondary bg-surface-muted border-border'
  }
}
</script>

<template>
  <div class="card-panel p-4 space-y-3">
    <div
      v-for="event in events"
      :key="event.id"
      class="flex items-start gap-3 py-2 border-b border-border/40 last:border-0 last:pb-0"
    >
      <div
        class="w-7 h-7 rounded border shrink-0 flex items-center justify-center mt-0.5"
        :class="getEventColor(event.type)"
      >
        <component :is="getEventIcon(event.type)" class="w-3.5 h-3.5" />
      </div>

      <div class="space-y-0.5 min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-heading font-bold text-content-primary truncate">
            {{ event.title }}
          </span>
          <span class="text-2xs text-content-muted shrink-0 font-mono">
            {{ event.timeAgo }}
          </span>
        </div>
        <p class="text-2xs text-content-secondary leading-snug">
          {{ event.description }}
        </p>
      </div>
    </div>
  </div>
</template>
