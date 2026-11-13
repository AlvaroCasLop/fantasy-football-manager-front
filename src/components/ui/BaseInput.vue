<script setup lang="ts">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  error?: string
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="field__input"
      :class="{ 'field__input--invalid': error }"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? `${id}-error` : undefined"
      v-bind="$attrs"
    />
    <p v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: space(1);

  &__label {
    @include label-caps;
  }

  &__input {
    height: 2.25rem;
    padding: 0 space(3);
    border: 1px solid color('border');
    border-radius: $radius-md;
    background: color('surface-muted');
    font-size: font-size('sm');
    color: color('text');
    transition: border-color $transition-fast;

    &::placeholder {
      color: color('text-muted');
    }

    &:focus {
      border-color: color('border-light');
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid color('crimson');
      outline-offset: 1px;
    }

    &--invalid {
      border-color: color('crimson');
    }
  }

  &__error {
    font-size: font-size('2xs');
    color: color('crimson-hover');
  }
}
</style>
