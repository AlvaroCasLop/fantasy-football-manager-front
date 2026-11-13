<script setup lang="ts">
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { navigation } from './navigation'
import UserMenu from './UserMenu.vue'

defineProps<{
  collapsed: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  toggleCollapse: []
  closeMobile: []
}>()
</script>

<template>
  <div>
    <div v-if="mobileOpen" class="sidebar-backdrop" @click="emit('closeMobile')" />

    <aside
      class="sidebar"
      :class="{ 'sidebar--collapsed': collapsed, 'sidebar--open': mobileOpen }"
    >
      <div class="sidebar__brand">
        <RouterLink to="/" class="brand" @click="emit('closeMobile')">
          <span class="brand__logo">BB</span>
          <span v-if="!collapsed" class="brand__text">
            <span class="brand__name">BLOOD BOWL</span>
            <span class="brand__tag">MANAGER</span>
          </span>
        </RouterLink>

        <button
          type="button"
          class="icon-btn sidebar__close"
          :aria-label="$t('shell.nav.close')"
          @click="emit('closeMobile')"
        >
          <X :size="20" />
        </button>
        <button
          v-if="!collapsed"
          type="button"
          class="icon-btn sidebar__collapse"
          :aria-label="$t('shell.nav.collapse')"
          :title="$t('shell.nav.collapse')"
          @click="emit('toggleCollapse')"
        >
          <ChevronLeft :size="16" />
        </button>
      </div>

      <nav class="sidebar__nav" :aria-label="$t('shell.nav.main')">
        <section v-for="group in navigation" :key="group.labelKey" class="nav-group">
          <h2 v-if="!collapsed" class="nav-group__label">{{ $t(group.labelKey) }}</h2>
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            active-class="nav-link--active"
            :title="collapsed ? $t(item.labelKey) : undefined"
            @click="emit('closeMobile')"
          >
            <component :is="item.icon" :size="16" class="nav-link__icon" />
            <span v-if="!collapsed" class="nav-link__label">{{ $t(item.labelKey) }}</span>
          </RouterLink>
        </section>
      </nav>

      <div class="sidebar__footer">
        <button
          v-if="collapsed"
          type="button"
          class="icon-btn sidebar__expand"
          :aria-label="$t('shell.nav.expand')"
          :title="$t('shell.nav.expand')"
          @click="emit('toggleCollapse')"
        >
          <ChevronRight :size="16" />
        </button>
        <UserMenu v-else />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
// Primero: las reglas de .sidebar__* que ocultan botones tienen que ganarle.
.icon-btn {
  @include focus-ring;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: space(1);
  border: 0;
  border-radius: $radius-sm;
  background: transparent;
  color: color('text-muted');
  transition:
    color $transition-fast,
    background-color $transition-fast;

  &:hover {
    color: color('text');
    background: color('surface');
  }
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: $z-sidebar;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);

  @include up('lg') {
    display: none;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $z-sidebar;
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  background: color('sidebar');
  border-right: 1px solid color('border');
  transform: translateX(-100%);
  transition:
    width 200ms ease,
    transform 200ms ease;

  &--open {
    transform: translateX(0);
  }

  @include up('lg') {
    transform: translateX(0);

    &--collapsed {
      width: $sidebar-width-collapsed;
    }
  }

  &__brand {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    padding: 0 space(3.5);
    border-bottom: 1px solid color('border');
  }

  &__close {
    @include up('lg') {
      display: none;
    }
  }

  &__collapse {
    display: none;

    @include up('lg') {
      display: flex;
    }
  }

  &__nav {
    flex: 1;
    padding: space(3) space(2);
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    padding: space(2.5);
    border-top: 1px solid color('border');

    > :deep(*) {
      flex: 1;
    }
  }

  &__expand {
    flex: 0 0 auto !important;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: space(2.5);
  overflow: hidden;

  &__logo {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: $radius-sm;
    background: color('crimson');
    font-family: $font-heading;
    font-size: font-size('sm');
    font-weight: 900;
    transition: background-color $transition-fast;
  }

  &:hover &__logo {
    background: color('crimson-hover');
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }

  &__name {
    font-family: $font-heading;
    font-size: font-size('sm');
    font-weight: 900;
    letter-spacing: 0.03em;
  }

  &__tag {
    font-family: $font-mono;
    font-size: 0.5625rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: color('crimson');
  }
}

.nav-group {
  & + & {
    margin-top: space(4);
  }

  &__label {
    @include label-caps;
    margin: 0 0 space(1);
    padding: 0 space(3);
    font-family: $font-sans;
    color: color('text-muted');
  }
}

.nav-link {
  @include focus-ring;
  position: relative;
  display: flex;
  align-items: center;
  gap: space(3);
  padding: space(2) space(3);
  border-radius: $radius-md;
  font-family: $font-heading;
  font-size: font-size('xs');
  font-weight: 500;
  color: color('text-secondary');
  transition:
    color $transition-fast,
    background-color $transition-fast;

  .sidebar--collapsed & {
    @include up('lg') {
      justify-content: center;
      padding-inline: 0;
    }
  }

  &:hover {
    color: color('text');
    background: color('surface');
  }

  &__icon {
    flex-shrink: 0;
    color: color('text-muted');
    transition: color $transition-fast;
  }

  &:hover &__icon {
    color: color('text');
  }

  &__label {
    @include truncate;
  }

  &--active {
    font-weight: 700;
    color: color('text');
    background: color('crimson-subtle');
    box-shadow: inset 2px 0 0 color('crimson');
  }

  &--active &__icon {
    color: color('crimson');
  }
}

</style>
