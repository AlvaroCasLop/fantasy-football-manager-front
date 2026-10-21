<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blood-950/80 text-blood-300 border border-blood-700/50',
        gold: 'bg-amber-950/80 text-amber-300 border border-amber-600/50',
        green: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50',
        blue: 'bg-sky-950/80 text-sky-300 border border-sky-700/50',
        secondary: 'bg-charcoal-800 text-parchment-200/80 border border-white/10',
        outline: 'border border-white/20 text-parchment-200/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface Props {
  variant?: VariantProps<typeof badgeVariants>['variant']
  className?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  className: '',
})
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), className)">
    <slot />
  </span>
</template>
