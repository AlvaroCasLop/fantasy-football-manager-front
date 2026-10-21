<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  className?: string
}>()
</script>

<template>
  <tbody :class="cn('[&_tr:last-child]:border-0 divide-y divide-white/5', className)">
    <slot />
  </tbody>
</template>
