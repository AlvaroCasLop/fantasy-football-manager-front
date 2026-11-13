<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="page-header">
    <div class="page-header__text">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  flex-direction: column;
  gap: space(4);
  padding-bottom: space(4);
  margin-bottom: space(6);
  border-bottom: 1px solid color('border');

  @include up('sm') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: font-size('xl');
    font-weight: 900;
    letter-spacing: -0.01em;

    @include up('sm') {
      font-size: font-size('2xl');
    }
  }

  &__subtitle {
    margin-top: space(0.5);
    font-size: font-size('sm');
    color: color('text-secondary');
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: space(2.5);
  }
}
</style>
