import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { i18n } from '@/i18n'
import { routes } from './routes'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    layout?: 'app' | 'auth'
    public?: boolean
    guestOnly?: boolean
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'profile' }
  }
})

router.afterEach((to) => {
  const appName = i18n.global.t('app.name')
  const key = to.meta.titleKey
  document.title = key ? `${i18n.global.t(key)} · ${appName}` : appName
})
