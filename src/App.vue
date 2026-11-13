<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : AppLayout))

// Si la sesión se cierra (logout, caducidad u otra pestaña) fuera de una ruta pública, al login.
watch(
  () => auth.isAuthenticated,
  (isAuth, wasAuth) => {
    if (wasAuth && !isAuth && !route.meta.public) {
      router.replace({ name: 'login', query: { redirect: route.fullPath } })
    }
  },
)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
