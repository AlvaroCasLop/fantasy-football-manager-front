<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <th :class="cn('h-10 px-3 text-left align-middle font-header font-bold uppercase tracking-wider text-parchment-200/70 [&:has([role=checkbox])]:pr-0', className)">
    <slot />
  </th>
</template>
