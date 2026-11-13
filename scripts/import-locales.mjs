// Importación inicial, de una sola vez, del catálogo del front React (i18next) a Vue I18n.
// Desde entonces src/i18n/locales/*.json es la fuente de verdad: este script la
// sobrescribiría, así que exige --force.
//
//   node scripts/import-locales.mjs ../blood-bowl-manager --force
//
// Conversiones:
//   {{var}}               → {var}
//   clave_one/_other      → una sola clave "uno | varios"  (t('clave', n) o t('clave', { count }, n))
//   '@' y '|' literales   → {'@'} y {'|'}, que en Vue I18n son sintaxis
// Los marcadores <1>…</1> se dejan tal cual: se resuelven con <i18n-t> al portar cada componente.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
if (!args.includes('--force')) {
  console.error('Sobrescribe src/i18n/locales/*.json. Repite con --force si es lo que quieres.')
  process.exit(1)
}
const source = resolve(args.find((a) => !a.startsWith('--')) ?? '../blood-bowl-manager')
const target = resolve('src/i18n/locales')
const PLURAL = /_(zero|one|other)$/

const escape = (s) =>
  s
    .replace(/[@|]/g, (c) => `{'${c}'}`)
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, '{$1}')

function convert(node) {
  const out = {}
  const plurals = {}
  for (const [key, value] of Object.entries(node)) {
    const m = key.match(PLURAL)
    if (m && typeof value === 'string') {
      const base = key.slice(0, -m[0].length)
      ;(plurals[base] ??= {})[m[1]] = escape(value)
      continue
    }
    out[key] = typeof value === 'string' ? escape(value) : convert(value)
  }
  for (const [base, forms] of Object.entries(plurals)) {
    if (base in out) throw new Error(`El plural ${base} choca con una clave existente`)
    const list = [forms.zero, forms.one ?? forms.other, forms.other ?? forms.one].filter(Boolean)
    out[base] = list.join(' | ')
  }
  return out
}

mkdirSync(target, { recursive: true })
for (const locale of ['es', 'en']) {
  const raw = JSON.parse(readFileSync(join(source, 'public/locales', locale, 'common.json'), 'utf8'))
  writeFileSync(join(target, `${locale}.json`), JSON.stringify(convert(raw), null, 2) + '\n')
  console.log(`${locale}: ${join(target, `${locale}.json`)}`)
}
