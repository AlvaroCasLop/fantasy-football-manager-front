import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGold(coins: number | null | undefined): string {
  if (coins === null || coins === undefined) return '0 k'
  if (coins >= 1000000) {
    const m = (coins / 1000000).toFixed(2).replace(/\.00$/, '')
    return `${m} M`
  }
  if (coins >= 1000) {
    const k = Math.round(coins / 1000)
    return `${k} k`
  }
  return `${coins}`
}
