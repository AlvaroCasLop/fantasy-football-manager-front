import { createI18n } from 'vue-i18n'
import es from './locales/es.json'

export const SUPPORTED_LOCALES = ['es', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

const STORAGE_KEY = 'bbm.locale'

// es va en el bundle porque es el idioma de respaldo; el resto se carga al elegirlo.
const loaders: Record<Exclude<Locale, 'es'>, () => Promise<{ default: typeof es }>> = {
  en: () => import('./locales/en.json'),
}

function savedLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) return saved as Locale
  } catch {
    // localStorage no disponible
  }
  return navigator.language.startsWith('en') ? 'en' : 'es'
}

export type MessageSchema = typeof es

export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es } as Record<Locale, MessageSchema>,
})

export async function setLocale(locale: Locale) {
  if (locale !== 'es' && !i18n.global.availableLocales.includes(locale)) {
    const messages = await loaders[locale]()
    i18n.global.setLocaleMessage(locale, messages.default)
  }
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // localStorage no disponible
  }
}

/** Carga el idioma guardado o el del navegador. Se llama antes de montar la app. */
export function initLocale() {
  return setLocale(savedLocale())
}
