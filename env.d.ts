/// <reference types="vite/client" />
/// <reference types="@intlify/unplugin-vue-i18n/messages" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENAPI_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
