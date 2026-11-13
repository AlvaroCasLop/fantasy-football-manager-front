import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY: copia .env.example a .env')
}

/** Solo para autenticación. Los datos se piden a la API, no a Supabase. */
export const supabase = createClient(url || 'http://localhost:54321', anonKey || 'missing-anon-key')
