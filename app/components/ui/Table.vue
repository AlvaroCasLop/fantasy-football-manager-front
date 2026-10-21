<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <div class="relative w-full overflow-auto rounded-xl border border-white/10 glass-panel">
    <table :class="cn('w-full caption-bottom text-xs text-left', className)">
      <slot />
    </table>
  </div>
</template>
