<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, CheckCircle2, Info } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ variant?: 'error' | 'success' | 'info' }>(), {
  variant: 'info',
})

const icon = computed(
  () => ({ error: AlertCircle, success: CheckCircle2, info: Info })[props.variant],
)
</script>

<template>
  <div
    class="alert"
    :class="`alert--${variant}`"
    :role="variant === 'error' ? 'alert' : 'status'"
  >
    <component :is="icon" :size="16" class="alert__icon" />
    <div class="alert__body"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.alert {
  display: flex;
  gap: space(2);
  align-items: flex-start;
  padding: space(2.5) space(3);
  border: 1px solid;
  border-radius: $radius-md;
  font-size: font-size('xs');

  &__icon {
    flex-shrink: 0;
    margin-top: 1px;
  }

  &--error {
    border-color: color('crimson');
    background: color('crimson-subtle');
    color: color('crimson-hover');
  }

  &--success {
    border-color: color('success');
    background: rgba(63, 162, 108, 0.12);
    color: color('success');
  }

  &--info {
    border-color: color('info');
    background: rgba(59, 130, 246, 0.12);
    color: color('info');
  }
}
</style>
