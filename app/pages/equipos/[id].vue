<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Shield,
  Coins,
  ChevronLeft,
  Users,
  Award,
  HeartPulse,
} from 'lucide-vue-next'
import { useBloodBowl } from '~/composables/useBloodBowl'

const route = useRoute()
const teamId = computed(() => route.params.id as string)

const { getTeamById } = useBloodBowl()
const team = computed(() => getTeamById(teamId.value) || {
  id: teamId.value,
  name: 'Reikland Reavers',
  race: 'Humanos',
  coachId: 'c-1',
  coachName: 'Helmut Vance',
  played: 6,
  wins: 5,
  draws: 1,
  losses: 0,
  points: 16,
  touchdownsFor: 12,
  touchdownsAgainst: 4,
  casualtiesFor: 11,
  casualtiesAgainst: 5,
  teamValue: 1350000,
  treasury: 180000,
  rerolls: 3,
})

// Sample roster data for sports management view
const samplePlayers = [
  { number: 1, name: 'Griff Oberwald Jr.', position: 'Blitzer', ma: 7, st: 3, ag: '3+', pa: '4+', av: '9+', skills: ['Block', 'Dodge', 'Tackle'], spp: 24, status: 'Listo', cost: 115000 },
  { number: 2, name: 'Hans Gruber', position: 'Blitzer', ma: 7, st: 3, ag: '3+', pa: '4+', av: '9+', skills: ['Block', 'Mighty Blow (+1)'], spp: 18, status: 'Listo', cost: 115000 },
  { number: 3, name: 'Kurt Vance', position: 'Thrower', ma: 6, st: 3, ag: '3+', pa: '2+', av: '8+', skills: ['Pass', 'Sure Hands', 'Leader'], spp: 22, status: 'Listo', cost: 95000 },
  { number: 4, name: 'Johann Weiss', position: 'Catcher', ma: 8, st: 2, ag: '3+', pa: '5+', av: '7+', skills: ['Catch', 'Dodge', 'Sprint'], spp: 16, status: 'Listo', cost: 75000 },
  { number: 5, name: 'Felix Baum', position: 'Catcher', ma: 8, st: 2, ag: '3+', pa: '5+', av: '7+', skills: ['Catch', 'Dodge'], spp: 8, status: 'Listo', cost: 65000 },
  { number: 6, name: 'Olaf el Muro', position: 'Ogre', ma: 5, st: 5, ag: '4+', pa: '5+', av: '10+', skills: ['Bone-head', 'Mighty Blow (+1)', 'Thick Skull', 'Guard'], spp: 20, status: 'Listo', cost: 140000 },
  { number: 7, name: 'Dieter Braun', position: 'Lineman', ma: 6, st: 3, ag: '3+', pa: '4+', av: '8+', skills: ['Wrestle'], spp: 6, status: 'Listo', cost: 50000 },
  { number: 8, name: 'Gregor Koch', position: 'Lineman', ma: 6, st: 3, ag: '3+', pa: '4+', av: '8+', skills: ['Fend'], spp: 6, status: 'Listo', cost: 50000 },
  { number: 9, name: 'Otto Richter', position: 'Lineman', ma: 6, st: 3, ag: '3+', pa: '4+', av: '8+', skills: [], spp: 2, status: 'Listo', cost: 45000 },
  { number: 10, name: 'Stefan Klein', position: 'Lineman', ma: 6, st: 3, ag: '3+', pa: '4+', av: '8+', skills: [], spp: 0, status: 'Listo', cost: 45000 },
  { number: 11, name: 'Markus Vogel', position: 'Lineman', ma: 6, st: 3, ag: '3+', pa: '4+', av: '8+', skills: [], spp: 0, status: 'Lesión (-1 MA)', cost: 45000 },
]

useHead({
  title: computed(() => `${team.value.name} · Roster · Blood Bowl Manager`),
})
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <div>
      <NuxtLink
        to="/equipos"
        class="inline-flex items-center gap-1.5 text-xs text-content-secondary hover:text-content-primary transition-colors font-medium"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
        <span>Volver a Equipos</span>
      </NuxtLink>
    </div>

    <!-- Team Header Card -->
    <div class="card-panel p-5 sm:p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-surface-muted text-content-secondary font-mono text-2xs uppercase border border-border">
              {{ team.race }}
            </span>
            <span class="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 font-mono text-2xs font-bold border border-amber-800/40">
              TV {{ (team.teamValue / 1000).toFixed(0) }}k
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-heading font-black text-content-primary">
            {{ team.name }}
          </h1>
          <p class="text-xs text-content-secondary">
            Entrenador: <strong class="text-content-primary">{{ team.coachName }}</strong>
          </p>
        </div>

        <!-- Staff / Budget Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 text-center text-xs">
          <div class="p-2.5 rounded bg-surface-muted border border-border">
            <span class="text-2xs text-content-muted block uppercase">Tesorería</span>
            <span class="font-mono font-bold text-amber-400">{{ (team.treasury / 1000).toFixed(0) }}k</span>
          </div>
          <div class="p-2.5 rounded bg-surface-muted border border-border">
            <span class="text-2xs text-content-muted block uppercase">Segundas Oportunidades</span>
            <span class="font-mono font-bold text-content-primary">{{ team.rerolls }} RR</span>
          </div>
          <div class="p-2.5 rounded bg-surface-muted border border-border">
            <span class="text-2xs text-content-muted block uppercase">Hinchas Fieles</span>
            <span class="font-mono font-bold text-content-primary">4 FF</span>
          </div>
          <div class="p-2.5 rounded bg-surface-muted border border-border">
            <span class="text-2xs text-content-muted block uppercase">Boticario</span>
            <span class="font-mono font-bold text-status-win">Contratado</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Players Roster Table -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-heading font-bold text-content-primary flex items-center gap-1.5">
          <Users class="w-4 h-4 text-crimson" />
          <span>Plantilla Oficial ({{ samplePlayers.length }}/16 Jugadores)</span>
        </h2>
        <span class="text-2xs text-content-muted font-mono">
          Reglamento BB2025
        </span>
      </div>

      <div class="card-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse table-dense">
            <thead>
              <tr>
                <th class="w-10 text-center">#</th>
                <th>Nombre</th>
                <th>Posición</th>
                <th class="w-8 text-center">MA</th>
                <th class="w-8 text-center">ST</th>
                <th class="w-8 text-center">AG</th>
                <th class="w-8 text-center">PA</th>
                <th class="w-8 text-center">AV</th>
                <th>Habilidades & Rasgos</th>
                <th class="w-12 text-center">SPP</th>
                <th class="w-20 text-center">Estado</th>
                <th class="w-20 text-right pr-4">Coste</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in samplePlayers"
                :key="p.number"
                class="hover:bg-surface-hover/60 transition-colors"
              >
                <td class="text-center font-mono font-bold text-xs text-content-muted">
                  {{ p.number }}
                </td>
                <td class="font-heading font-bold text-xs text-content-primary">
                  {{ p.name }}
                </td>
                <td class="text-2xs text-content-secondary">{{ p.position }}</td>
                <td class="text-center font-mono text-xs font-semibold">{{ p.ma }}</td>
                <td class="text-center font-mono text-xs font-semibold">{{ p.st }}</td>
                <td class="text-center font-mono text-xs font-semibold">{{ p.ag }}</td>
                <td class="text-center font-mono text-xs font-semibold">{{ p.pa }}</td>
                <td class="text-center font-mono text-xs font-semibold">{{ p.av }}</td>
                <td class="text-2xs">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="sk in p.skills"
                      :key="sk"
                      class="px-1.5 py-0.5 rounded bg-surface-muted text-content-secondary border border-border text-[10px]"
                    >
                      {{ sk }}
                    </span>
                    <span v-if="!p.skills.length" class="text-content-muted italic">
                      -
                    </span>
                  </div>
                </td>
                <td class="text-center font-mono text-xs font-bold text-amber-400">
                  {{ p.spp }}
                </td>
                <td class="text-center">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[10px] uppercase font-bold border',
                      p.status === 'Listo'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                        : 'bg-crimson-dark/40 text-crimson border-crimson/40',
                    ]"
                  >
                    {{ p.status }}
                  </span>
                </td>
                <td class="text-right pr-4 font-mono text-xs text-content-secondary">
                  {{ (p.cost / 1000).toFixed(0) }}k
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
