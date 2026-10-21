<script setup lang="ts">
import { ChevronRight, Trophy } from 'lucide-vue-next'
import type { League } from '~/types/blood-bowl'
import StatusBadge from './StatusBadge.vue'
import EmptyState from './EmptyState.vue'

defineProps<{
  leagues: League[]
}>()
</script>

<template>
  <div class="card-panel overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse table-dense">
        <thead>
          <tr>
            <th class="w-[35%]">Liga</th>
            <th class="w-[20%]">Temporada</th>
            <th class="w-[12%] text-center">Equipos</th>
            <th class="w-[15%] text-center">Partidos</th>
            <th class="w-[10%] text-center">Estado</th>
            <th class="w-[8%] text-right pr-4">Acción</th>
          </tr>
        </thead>
        <tbody v-if="leagues.length > 0">
          <tr
            v-for="league in leagues"
            :key="league.id"
            class="hover:bg-surface-hover/60 transition-colors group cursor-pointer"
            @click="navigateTo(`/ligas/${league.slug}`)"
          >
            <!-- Liga Name & Format -->
            <td>
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded bg-surface-muted border border-border flex items-center justify-center shrink-0 text-content-secondary group-hover:border-crimson/50 group-hover:text-crimson transition-colors">
                  <Trophy class="w-3.5 h-3.5" />
                </div>
                <div class="truncate">
                  <NuxtLink
                    :to="`/ligas/${league.slug}`"
                    class="font-heading font-bold text-sm text-content-primary group-hover:text-crimson transition-colors truncate block"
                    @click.stop
                  >
                    {{ league.name }}
                  </NuxtLink>
                  <span class="text-2xs text-content-secondary block">
                    {{ league.format }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Temporada -->
            <td class="text-xs text-content-secondary font-mono">
              {{ league.season }}
            </td>

            <!-- Equipos -->
            <td class="text-center font-mono text-xs text-content-primary">
              <span class="font-bold">{{ league.teamsCount }}</span>
              <span class="text-content-muted">/{{ league.maxTeams }}</span>
            </td>

            <!-- Partidos Jugados -->
            <td class="text-center">
              <div class="inline-flex items-center gap-1.5 font-mono text-xs">
                <span class="text-content-primary font-bold">{{ league.matchesPlayed }}</span>
                <span class="text-content-muted">/{{ league.totalMatches }}</span>
              </div>
              <div class="w-16 h-1 bg-surface-muted rounded-full mx-auto mt-1 overflow-hidden border border-border/50">
                <div
                  class="h-full bg-crimson rounded-full"
                  :style="{ width: `${Math.round((league.matchesPlayed / (league.totalMatches || 1)) * 100)}%` }"
                />
              </div>
            </td>

            <!-- Estado -->
            <td class="text-center">
              <StatusBadge :status="league.status" />
            </td>

            <!-- Acción -->
            <td class="text-right pr-4">
              <NuxtLink
                :to="`/ligas/${league.slug}`"
                class="inline-flex items-center justify-center p-1.5 rounded text-content-secondary hover:text-content-primary hover:bg-surface-active transition-colors"
                title="Consultar liga"
                @click.stop
              >
                <ChevronRight class="w-4 h-4 text-content-muted group-hover:text-content-primary group-hover:translate-x-0.5 transition-transform" />
              </NuxtLink>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="p-8 text-center">
              <EmptyState
                title="No hay ligas registradas"
                description="Crea tu primera competición oficial para empezar a gestionar calendarios y clasificaciones."
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
