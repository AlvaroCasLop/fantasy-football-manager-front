import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/i18n'

// Se leen en crudo: al importarlos, el plugin de Vite los entrega ya compilados.
const read = (locale: string) =>
  JSON.parse(readFileSync(resolve(`src/i18n/locales/${locale}.json`), 'utf8'))
const es = read('es')
const en = read('en')

type Tree = { [key: string]: string | Tree }

function keys(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [prefix + k] : keys(v, `${prefix}${k}.`),
  )
}

describe('catálogos de traducción', () => {
  it('es y en tienen las mismas claves', () => {
    const esKeys = new Set(keys(es as Tree))
    const enKeys = new Set(keys(en as Tree))
    expect([...esKeys].filter((k) => !enKeys.has(k))).toEqual([])
    expect([...enKeys].filter((k) => !esKeys.has(k))).toEqual([])
  })

  it('interpola y pluraliza con la sintaxis de Vue I18n', () => {
    const { t } = i18n.global
    i18n.global.locale.value = 'es'
    expect(t('league.details.standings.team_count', { count: 1 }, 1)).toBe('1 equipo')
    expect(t('league.details.standings.team_count', { count: 3 }, 3)).toBe('3 equipos')
    expect(t('login.email_placeholder')).toBe('coach@fantasyfootball.com')
  })
})
