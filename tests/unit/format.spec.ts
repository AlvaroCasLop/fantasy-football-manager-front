import { describe, expect, it } from 'vitest'
import { formatGold } from '@/lib/format'

describe('formatGold', () => {
  it('formatea miles como k', () => {
    expect(formatGold(50_000)).toBe('50k')
    expect(formatGold(75_000)).toBe('75k')
  })

  it('formatea millones como M con decimales locales', () => {
    expect(formatGold(1_000_000)).toBe('1M')
    expect(formatGold(1_250_000)).toBe('1,25M')
    expect(formatGold(1_250_000, 'en')).toBe('1.25M')
  })

  it('maneja valores pequeños y vacíos', () => {
    expect(formatGold(0)).toBe('0')
    expect(formatGold(500)).toBe('500')
    expect(formatGold(null)).toBe('0k')
  })
})
