<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="py-10 px-4 text-center space-y-2">
    <div class="w-10 h-10 rounded-lg bg-surface-muted border border-border mx-auto flex items-center justify-center text-content-muted">
      <ShieldAlert class="w-5 h-5" />
    </div>
    <h3 class="text-sm font-heading font-bold text-content-primary">
      {{ title }}
    </h3>
    <p v-if="description" class="text-xs text-content-secondary max-w-sm mx-auto">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="pt-2">
      <slot name="action" />
    </div>
  </div>
</template>
