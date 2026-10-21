<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: string | number
  description: string
  icon: Component
  iconColor?: string
}>()
</script>

<template>
  <div
    class="card-panel p-4 flex items-start justify-between gap-3 transition-colors hover:border-border-light hover:bg-surface-hover/50"
  >
    <div class="space-y-1">
      <span class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
        {{ title }}
      </span>
      <div class="text-2xl font-heading font-black text-content-primary tracking-tight">
        {{ value }}
      </div>
      <p class="text-2xs text-content-muted leading-tight">
        {{ description }}
      </p>
    </div>

    <div
      class="p-2.5 rounded-md bg-surface-muted border border-border shrink-0 flex items-center justify-center text-content-secondary"
      :class="iconColor"
    >
      <component :is="icon" class="w-4 h-4" />
    </div>
  </div>
</template>
