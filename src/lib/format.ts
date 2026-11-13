/** Monedas de oro en el formato de Blood Bowl: 50000 → "50k", 1250000 → "1,25M". */
export function formatGold(coins: number | null | undefined, locale = 'es'): string {
  if (coins == null) return '0k'
  if (Math.abs(coins) >= 1_000_000) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(coins / 1_000_000)}M`
  }
  if (Math.abs(coins) >= 1_000) return `${Math.round(coins / 1_000)}k`
  return String(coins)
}
