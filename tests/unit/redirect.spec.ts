import { describe, expect, it } from 'vitest'
import { safeRedirect } from '@/router/redirect'

describe('safeRedirect', () => {
  it('acepta rutas internas', () => {
    expect(safeRedirect('/ligas/123')).toBe('/ligas/123')
  })

  it('rechaza dominios externos y valores raros', () => {
    expect(safeRedirect('//evil.com')).toBe('/')
    expect(safeRedirect('https://evil.com')).toBe('/')
    expect(safeRedirect(undefined)).toBe('/')
    expect(safeRedirect(['/a'])).toBe('/')
  })
})
