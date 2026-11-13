<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trophy, Users } from 'lucide-vue-next'
import { listLeaguesApiV1LeaguesGet } from '@/api/generated/endpoints/leagues/leagues'
import { useAsyncData } from '@/composables/useAsyncData'
import { useAuthStore } from '@/stores/auth'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'

const { t, d } = useI18n()
const auth = useAuthStore()

const { data: leagues, loading, error, execute } = useAsyncData(() => listLeaguesApiV1LeaguesGet())

const sorted = computed(() =>
  [...(leagues.value ?? [])].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')),
)

function founded(date?: string | null) {
  return date ? t('dashboards.leagues.founded', { date: d(new Date(date)) }) : ''
}
</script>

<template>
  <div>
    <PageHeader :title="$t('dashboards.leagues.title')" :subtitle="$t('dashboards.leagues.subtitle')" />

    <p v-if="loading" class="league-list__loading" role="status">
      {{ $t('dashboards.leagues.loading') }}
    </p>

    <BaseAlert v-else-if="error" variant="error">
      {{ $t('shell.errors.load_failed') }}
      <BaseButton size="sm" variant="ghost" @click="execute">{{ $t('shell.errors.retry') }}</BaseButton>
    </BaseAlert>

    <EmptyState
      v-else-if="!sorted.length"
      :icon="Trophy"
      :title="$t('dashboards.leagues.empty_title')"
      :description="$t('dashboards.leagues.empty_subtitle')"
    />

    <ul v-else class="league-list">
      <li v-for="league in sorted" :key="league.id">
        <RouterLink :to="{ name: 'league', params: { leagueId: league.id } }" class="league-card">
          <div class="league-card__top">
            <h2 class="league-card__name">{{ league.name }}</h2>
            <span v-if="league.creator_id === auth.user?.id" class="league-card__badge">
              {{ $t('dashboards.leagues.creator_badge') }}
            </span>
          </div>
          <p class="league-card__description">
            {{ league.description || $t('dashboards.leagues.no_description') }}
          </p>
          <div class="league-card__meta">
            <span class="league-card__teams">
              <Users :size="14" />
              {{ $t('league.details.standings.team_count', { count: league.teams_count ?? 0 }, league.teams_count ?? 0) }}
            </span>
            <span>{{ founded(league.created_at) }}</span>
          </div>
          <span class="league-card__manage">{{ $t('dashboards.leagues.manage') }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.league-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: space(4);
  margin: 0;
  padding: 0;
  list-style: none;

  @include up('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include up('xl') {
    grid-template-columns: repeat(3, 1fr);
  }

  &__loading {
    padding: space(10) 0;
    font-size: font-size('sm');
    color: color('text-secondary');
    text-align: center;
  }
}

.league-card {
  @include panel;
  @include focus-ring;
  display: flex;
  flex-direction: column;
  gap: space(2);
  height: 100%;
  padding: space(4);
  transition:
    border-color $transition-fast,
    background-color $transition-fast;

  &:hover {
    border-color: color('border-light');
    background: color('surface-hover');
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: space(2);
  }

  &__name {
    font-size: font-size('md');
  }

  &__badge {
    flex-shrink: 0;
    padding: space(0.5) space(2);
    border: 1px solid color('crimson');
    border-radius: $radius-full;
    background: color('crimson-subtle');
    font-size: font-size('2xs');
    font-weight: 700;
    text-transform: uppercase;
    color: color('crimson-hover');
  }

  &__description {
    display: -webkit-box;
    flex: 1;
    overflow: hidden;
    font-size: font-size('xs');
    color: color('text-secondary');
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: space(2);
    font-size: font-size('2xs');
    color: color('text-muted');
  }

  &__teams {
    display: inline-flex;
    align-items: center;
    gap: space(1);
  }

  &__manage {
    align-self: flex-end;
    font-family: $font-heading;
    font-size: font-size('xs');
    font-weight: 700;
    color: color('crimson-hover');
  }
}
</style>
