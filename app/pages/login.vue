<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, LogIn, UserPlus, AlertCircle, Shield } from 'lucide-vue-next'

useHead({
  title: 'Acceso de Entrenadores · Blood Bowl Manager',
})

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// If already logged in, redirect
if (user.value) {
  router.push('/entrenadores')
}

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const username = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  successMsg.value = null

  try {
    if (isRegister.value) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            username: username.value || email.value.split('@')[0],
          },
        },
      })
      if (signUpError) throw signUpError

      if (data.user && data.session) {
        try {
          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              username: username.value || email.value.split('@')[0],
              role: 'coach',
            },
            { onConflict: 'id', ignoreDuplicates: true }
          )
        } catch {}
      }

      successMsg.value = '¡Ficha creada! Inicia sesión con tus credenciales.'
      isRegister.value = false
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) throw signInError

      if (data.user) {
        try {
          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              username:
                data.user.user_metadata?.username ||
                data.user.email?.split('@')[0] ||
                'Entrenador',
              role: 'coach',
            },
            { onConflict: 'id', ignoreDuplicates: true }
          )
        } catch {}
      }

      router.push('/')
    }
  } catch (err: any) {
    error.value = err?.message || 'Error durante la autenticación.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center py-8">
    <div class="card-panel w-full max-w-sm p-6 sm:p-7 space-y-5">
      <!-- Brand Header -->
      <div class="text-center space-y-1.5">
        <div class="w-10 h-10 rounded-lg bg-crimson flex items-center justify-center font-heading font-black text-sm text-content-primary mx-auto mb-2 shadow-sm">
          BB
        </div>
        <h2 class="text-lg font-heading font-black text-content-primary">
          {{ isRegister ? 'Inscripción de Entrenador' : 'Acceso a los Vestuarios' }}
        </h2>
        <p class="text-2xs text-content-secondary">
          {{ isRegister ? 'Registra tu ficha federativa para dirigir franquicias.' : 'Introduce tus credenciales de la Federación de Blood Bowl.' }}
        </p>
      </div>

      <!-- Feedback Alerts -->
      <div
        v-if="error"
        class="p-2.5 text-2xs bg-crimson-dark/40 border border-crimson/40 text-crimson-hover rounded flex items-center gap-2"
      >
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ error }}</span>
      </div>

      <div
        v-if="successMsg"
        class="p-2.5 text-2xs bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 rounded"
      >
        {{ successMsg }}
      </div>

      <!-- Form -->
      <form class="space-y-3.5" @submit.prevent="handleSubmit">
        <div v-if="isRegister" class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Nombre de Entrenador *
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="Ej: BobBifford, Grimjaw..."
            required
            class="w-full h-8 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors"
          >
        </div>

        <div class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Correo Electrónico *
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="entrenador@nuffle.com"
            required
            class="w-full h-8 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors"
          >
        </div>

        <div class="space-y-1">
          <label class="text-2xs font-medium uppercase tracking-wider text-content-secondary">
            Contraseña *
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••••••"
            required
            class="w-full h-8 px-3 rounded bg-surface-muted border border-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-light transition-colors"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-9 rounded bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-xs font-heading font-bold text-content-primary transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
        >
          <span v-if="loading">Verificando actas...</span>
          <span v-else-if="isRegister" class="flex items-center gap-1.5">
            <UserPlus class="w-3.5 h-3.5" />
            <span>Crear Ficha de Entrenador</span>
          </span>
          <span v-else class="flex items-center gap-1.5">
            <LogIn class="w-3.5 h-3.5" />
            <span>Entrar al Vestuario</span>
          </span>
        </button>
      </form>

      <!-- Toggle register / login -->
      <div class="pt-3 border-t border-border/50 text-center">
        <button
          type="button"
          class="text-2xs text-content-secondary hover:text-content-primary transition-colors"
          @click="isRegister = !isRegister; error = null; successMsg = null"
        >
          {{ isRegister ? '¿Ya tienes una ficha registrada? Inicia sesión' : '¿Eres un nuevo técnico? Regístrate aquí' }}
        </button>
      </div>
    </div>
  </div>
</template>
