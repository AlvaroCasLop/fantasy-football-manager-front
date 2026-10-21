// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Fantasy Football Manager 🏈 | Blood Bowl League & Tournaments',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Plataforma oficial y moderna para gestión de ligas, actas de partido, torneos y estadísticas de Blood Bowl / Fantasy Football.',
        },
        { name: 'theme-color', content: '#8b0000' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap',
        },
      ],
    },
  },

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL || 'https://mock.supabase.co',
    key: process.env.SUPABASE_KEY || 'mock-anon-key',
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_BASE || process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
      apiLiveFallback: 'https://fantasy-football-manager-api-production.up.railway.app/api/v1',
    },
  },
})
