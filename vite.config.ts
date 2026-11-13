import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    vue(),
    // Precompila los JSON de traducciones: el runtime no necesita el compilador de mensajes.
    VueI18nPlugin({
      include: fileURLToPath(new URL('./src/i18n/locales/**', import.meta.url)),
      strictMessage: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Tokens y mixins disponibles en cualquier <style lang="scss">.
        additionalData: `@use "@/styles/abstracts" as *;\n`,
      },
    },
  },
  server: {
    port: 5173,
  },
})
