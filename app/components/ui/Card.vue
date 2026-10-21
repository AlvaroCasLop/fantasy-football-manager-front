<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <div :class="cn('glass-card rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300', className)">
    <slot />
  </div>
</template>
