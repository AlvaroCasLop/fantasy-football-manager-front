<script setup lang="ts">
import type { Component } from 'vue'
import { ShieldAlert } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: Component
  }>(),
  { icon: () => ShieldAlert },
)
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <component :is="icon" :size="20" />
    </div>
    <h2 class="empty-state__title">{{ title }}</h2>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: space(2);
  padding: space(10) space(4);
  text-align: center;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid color('border');
    border-radius: $radius-lg;
    background: color('surface-muted');
    color: color('text-muted');
  }

  &__title {
    font-size: font-size('md');
  }

  &__description {
    max-width: 24rem;
    font-size: font-size('xs');
    color: color('text-secondary');
  }

  &__action {
    padding-top: space(2);
  }
}
</style>
