<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronUp, LogOut, Shield, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function onDocumentClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

async function signOut() {
  open.value = false
  await auth.signOut()
}
</script>

<template>
  <div ref="root" class="user-menu">
    <button
      type="button"
      class="user-menu__trigger"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-label="$t('shell.user_menu.open')"
      @click="open = !open"
    >
      <span class="user-menu__avatar">{{ auth.displayName.charAt(0).toUpperCase() }}</span>
      <span class="user-menu__identity">
        <span class="user-menu__name">{{ auth.displayName }}</span>
        <span class="user-menu__email">{{ auth.user?.email }}</span>
      </span>
      <ChevronUp :size="16" class="user-menu__chevron" :class="{ 'is-open': open }" />
    </button>

    <div v-if="open" class="user-menu__dropdown" role="menu">
      <RouterLink to="/perfil" class="user-menu__item" role="menuitem" @click="open = false">
        <User :size="14" />
        {{ $t('nav.profile') }}
      </RouterLink>
      <RouterLink to="/equipos" class="user-menu__item" role="menuitem" @click="open = false">
        <Shield :size="14" />
        {{ $t('nav.teams') }}
      </RouterLink>
      <hr class="user-menu__divider" />
      <button
        type="button"
        class="user-menu__item user-menu__item--danger"
        role="menuitem"
        @click="signOut"
      >
        <LogOut :size="14" />
        {{ $t('nav.logout') }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-menu {
  position: relative;

  &__trigger {
    @include focus-ring;
    display: flex;
    align-items: center;
    gap: space(2.5);
    width: 100%;
    padding: space(2);
    border: 1px solid color('border');
    border-radius: $radius-lg;
    background: color('surface');
    text-align: left;

    &:hover {
      background: color('surface-hover');
    }
  }

  &__avatar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid color('crimson');
    border-radius: $radius-sm;
    background: color('crimson-dark');
    font-family: $font-heading;
    font-size: font-size('xs');
    font-weight: 900;
  }

  &__identity {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  &__name {
    @include truncate;
    font-family: $font-heading;
    font-size: font-size('xs');
    font-weight: 700;
  }

  &__email {
    @include truncate;
    font-size: font-size('2xs');
    color: color('text-secondary');
  }

  &__chevron {
    flex-shrink: 0;
    color: color('text-muted');
    transition: transform $transition-fast;

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    right: 0;
    bottom: calc(100% + #{space(1.5)});
    left: 0;
    z-index: $z-dropdown;
    padding: space(1.5);
    border: 1px solid color('border');
    border-radius: $radius-lg;
    background: color('surface');
    box-shadow: $shadow-dropdown;
  }

  &__item {
    @include focus-ring;
    display: flex;
    align-items: center;
    gap: space(2);
    width: 100%;
    padding: space(2) space(2.5);
    border: 0;
    border-radius: $radius-sm;
    background: transparent;
    font-size: font-size('xs');
    color: color('text-secondary');
    text-align: left;

    &:hover {
      color: color('text');
      background: color('surface-hover');
    }

    &--danger {
      color: color('crimson-hover');

      &:hover {
        color: color('crimson-hover');
        background: color('crimson-subtle');
      }
    }
  }

  &__divider {
    margin: space(1) 0;
    border: 0;
    border-top: 1px solid color('border');
  }
}
</style>
