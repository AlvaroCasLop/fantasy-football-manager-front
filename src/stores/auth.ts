import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const ready = ref(false)
  let initPromise: Promise<void> | null = null

  const user = computed<User | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)
  const displayName = computed(
    () => user.value?.user_metadata?.username ?? user.value?.email?.split('@')[0] ?? '',
  )

  /** Carga la sesión guardada y se suscribe a los cambios. Idempotente. */
  function init() {
    initPromise ??= (async () => {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      supabase.auth.onAuthStateChange((_event, next) => {
        session.value = next
      })
      ready.value = true
    })()
    return initPromise
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  /** Devuelve true si la cuenta queda pendiente de confirmar el correo. */
  async function signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    if (error) throw error
    return !data.session
  }

  async function requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { session, user, ready, isAuthenticated, displayName, init, signIn, signUp, signOut, requestPasswordReset, updatePassword }
})
