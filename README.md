# Blood Bowl Manager — Front

SPA en Vue 3 para gestionar ligas y torneos de Blood Bowl. Consume la API FastAPI
([fantasy-football-manager-api](https://fantasy-football-manager-api-production.up.railway.app/docs))
y usa Supabase solo para autenticarse.

## Stack

| | |
| --- | --- |
| Framework | Vue 3 + Vite + TypeScript |
| Rutas | Vue Router |
| Estado | Pinia |
| Traducciones | Vue I18n (es, en) |
| Cliente de la API | orval, generado desde el OpenAPI del back |
| Estilos | Sass (SCSS) con tokens propios, sin framework CSS |
| Auth | Supabase Auth; el JWT va en cada petición a la API |
| Tests | Vitest + Vue Test Utils, Playwright |
| Iconos | lucide-vue-next |

## Arrancar

```bash
cp .env.example .env   # rellena la URL de la API y las claves de Supabase
npm install
npm run dev            # http://localhost:5173
```

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Comprobación de tipos y build de producción |
| `npm run preview` | Sirve el build |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests E2E (Playwright; la primera vez, `npx playwright install chromium`) |
| `npm run api:generate` | Regenera el cliente de la API con orval |

## Estructura

```
src/
  api/
    http.ts            fetch común: URL base, JWT de Supabase y errores (ApiError)
    generated/         cliente generado por orval; no se edita a mano
  components/
    layout/            barra lateral, cabecera, menú de usuario, selector de idioma
    ui/                componentes base (BaseButton, BaseInput, BaseAlert…)
  composables/         lógica reutilizable (useAsyncData…)
  i18n/                configuración y catálogos es/en
  layouts/             AppLayout (con sesión) y AuthLayout (login)
  lib/                 cliente de Supabase y utilidades
  router/              rutas y guardas de sesión
  stores/              stores de Pinia (auth)
  styles/              tokens, mixins y estilos globales
  views/               una vista por ruta
tests/
  unit/                Vitest
  e2e/                 Playwright
```

## Convenciones

### API

- El cliente se genera desde `/openapi.json` del back: `npm run api:generate`. Por defecto
  usa producción; para la API local, `VITE_OPENAPI_URL=http://localhost:8000/openapi.json`.
- El código generado se versiona, para que el front compile sin tener el back levantado.
  Si cambia el contrato, se regenera y se sube en el mismo PR.
- Todas las funciones pasan por `apiFetch` (`src/api/http.ts`). Ahí se añade el token y,
  si la respuesta no es 2xx, se lanza `ApiError` con el `detail` de FastAPI.
- Los datos se piden siempre a la API, nunca a Supabase directamente.

### Traducciones

- Catálogos en `src/i18n/locales/{es,en}.json`. Vienen del front React
  (`scripts/import-locales.mjs`, ya ejecutado). Desde entonces son la fuente de verdad.
- Las claves siguen `área.componente.texto`. Las del armazón nuevo van en `shell.*`.
- Sintaxis de Vue I18n: `{var}`, plurales `uno | varios` con `t(clave, { count }, n)`, y
  `{'@'}` o `{'|'}` para esos caracteres literales.
- Algunos textos del catálogo llevan marcadores `<1>…</1>`, heredados de `Trans` de
  React. Al portar su componente se resuelven con `<i18n-t>`.
- Un test comprueba que es y en tienen las mismas claves.
- Solo es va en el bundle; en se carga al elegirlo.

### Estilos

- `src/styles/abstracts` contiene los tokens, `color()`, `space()`, `font-size()` y mixins
  como `up('lg')`, `panel` o `focus-ring`. Se inyecta en cada `<style lang="scss">`, así que
  no hace falta importarlo.
- Los colores se publican como variables CSS (`--color-*`); en SCSS se usan con
  `color('crimson')`.
- Estilos `scoped` con BEM (`.league-card__name`).

### Rutas

- El mapa de rutas sale de los flujos de usuario del front React.
- Las rutas privadas exigen sesión; sin ella se redirige a `/login?redirect=…`.
- Las vistas aún no portadas usan `PlaceholderView`.

## Estado

Portado:

- Acceso: login, registro y recuperación de contraseña.
- Armazón de la app: barra lateral, cabecera e idioma.
- Lista de ligas, contra la API real.

Lo demás es un placeholder con su ruta definida:

- Perfil y equipos: perfil, equipos y plantilla.
- Ligas: detalle con 9 pestañas y acta de partido.
- Torneos: lista y detalle con 5 pestañas.
- Herramientas: partida rápida, pizarra, calculadora y glosario.
- Comunidad y planes: hall of fame, entrenadores y planes.
