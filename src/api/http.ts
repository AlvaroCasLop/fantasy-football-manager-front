import { supabase } from '@/lib/supabase'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

/** Error HTTP de la API con el `detail` de FastAPI cuando lo hay. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly detail: unknown,
  ) {
    super(typeof detail === 'string' ? detail : `HTTP ${status}`)
    this.name = 'ApiError'
  }
}

/**
 * Cliente que usan todas las funciones generadas por orval.
 * Añade la URL base y el JWT de Supabase, y devuelve el cuerpo ya parseado.
 */
export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const { data } = await supabase.auth.getSession()
  if (data.session) headers.set('Authorization', `Bearer ${data.session.access_token}`)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers })
  const body = res.status === 204 ? undefined : await parseBody(res)
  if (!res.ok) {
    const detail = body && typeof body === 'object' && 'detail' in body ? body.detail : body
    throw new ApiError(res.status, detail)
  }
  return body as T
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return undefined
  return res.headers.get('content-type')?.includes('json') ? JSON.parse(text) : text
}
