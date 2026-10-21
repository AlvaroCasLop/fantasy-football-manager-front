<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
    <div class="space-y-0.5">
      <h1 class="text-xl sm:text-2xl font-heading font-black text-content-primary tracking-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-xs sm:text-sm text-content-secondary">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex items-center gap-2.5 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
