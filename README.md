# Fantasy Football Manager — Frontend

Frontend oficial de gestión para ligas, franquicias y torneos de **Blood Bowl (Reglamento 2025)**, conectado a [fantasy-football-manager-api](https://github.com/AlvaroCasLop/fantasy-football-manager-api).

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Para qué |
| :--- | :--- | :--- |
| **Framework** | Nuxt 4 + Vue 3 | SSR, navegación reactiva y arquitectura modular |
| **Lenguaje** | TypeScript | Tipado estricto en clientes API y modelos de datos |
| **Estilos** | Tailwind CSS | Paleta temática *Dark Fantasy* (crimson, oro viejo, carbón) |
| **Componentes UI** | shadcn-vue / Radix Vue | Tablas, tarjetas, diálogos, insignias y botones |
| **Autenticación** | Supabase Auth + `@nuxtjs/supabase` | Gestión de sesión de entrenadores y propagación JWT Bearer |
| **API Backend** | FastAPI | Comunicación con `fantasy-football-manager-api` |
| **Hosting** | Vercel | Despliegue SSR serverless optimizado (`vercel.json`) |
| **Tests** | Vitest + Playwright | Pruebas unitarias de utilidades y pruebas E2E de interfaz |

---

## 📂 Arquitectura de Páginas y Módulos

```
app/
├── assets/css/main.css       # Estilos globales, paleta temática y utilidades de cristal
├── components/ui/            # Componentes shadcn-vue (Button, Badge, Card, Table, Input)
├── composables/
│   └── useApi.ts             # Cliente tipado para todos los endpoints de FastAPI
├── layouts/
│   └── default.vue           # Barra superior con estado API en vivo, navegación y pie
├── lib/
│   └── utils.ts              # cn (clsx + tailwind-merge) y formateador de oro (formatGold)
└── pages/
    ├── index.vue             # Portada épica, acceso rápido con código y métricas
    ├── leagues/
    │   ├── index.vue         # Listado, búsqueda y creación de ligas
    │   └── [id].vue          # Clasificación, Líderes, Jornadas, Recompensas y Equipos
    ├── teams/
    │   ├── index.vue         # Franquicias registradas, filtros por raza y creación
    │   └── [id].vue          # Plantilla oficial (16 jugadores), TV, tesorería y fichajes
    ├── hall-of-fame.vue      # Salón de la Fama de Nuffle (SPP, Anotadores, Bajas, Equipos)
    ├── reference/
    │   └── index.vue         # Compendio de 29 razas, habilidades, jugadores estrella e incentivos
    ├── login.vue             # Inicio de sesión y registro de entrenadores con Supabase
    └── profile.vue           # Perfil del entrenador, palmarés, vitrina de trofeos y NAF
```

---

## 🚀 Inicio Rápido

### 1. Requisitos Previos
- Node.js 18+ o 20+
- npm o pnpm

### 2. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Configura tus credenciales:
```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### 5. Compilar para Producción
```bash
npm run build
```

---

## 🧪 Pruebas Automatizadas

- **Pruebas unitarias (Vitest)**:
  ```bash
  npm test
  ```
- **Pruebas E2E (Playwright)**:
  ```bash
  npm run test:e2e
  ```

---

## ☁️ Despliegue en Vercel

El proyecto incluye la configuración `vercel.json` compatible con el preset Nitro de Nuxt 4:
1. Conecta el repositorio en el panel de Vercel.
2. Añade las variables de entorno `NUXT_PUBLIC_API_BASE`, `SUPABASE_URL` y `SUPABASE_KEY`.
3. Vercel ejecutará automáticamente `npm run build` y desplegará la función SSR.
