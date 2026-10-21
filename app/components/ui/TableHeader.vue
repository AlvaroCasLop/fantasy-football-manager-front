<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <thead :class="cn('[&_tr]:border-b border-white/10 bg-black/40', className)">
    <slot />
  </thead>
</template>
