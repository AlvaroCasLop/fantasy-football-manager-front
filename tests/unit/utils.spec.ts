import { describe, it, expect } from 'vitest'
import { formatGold, cn } from '~/lib/utils'

describe('Frontend Utilities', () => {
  describe('formatGold', () => {
    it('formats values in thousands as k', () => {
      expect(formatGold(50000)).toBe('50 k')
      expect(formatGold(100000)).toBe('100 k')
      expect(formatGold(75000)).toBe('75 k')
    })

    it('formats values in millions as M', () => {
      expect(formatGold(1000000)).toBe('1 M')
      expect(formatGold(1250000)).toBe('1.25 M')
    })

    it('handles zero or small numbers', () => {
      expect(formatGold(0)).toBe('0')
      expect(formatGold(500)).toBe('500')
      expect(formatGold(null)).toBe('0 k')
    })
  })

  describe('cn (Tailwind class merger)', () => {
    it('merges multiple conditional classes cleanly', () => {
      const result = cn('bg-red-500', false && 'hidden', true && 'text-white')
      expect(result).toContain('bg-red-500')
      expect(result).toContain('text-white')
      expect(result).not.toContain('hidden')
    })

    it('resolves conflicting tailwind classes taking the last one', () => {
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })
  })
})
