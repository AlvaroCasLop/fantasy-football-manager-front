<script setup lang="ts">
import { Calendar, Shield, Swords } from 'lucide-vue-next'
import type { Match } from '~/types/blood-bowl'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  match: Match
}>()
</script>

<template>
  <div
    class="p-3.5 rounded-lg bg-surface border border-border hover:border-border-light hover:bg-surface-hover/50 transition-colors flex flex-col gap-2.5"
  >
    <!-- Top Metadata: League & Round & Status -->
    <div class="flex items-center justify-between text-2xs text-content-secondary border-b border-border/50 pb-2">
      <span class="font-medium truncate max-w-[150px]">
        {{ match.leagueName }} · J{{ match.round }}
      </span>
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="flex items-center gap-1 text-content-muted">
          <Calendar class="w-3 h-3" />
          {{ match.date }}
        </span>
        <StatusBadge :status="match.status" size="sm" />
      </div>
    </div>

    <!-- Matchup: Home vs Away -->
    <div class="flex items-center justify-between gap-3">
      <!-- Home Team -->
      <div class="flex-1 flex items-center gap-2 min-w-0">
        <div class="w-6 h-6 rounded bg-surface-muted border border-border flex items-center justify-center shrink-0 text-content-secondary">
          <Shield class="w-3 h-3 text-crimson" />
        </div>
        <div class="truncate">
          <span class="text-xs font-heading font-bold text-content-primary block truncate">
            {{ match.homeTeam.name }}
          </span>
          <span class="text-2xs text-content-muted block truncate">
            {{ match.homeTeam.race }}
          </span>
        </div>
      </div>

      <!-- VS / Score Badge -->
      <div class="px-2 py-0.5 rounded bg-surface-muted border border-border/80 shrink-0 text-center font-mono text-2xs font-bold text-content-secondary">
        <span v-if="match.status === 'finalizado'" class="text-content-primary">
          {{ match.homeTeam.score }} - {{ match.awayTeam.score }}
        </span>
        <span v-else class="text-content-muted flex items-center gap-1">
          <Swords class="w-3 h-3 text-content-muted" />
        </span>
      </div>

      <!-- Away Team -->
      <div class="flex-1 flex items-center justify-end gap-2 text-right min-w-0">
        <div class="truncate">
          <span class="text-xs font-heading font-bold text-content-primary block truncate">
            {{ match.awayTeam.name }}
          </span>
          <span class="text-2xs text-content-muted block truncate">
            {{ match.awayTeam.race }}
          </span>
        </div>
        <div class="w-6 h-6 rounded bg-surface-muted border border-border flex items-center justify-center shrink-0 text-content-secondary">
          <Shield class="w-3 h-3 text-blue-400" />
        </div>
      </div>
    </div>
  </div>
</template>
