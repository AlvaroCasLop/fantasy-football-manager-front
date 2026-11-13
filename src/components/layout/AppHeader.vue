<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu } from 'lucide-vue-next'
import LocaleSwitcher from './LocaleSwitcher.vue'

const emit = defineEmits<{ openMobile: [] }>()

const route = useRoute()
const { t } = useI18n()

// Título de la sección: el de la ruta padre (p. ej. «Ligas» dentro de una pestaña de liga).
const section = computed(() => {
  const key = route.matched[0]?.meta.titleKey ?? route.meta.titleKey
  return key ? t(key) : ''
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__start">
      <button
        type="button"
        class="app-header__menu"
        :aria-label="$t('nav.menu_toggle')"
        @click="emit('openMobile')"
      >
        <Menu :size="20" />
      </button>
      <span class="app-header__section">{{ section }}</span>
    </div>
    <LocaleSwitcher />
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: $z-header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: space(4);
  height: $header-height;
  padding: 0 space(4);
  background: rgba(29, 33, 43, 0.7);
  border-bottom: 1px solid color('border');
  backdrop-filter: blur(12px);

  &__start {
    display: flex;
    align-items: center;
    gap: space(3);
    min-width: 0;
  }

  &__menu {
    @include focus-ring;
    display: flex;
    padding: space(1.5);
    border: 0;
    border-radius: $radius-sm;
    background: transparent;
    color: color('text-secondary');

    &:hover {
      color: color('text');
      background: color('surface');
    }

    @include up('lg') {
      display: none;
    }
  }

  &__section {
    @include truncate;
    font-family: $font-heading;
    font-size: font-size('sm');
    font-weight: 700;
  }
}
</style>
