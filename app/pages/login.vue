<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Mail, Lock, LogIn, UserPlus, AlertCircle, Sparkles, Shield } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// If already logged in, redirect
if (user.value) {
  router.push('/profile')
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
            username: username.value || email.value.split('@')[0]
          }
        }
      })
      if (signUpError) throw signUpError
      // If auto-confirm is enabled or session exists, ensure profile row in public.profiles
      if (data.user && data.session) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: username.value || email.value.split('@')[0],
            role: 'coach',
          }, { onConflict: 'id', ignoreDuplicates: true })
        } catch {
          // Handled by Postgres trigger / API
        }
      }
      successMsg.value = '¡Cuenta creada! Revisa tu correo de confirmación o inicia sesión directamente.'
      isRegister.value = false
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (signInError) throw signInError
      // Ensure profile row exists in public.profiles upon login
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'Entrenador',
            role: 'coach',
          }, { onConflict: 'id', ignoreDuplicates: true })
        } catch {
          // Handled by Postgres trigger / API
        }
      }
      router.push('/profile')
    }
  } catch (err: any) {
    error.value = err?.message || 'Error durante la autenticación.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
    <div class="glass-panel w-full max-w-md rounded-2xl p-8 border border-blood-800/80 shadow-2xl space-y-6 bg-charcoal-900/90 relative overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-blood-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex p-3 rounded-2xl bg-blood-950/80 border border-blood-800/80 text-blood-500 shadow-inner mb-1">
          <Trophy class="w-8 h-8 text-amber-400" />
        </div>
        <h2 class="text-2xl font-heading font-black text-parchment-100">
          {{ isRegister ? 'Inscribirse como Entrenador' : 'Acceso a los Vestuarios' }}
        </h2>
        <p class="text-xs text-parchment-400">
          {{ isRegister ? 'Crea tu ficha federativa para fundar y liderar equipos' : 'Introduce tus credenciales de la Federación de Blood Bowl' }}
        </p>
      </div>

      <!-- Error / Success Alert -->
      <div v-if="error" class="p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded-lg flex items-center gap-2">
        <AlertCircle class="w-4 h-4 shrink-0 text-red-400" />
        <span>{{ error }}</span>
      </div>

      <div v-if="successMsg" class="p-3 text-xs bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-lg">
        {{ successMsg }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isRegister" class="space-y-1.5">
          <label class="text-xs font-heading font-semibold text-parchment-300">Nombre de Entrenador (Coach Handle) *</label>
          <div class="relative">
            <Input
              v-model="username"
              placeholder="Ej: BobBifford, Grimjaw..."
              required
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-heading font-semibold text-parchment-300">Correo Electrónico *</label>
          <div class="relative">
            <Input
              v-model="email"
              type="email"
              placeholder="entrenador@nuffle.com"
              required
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-heading font-semibold text-parchment-300">Contraseña Secreta *</label>
          <div class="relative">
            <Input
              v-model="password"
              type="password"
              placeholder="••••••••••••"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          class="w-full flex items-center justify-center gap-2 mt-2 shadow-lg"
          :disabled="loading"
        >
          <span v-if="loading">Verificando actas...</span>
          <span v-else-if="isRegister" class="flex items-center gap-2">
            <UserPlus class="w-4 h-4" />
            <span>Crear Ficha de Entrenador</span>
          </span>
          <span v-else class="flex items-center gap-2">
            <LogIn class="w-4 h-4" />
            <span>Entrar al Vestuario</span>
          </span>
        </Button>
      </form>

      <!-- Toggle register / login -->
      <div class="pt-4 border-t border-blood-900/40 text-center">
        <button
          type="button"
          @click="isRegister = !isRegister; error = null; successMsg = null"
          class="text-xs text-parchment-400 hover:text-amber-400 transition-colors"
        >
          {{ isRegister ? '¿Ya tienes una ficha registrada? Inicia sesión' : '¿Eres un nuevo estratega? Fórmate aquí' }}
        </button>
      </div>
    </div>
  </div>
</template>
