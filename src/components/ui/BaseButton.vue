<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md'
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn {
  @include focus-ring;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: space(1.5);
  border: 1px solid transparent;
  border-radius: $radius-md;
  font-family: $font-heading;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background-color $transition-fast,
    border-color $transition-fast,
    color $transition-fast;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--sm {
    height: 2rem;
    padding: 0 space(3);
    font-size: font-size('xs');
  }

  &--md {
    height: 2.25rem;
    padding: 0 space(4);
    font-size: font-size('xs');
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background: color('crimson');
    color: color('text');

    &:hover:not(:disabled) {
      background: color('crimson-hover');
    }

    &:active:not(:disabled) {
      background: color('crimson-active');
    }
  }

  &--secondary {
    border-color: color('border');
    background: color('surface');
    color: color('text');

    &:hover:not(:disabled) {
      border-color: color('border-light');
      background: color('surface-hover');
    }
  }

  &--ghost {
    background: transparent;
    color: color('text-secondary');

    &:hover:not(:disabled) {
      background: color('surface');
      color: color('text');
    }
  }

  &--danger {
    border-color: color('crimson');
    background: color('crimson-subtle');
    color: color('crimson-hover');

    &:hover:not(:disabled) {
      background: color('crimson-dark');
    }
  }

  &__spinner {
    width: 0.875rem;
    height: 0.875rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: $radius-full;
    animation: spin 700ms linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
