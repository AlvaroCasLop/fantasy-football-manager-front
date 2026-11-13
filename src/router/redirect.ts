/** Solo rutas internas: evita redirecciones abiertas con ?redirect=//otro-dominio. */
export function safeRedirect(value: unknown, fallback = '/'): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : fallback
}
