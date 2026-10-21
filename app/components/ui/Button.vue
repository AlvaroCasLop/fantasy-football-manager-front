<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-blood-800 to-blood-600 hover:from-blood-700 hover:to-blood-500 text-parchment-200 border border-blood-500/40 shadow-glow',
        gold:
          'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-charcoal-950 border border-amber-300/40 shadow-glow-gold',
        secondary:
          'bg-charcoal-800 hover:bg-charcoal-700 text-parchment-200 border border-white/10',
        outline:
          'border border-parchment-200/30 hover:border-blood-500 hover:bg-blood-950/20 text-parchment-200',
        ghost:
          'hover:bg-white/5 text-parchment-200/80 hover:text-parchment-200',
        danger:
          'bg-red-950 hover:bg-red-900 text-red-200 border border-red-700/50',
      },
      size: {
        sm: 'h-8 px-3 text-[10px]',
        md: 'h-10 px-4 py-2 text-xs',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface Props {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  className: '',
  disabled: false,
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="cn(buttonVariants({ variant, size }), className)"
  >
    <slot />
  </button>
</template>
