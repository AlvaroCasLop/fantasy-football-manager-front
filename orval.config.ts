import { defineConfig } from 'orval'

const OPENAPI_URL =
  process.env.VITE_OPENAPI_URL ??
  'https://fantasy-football-manager-api-production.up.railway.app/openapi.json'

export default defineConfig({
  api: {
    input: { target: OPENAPI_URL },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints',
      schemas: 'src/api/generated/model',
      client: 'fetch',
      clean: true,
      override: {
        mutator: { path: 'src/api/http.ts', name: 'apiFetch' },
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
})
