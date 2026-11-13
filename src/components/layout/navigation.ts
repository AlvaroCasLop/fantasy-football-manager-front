import type { Component } from 'vue'
import {
  Calculator,
  BookOpen,
  Crown,
  Gem,
  PenTool,
  Search,
  Shield,
  Swords,
  Trophy,
  User,
  Zap,
} from 'lucide-vue-next'

export interface NavItem {
  to: string
  labelKey: string
  icon: Component
}

export interface NavGroup {
  labelKey: string
  items: NavItem[]
}

// Mismas secciones que el menú del front React (docs/flujos-usuario.md).
export const navigation: NavGroup[] = [
  {
    labelKey: 'nav.my_club',
    items: [
      { to: '/perfil', labelKey: 'nav.profile', icon: User },
      { to: '/equipos', labelKey: 'nav.teams', icon: Shield },
    ],
  },
  {
    labelKey: 'nav.competition',
    items: [
      { to: '/ligas', labelKey: 'nav.leagues', icon: Trophy },
      { to: '/torneos', labelKey: 'nav.tournaments', icon: Swords },
    ],
  },
  {
    labelKey: 'nav.tools',
    items: [
      { to: '/partida-rapida', labelKey: 'nav.quick_match', icon: Zap },
      { to: '/pizarra', labelKey: 'nav.whiteboard', icon: PenTool },
      { to: '/calculadora', labelKey: 'shell.nav.calculator', icon: Calculator },
      { to: '/glosario', labelKey: 'nav.glossary_short', icon: BookOpen },
    ],
  },
  {
    labelKey: 'nav.community',
    items: [
      { to: '/salon-de-la-fama', labelKey: 'nav.hall_of_fame', icon: Crown },
      { to: '/entrenadores', labelKey: 'nav.find_coaches', icon: Search },
    ],
  },
  {
    labelKey: 'nav.plans',
    items: [{ to: '/planes', labelKey: 'nav.plans', icon: Gem }],
  },
]
