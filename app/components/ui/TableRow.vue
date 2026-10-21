<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <tr :class="cn('border-b border-white/5 transition-colors hover:bg-blood-950/20 data-[state=selected]:bg-muted', className)">
    <slot />
  </tr>
</template>
