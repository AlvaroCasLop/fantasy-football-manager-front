# Blood Bowl Manager — Frontend de Gestión Deportiva

Interfaz web de gestión deportiva con estética de fantasía oscura para **Blood Bowl** (Reglamento 2025). Diseñada con paneles compactos, tablas densas y legibles, estadísticas destacadas y un sistema de diseño táctico.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Para qué |
| :--- | :--- | :--- |
| **Framework** | **Nuxt 4 + Vue 3** | SSR, rutas reactivas y arquitectura modular (`future.compatibilityVersion: 4`) |
| **Lenguaje** | **TypeScript** | Tipado estricto en modelos de dominio y composables |
| **Estilos** | **Tailwind CSS** | Paleta táctica: fondo `#111318`, sidebar `#171A21`, paneles `#1D212B`, bordes `#303644`, carmesí `#B8323C` |
| **Componentes UI** | **shadcn-vue / Radix Vue** | Tablas, tarjetas, diálogos, insignias y botones |
| **Iconos** | **Lucide Vue Next** | Iconografía deportiva y contextual coherente |
| **Hosting** | **Vercel** | Despliegue SSR serverless optimizado (`vercel.json`) |
| **Tests** | **Vitest + Playwright** | Pruebas unitarias de utilidades y pruebas de navegador E2E |

---

## 🎨 Sistema de Diseño (Fantasía Oscura)

- **Fondo principal**: `#111318` (`bg-ground`)
- **Sidebar**: `#171A21` (`bg-sidebar`)
- **Tarjetas y paneles**: `#1D212B` (`bg-surface`) con hover en `#242936`
- **Bordes sutiles**: `#303644` (`border-border`)
- **Texto principal**: `#F1F3F5` y secundario `#A1A8B5`
- **Acento**: Carmesí `#B8323C` (`accent-crimson`)
- **Indicadores**: Verde apagado (`#3FA26C`), ámbar (`#D97706`), peligro (`#B8323C`)

---

## 📂 Rutas Implementadas

| Ruta | Descripción |
| :--- | :--- |
| `/` | **Dashboard inicial** con 4 tarjetas de resumen, tabla de ligas recientes, próximos partidos y feed de actividad |
| `/ligas` | Catálogo de competiciones con buscador por nombre y filtro por formato |
| `/ligas/[slug]` | Ficha de liga con pestañas de Clasificación, Jornadas y Equipos inscritos |
| `/equipos` | Franquicias federadas, búsqueda, filtro por raza y TV |
| `/equipos/[id]` | Plantilla oficial (16 jugadores), línea de atributos (MA, ST, AG, PA, AV), habilidades, SPP, TV y tesorería |
| `/entrenadores` | Directorio de técnicos federados, palmarés, lema y NAF ID |
| `/partidos` | Calendario de enfrentamientos oficiales con filtros por estado |
| `/partidos/[id]` | Acta oficial de encuentro (marcador, estadio, MVP y anotaciones) |
| `/estadisticas` | Tablas de máximos anotadores (TD), carniceros del campo (bajas) y estrellas (SPP) |
| `/configuracion` | Ajustes de reglamento BB2025, recompensas y endpoint de backend FastAPI |
| `/login` | Inicio de sesión y registro de entrenadores |

---

## 🚀 Cómo Arrancar el Proyecto

### 1. Requisitos Previos
- Node.js 18+ o 20+
- npm o pnpm

### 2. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Variables recomendadas:
```env
NUXT_API_BASE=http://localhost:8000/api/v1
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

## 🧩 Funciones que Actualmente Utilizan Datos Ficticios Tipados

Para garantizar que la interfaz sea plenamente interactiva sin depender de conexión a base de datos en esta fase, se utilizan datos de demostración tipados en `app/data/mockBloodBowlData.ts` orquestados mediante el composable `app/composables/useBloodBowl.ts`:

1. **Dashboard Stats**: Conteo de 4 ligas activas, 32 equipos, 86 partidos disputados y 12 pendientes.
2. **Tabla de Ligas**: Competiciones demostrativas (*Liga del Viejo Mundo*, *Copa de los Reinos*, *Liga de la Ciudad Maldita*, *Torneo de los Condenados*). La acción de *Crear Liga* añade reactivamente nuevas ligas al estado de sesión.
3. **Próximos Partidos**: Enfrentamientos ficticios entre franquicias emblemáticas (*Reikland Reavers* vs *Gouged Eye*, *Skavenblight Scramblers* vs *Dwarf Giants*, etc.).
4. **Feed de Actividad**: Eventos de actas validadas, lesiones y altas de equipos.
5. **Roster de Equipos**: Plantillas de ejemplo con atributos oficiales Blood Bowl 2025 (MA, ST, AG, PA, AV).

> **Migración a FastAPI**: Todos los componentes consumen el composable `useBloodBowl()`, permitiendo conectar los endpoints de `fantasy-football-manager-api` simplemente sustituyendo las fuentes del composable por `$fetch` sin reescribir la capa de presentación.
