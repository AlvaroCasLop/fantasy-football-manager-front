<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <div :class="cn('flex flex-col space-y-1.5 pb-4 border-b border-white/5 mb-4', className)">
    <slot />
  </div>
</template>
