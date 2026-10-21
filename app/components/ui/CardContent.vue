<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <div :class="cn('space-y-4', className)">
    <slot />
  </div>
</template>
