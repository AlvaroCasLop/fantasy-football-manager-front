<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <p :class="cn('text-xs text-parchment-200/60 leading-relaxed', className)">
    <slot />
  </p>
</template>
