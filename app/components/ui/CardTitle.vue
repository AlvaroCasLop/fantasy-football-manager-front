<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <h3 :class="cn('text-lg font-header font-bold uppercase tracking-wider text-parchment-200 flex items-center gap-2', className)">
    <slot />
  </h3>
</template>
