<script setup lang="ts">
import { ref } from 'vue'
import {
  Trophy,
  Shield,
  Swords,
  Clock,
  Plus,
  ArrowRight,
  Flame,
  Activity,
  Calendar,
} from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'
import PageHeader from '~/components/ui/PageHeader.vue'
import StatCard from '~/components/ui/StatCard.vue'
import LeagueTable from '~/components/ui/LeagueTable.vue'
import MatchCard from '~/components/ui/MatchCard.vue'
import ActivityFeed from '~/components/ui/ActivityFeed.vue'
import CreateLeagueModal from '~/components/ui/CreateLeagueModal.vue'

// SEO and Page Metadata
useHead({
  title: 'Dashboard · Blood Bowl Manager',
  meta: [
    {
      name: 'description',
      content: 'El estado de tus ligas, equipos y partidos en Blood Bowl Manager.',
    },
  ],
})

const {
  getStats,
  getLeagues,
  getUpcomingMatches,
  getRecentActivity,
} = useBloodBowl()

const stats = getStats()
const leagues = getLeagues()
const upcomingMatches = getUpcomingMatches()
const recentActivity = getRecentActivity()

const isCreateModalOpen = ref(false)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHeader
      title="Dashboard"
      subtitle="El estado de tus ligas, equipos y partidos."
    >
      <template #actions>
        <!-- Secondary Button -->
        <NuxtLink
          to="/partidos"
          class="px-3.5 py-2 rounded bg-surface border border-border text-xs font-heading font-medium text-content-primary hover:bg-surface-hover hover:border-border-light transition-colors flex items-center gap-1.5"
        >
          <Swords class="w-3.5 h-3.5 text-content-secondary" />
          <span>Ver partidos</span>
        </NuxtLink>

        <!-- Primary Button -->
        <button
          type="button"
          class="px-3.5 py-2 rounded bg-crimson hover:bg-crimson-hover text-xs font-heading font-bold text-content-primary transition-colors flex items-center gap-1.5 shadow-sm"
          @click="isCreateModalOpen = true"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Crear liga</span>
        </button>
      </template>
    </PageHeader>

    <!-- 4 Summary StatCards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <StatCard
        title="Ligas activas"
        :value="stats.activeLeagues"
        description="En fase regular o eliminatoria"
        :icon="Trophy"
        icon-color="text-amber-400"
      />
      <StatCard
        title="Equipos registrados"
        :value="stats.registeredTeams"
        description="Franquicias federadas activas"
        :icon="Shield"
        icon-color="text-blue-400"
      />
      <StatCard
        title="Partidos disputados"
        :value="stats.playedMatches"
        description="Resultados oficiales validados"
        :icon="Swords"
        icon-color="text-emerald-400"
      />
      <StatCard
        title="Partidos pendientes"
        :value="stats.pendingMatches"
        description="Por disputar en las próximas jornadas"
        :icon="Clock"
        icon-color="text-crimson"
      />
    </div>

    <!-- Balanced Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Main Column: Ligas Recientes (7 cols on lg, 8 cols on xl) -->
      <section class="lg:col-span-7 xl:col-span-8 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Trophy class="w-4 h-4 text-crimson" />
            <h2 class="text-sm font-heading font-bold text-content-primary tracking-wide">
              Ligas Recientes
            </h2>
          </div>
          <NuxtLink
            to="/ligas"
            class="text-2xs font-heading font-semibold text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1"
          >
            <span>Ver todas las ligas</span>
            <ArrowRight class="w-3 h-3 text-content-muted" />
          </NuxtLink>
        </div>

        <LeagueTable :leagues="leagues" />
      </section>

      <!-- Secondary Column: Próximos Partidos & Actividad Reciente (5 cols on lg, 4 cols on xl) -->
      <div class="lg:col-span-5 xl:col-span-4 space-y-6">
        <!-- Próximos Partidos -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-amber-400" />
              <h2 class="text-sm font-heading font-bold text-content-primary tracking-wide">
                Próximos Partidos
              </h2>
            </div>
            <NuxtLink
              to="/partidos"
              class="text-2xs font-heading font-semibold text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1"
            >
              <span>Ver calendario</span>
              <ArrowRight class="w-3 h-3 text-content-muted" />
            </NuxtLink>
          </div>

          <div class="space-y-2.5">
            <MatchCard
              v-for="m in upcomingMatches.slice(0, 3)"
              :key="m.id"
              :match="m"
            />
          </div>
        </section>

        <!-- Actividad Reciente -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Activity class="w-4 h-4 text-emerald-400" />
              <h2 class="text-sm font-heading font-bold text-content-primary tracking-wide">
                Actividad Reciente
              </h2>
            </div>
            <span class="text-2xs font-mono text-content-muted">
              Últimas 24h
            </span>
          </div>

          <ActivityFeed :events="recentActivity" />
        </section>
      </div>
    </div>

    <!-- Create League Interactive Modal -->
    <CreateLeagueModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
    />
  </div>
</template>
