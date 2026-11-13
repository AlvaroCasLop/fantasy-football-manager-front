import type { RouteRecordRaw } from 'vue-router'

// Mapa sacado de docs/flujos-usuario.md del front React.
// meta.titleKey: clave i18n del título. meta.public: accesible sin sesión.
// meta.guestOnly: solo sin sesión (login). Lo que aún no está portado usa PlaceholderView.

const Placeholder = () => import('@/views/PlaceholderView.vue')
const TabbedSection = () => import('@/views/TabbedSectionView.vue')

const leagueTabs = [
  ['clasificacion', 'standings'],
  ['partidos', 'matches'],
  ['jornadas', 'calendar'],
  ['equipos', 'teams'],
  ['playoffs', 'playoffs'],
  ['estadisticas', 'stats'],
  ['salon-de-la-fama', 'hall_of_fame'],
  ['recompensas', 'bounties'],
  ['reglamento', 'rules'],
] as const

const tournamentTabs = [
  ['participantes', 'participants'],
  ['rondas', 'rounds'],
  ['clasificacion', 'standings'],
  ['estadisticas', 'stats'],
  ['reglamento', 'rules'],
] as const

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'auth', public: true, guestOnly: true, titleKey: 'login.title_login' },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: { layout: 'auth', public: true, titleKey: 'reset.title' },
  },

  { path: '/', redirect: { name: 'profile' } },

  // Mi Club
  { path: '/perfil', name: 'profile', component: Placeholder, meta: { titleKey: 'nav.profile' } },
  { path: '/equipos', name: 'teams', component: Placeholder, meta: { titleKey: 'nav.teams' } },
  {
    path: '/equipos/:teamId',
    name: 'team-roster',
    component: Placeholder,
    meta: { titleKey: 'nav.teams' },
  },

  // Competición
  {
    path: '/ligas',
    name: 'leagues',
    component: () => import('@/views/leagues/LeagueListView.vue'),
    meta: { titleKey: 'nav.leagues' },
  },
  {
    path: '/ligas/:leagueId',
    component: TabbedSection,
    meta: { titleKey: 'nav.leagues' },
    children: [
      { path: '', name: 'league', redirect: { name: 'league-standings' } },
      ...leagueTabs.map(([path, key]) => ({
        path,
        name: `league-${key.replaceAll('_', '-')}`,
        component: Placeholder,
        meta: { titleKey: `league.tabs.${key}` },
      })),
    ],
  },
  {
    path: '/ligas/:leagueId/partidos/:matchId/acta',
    name: 'league-match-report',
    component: Placeholder,
    meta: { titleKey: 'nav.leagues' },
  },
  { path: '/torneos', name: 'tournaments', component: Placeholder, meta: { titleKey: 'nav.tournaments' } },
  {
    path: '/torneos/:tournamentId',
    component: TabbedSection,
    meta: { titleKey: 'nav.tournaments' },
    children: [
      { path: '', name: 'tournament', redirect: { name: 'tournament-participants' } },
      ...tournamentTabs.map(([path, key]) => ({
        path,
        name: `tournament-${key}`,
        component: Placeholder,
        meta: { titleKey: `tournament.tabs.${key}` },
      })),
    ],
  },

  // Herramientas
  { path: '/partida-rapida', name: 'quick-match', component: Placeholder, meta: { titleKey: 'nav.quick_match' } },
  { path: '/pizarra', name: 'whiteboard', component: Placeholder, meta: { titleKey: 'nav.whiteboard' } },
  { path: '/calculadora', name: 'calculator', component: Placeholder, meta: { titleKey: 'shell.nav.calculator' } },
  { path: '/glosario', name: 'glossary', component: Placeholder, meta: { public: true, titleKey: 'nav.glossary_short' } },

  // Comunidad
  { path: '/salon-de-la-fama', name: 'hall-of-fame', component: Placeholder, meta: { titleKey: 'nav.hall_of_fame' } },
  { path: '/entrenadores', name: 'coaches', component: Placeholder, meta: { titleKey: 'nav.find_coaches' } },
  {
    path: '/entrenadores/:coachId',
    name: 'coach',
    component: Placeholder,
    meta: { titleKey: 'nav.coach' },
  },

  // Planes
  { path: '/planes', name: 'pricing', component: Placeholder, meta: { public: true, titleKey: 'nav.plans' } },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, titleKey: 'shell.not_found.title' },
  },
]
