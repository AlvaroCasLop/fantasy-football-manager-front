<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, setLocale, type Locale } from '@/i18n'

const { locale } = useI18n()
</script>

<template>
  <div class="locale-switcher" role="group" :aria-label="$t('nav.language')">
    <button
      v-for="code in SUPPORTED_LOCALES"
      :key="code"
      type="button"
      class="locale-switcher__option"
      :class="{ 'locale-switcher__option--active': locale === code }"
      :aria-pressed="locale === code"
      @click="setLocale(code as Locale)"
    >
      {{ code.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.locale-switcher {
  display: inline-flex;
  padding: 2px;
  border: 1px solid color('border');
  border-radius: $radius-md;
  background: color('surface-muted');

  &__option {
    @include focus-ring;
    padding: space(0.5) space(2);
    border: 0;
    border-radius: $radius-sm;
    background: transparent;
    font-family: $font-mono;
    font-size: font-size('2xs');
    font-weight: 700;
    color: color('text-muted');

    &:hover {
      color: color('text');
    }

    &--active {
      background: color('surface-active');
      color: color('text');
    }
  }
}
</style>
