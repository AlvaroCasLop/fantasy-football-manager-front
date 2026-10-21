<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  BookOpen,
  Search,
  Sparkles,
  Shield,
  Star,
  Coins,
  Filter,
  CheckCircle,
  HelpCircle,
  Flame,
  ChevronRight
} from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { formatGold } from '~/lib/utils'
import Badge from '~/components/ui/Badge.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import Input from '~/components/ui/Input.vue'

const api = useApi()

const activeTab = ref<'races' | 'skills' | 'stars' | 'inducements'>('races')
const loading = ref(true)
const error = ref<string | null>(null)

// Data
const racesData = ref<Record<string, any>>({})
const skillsData = ref<any>({ skills: [], categories: {}, elite_skills: [] })
const starsData = ref<any[]>([])
const inducementsData = ref<any[]>([])

// Race selection
const selectedRaceKey = ref<string | null>(null)

// Skill filtering
const skillSearch = ref('')
const selectedSkillCategory = ref<string>('ALL')
const eliteOnly = ref(false)

// Star search
const starSearch = ref('')

const loadReferenceData = async () => {
  loading.value = true
  error.value = null
  try {
    const [rRes, sRes, starRes, indRes] = await Promise.allSettled([
      api.getRaces(),
      api.getSkills(),
      api.getStars(),
      api.getInducements()
    ])

    if (rRes.status === 'fulfilled' && rRes.value) {
      racesData.value = rRes.value
      const keys = Object.keys(rRes.value)
      if (keys.length > 0) {
        selectedRaceKey.value = keys[0]
      }
    }

    if (sRes.status === 'fulfilled') skillsData.value = sRes.value || { skills: [] }
    if (starRes.status === 'fulfilled') starsData.value = starRes.value || []
    if (indRes.status === 'fulfilled') inducementsData.value = indRes.value || []
  } catch (err: any) {
    error.value = err?.message || 'Error cargando compendio de reglas'
  } finally {
    loading.value = false
  }
}

// Computed
const currentRace = computed(() => {
  if (!selectedRaceKey.value) return null
  return racesData.value[selectedRaceKey.value]
})

const filteredSkills = computed(() => {
  const list = skillsData.value.skills || []
  return list.filter((s: any) => {
    const matchesSearch = !skillSearch.value ||
      (s.name && s.name.toLowerCase().includes(skillSearch.value.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(skillSearch.value.toLowerCase()))
    const matchesCategory = selectedSkillCategory.value === 'ALL' ||
      s.category === selectedSkillCategory.value
    const matchesElite = !eliteOnly.value || s.is_elite === true
    return matchesSearch && matchesCategory && matchesElite
  })
})

const filteredStars = computed(() => {
  return starsData.value.filter((st: any) => {
    if (!starSearch.value) return true
    const q = starSearch.value.toLowerCase()
    return (
      (st.name && st.name.toLowerCase().includes(q)) ||
      (st.special_rule && st.special_rule.toLowerCase().includes(q)) ||
      (st.plays_for && JSON.stringify(st.plays_for).toLowerCase().includes(q))
    )
  })
})

onMounted(() => {
  loadReferenceData()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-heading font-black text-parchment-100 flex items-center gap-3">
          <BookOpen class="w-8 h-8 text-blood-500" />
          <span>Compendio y Reglamento</span>
        </h1>
        <p class="text-sm text-parchment-400 mt-1">
          Reglas oficiales, fichas de facciones, habilidades e incentivos de Blood Bowl 2025
        </p>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <div class="flex overflow-x-auto border-b border-blood-900/40 gap-2 pb-1 scrollbar-thin">
      <button
        type="button"
        @click="activeTab = 'races'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'races'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Shield class="w-4 h-4 text-blood-400" />
        <span>Razas y Plantillas</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'skills'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'skills'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Sparkles class="w-4 h-4 text-amber-400" />
        <span>Habilidades & Rasgos</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'stars'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'stars'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Star class="w-4 h-4 text-amber-400" />
        <span>Jugadores Estrella ({{ starsData.length }})</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'inducements'"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-all whitespace-nowrap',
          activeTab === 'inducements'
            ? 'bg-blood-950/80 text-parchment-100 border border-blood-800/80 shadow-md'
            : 'text-parchment-400 hover:text-parchment-200 hover:bg-charcoal-900/50'
        ]"
      >
        <Coins class="w-4 h-4 text-parchment-200" />
        <span>Incentivos Oficiales</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-10 h-10 border-4 border-blood-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-parchment-400">Abriendo el tomo de Nuffle...</p>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- TAB 1: RAZAS Y POSICIONALES -->
      <div v-if="activeTab === 'races'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Race Selector Sidebar -->
        <div class="lg:col-span-1 glass-panel p-4 rounded-xl border border-blood-900/50 space-y-2 max-h-[700px] overflow-y-auto">
          <h3 class="text-xs font-heading font-bold uppercase tracking-wider text-parchment-400 px-2 mb-2">
            Selecciona una Raza
          </h3>
          <button
            v-for="(raceObj, key) in racesData"
            :key="key"
            type="button"
            @click="selectedRaceKey = String(key)"
            :class="[
              'w-full text-left px-3 py-2.5 rounded-lg text-xs font-heading font-semibold transition-all flex items-center justify-between',
              selectedRaceKey === key
                ? 'bg-blood-950 text-parchment-100 border border-blood-800 shadow'
                : 'text-parchment-400 hover:bg-charcoal-900 hover:text-parchment-200'
            ]"
          >
            <span class="capitalize">{{ raceObj.name || key }}</span>
            <ChevronRight class="w-3.5 h-3.5 text-blood-500" />
          </button>
        </div>

        <!-- Selected Race Details & Positionals -->
        <div v-if="currentRace" class="lg:col-span-3 space-y-6">
          <div class="glass-panel p-6 rounded-xl border border-blood-900/60 bg-gradient-to-r from-charcoal-950 to-blood-950/20">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h2 class="text-2xl font-heading font-black text-parchment-100 capitalize">
                  {{ currentRace.name || selectedRaceKey }}
                </h2>
                <p v-if="currentRace.tier" class="text-xs text-parchment-400 mt-0.5">
                  Nivel de Dificultad: <strong class="text-amber-400">Tier {{ currentRace.tier }}</strong>
                </p>
              </div>

              <div class="flex flex-wrap gap-2 text-xs">
                <Badge variant="gold" class="font-mono">
                  Segunda Oportunidad: {{ formatGold(currentRace.reroll_cost || 50000) }}
                </Badge>
                <Badge :variant="currentRace.apothecary ? 'green' : 'secondary'">
                  {{ currentRace.apothecary ? 'Boticario Sí' : 'Sin Boticario' }}
                </Badge>
              </div>
            </div>

            <!-- Positionals Table -->
            <div class="rounded-lg overflow-hidden border border-blood-900/60 mt-4">
              <Table>
                <TableHeader class="bg-charcoal-950">
                  <TableRow>
                    <TableHead class="text-xs uppercase w-12 text-center">Cant.</TableHead>
                    <TableHead class="text-xs uppercase">Posición</TableHead>
                    <TableHead class="text-center text-xs uppercase w-8">MA</TableHead>
                    <TableHead class="text-center text-xs uppercase w-8">ST</TableHead>
                    <TableHead class="text-center text-xs uppercase w-8">AG</TableHead>
                    <TableHead class="text-center text-xs uppercase w-8">PA</TableHead>
                    <TableHead class="text-center text-xs uppercase w-8">AV</TableHead>
                    <TableHead class="text-xs uppercase">Habilidades Iniciales</TableHead>
                    <TableHead class="text-xs uppercase w-20 text-center">Prim / Sec</TableHead>
                    <TableHead class="text-right text-xs uppercase pr-4">Coste</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(pos, idx) in (currentRace.positionals || currentRace.roster || [])"
                    :key="idx"
                    class="hover:bg-blood-950/20 transition-colors"
                  >
                    <TableCell class="text-center text-xs font-mono font-bold text-parchment-400">
                      {{ pos.qty || pos.max_qty || '0-16' }}
                    </TableCell>
                    <TableCell class="font-heading font-bold text-parchment-100 text-xs">
                      {{ pos.title || pos.name || pos.position }}
                    </TableCell>
                    <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">{{ pos.ma }}</TableCell>
                    <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">{{ pos.st }}</TableCell>
                    <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">{{ pos.ag }}</TableCell>
                    <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">{{ pos.pa || '-' }}</TableCell>
                    <TableCell class="text-center font-mono text-xs font-semibold text-parchment-200">{{ pos.av }}</TableCell>
                    <TableCell class="text-xs">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="sk in (pos.skills || [])"
                          :key="sk"
                          class="px-1.5 py-0.5 rounded text-[10px] bg-charcoal-900 text-parchment-300 border border-charcoal-700"
                        >
                          {{ sk }}
                        </span>
                        <span v-if="!pos.skills || !pos.skills.length" class="text-parchment-500 italic text-[11px]">-</span>
                      </div>
                    </TableCell>
                    <TableCell class="text-center font-mono text-[10px] text-parchment-400">
                      {{ pos.primary || 'G' }} / {{ pos.secondary || 'A' }}
                    </TableCell>
                    <TableCell class="text-right font-mono text-xs text-parchment-200 pr-4">
                      {{ formatGold(pos.cost || 50000) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: HABILIDADES (SKILLS) -->
      <div v-if="activeTab === 'skills'" class="space-y-6">
        <!-- Filter bar -->
        <div class="glass-panel p-4 rounded-xl border border-blood-900/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative w-full sm:w-80">
            <Search class="w-4 h-4 absolute left-3 top-3 text-parchment-500" />
            <Input
              v-model="skillSearch"
              placeholder="Buscar habilidad o regla..."
              class="pl-9"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              v-model="selectedSkillCategory"
              class="bg-charcoal-900 border border-blood-800/60 rounded-md px-3 py-2 text-xs text-parchment-100 focus:outline-none focus:ring-2 focus:ring-blood-500"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="G">Generales (General)</option>
              <option value="A">Agilidad (Agility)</option>
              <option value="P">Pase (Passing)</option>
              <option value="S">Fuerza (Strength)</option>
              <option value="M">Mutaciones (Mutations)</option>
              <option value="T">Rasgos (Traits)</option>
            </select>

            <button
              type="button"
              @click="eliteOnly = !eliteOnly"
              :class="[
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-colors',
                eliteOnly
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/60'
                  : 'bg-charcoal-900 text-parchment-400 border-blood-800/60 hover:text-parchment-200'
              ]"
            >
              <Flame class="w-3.5 h-3.5 text-amber-400" />
              <span>Solo Élite</span>
            </button>
          </div>
        </div>

        <!-- Skills Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="skill in filteredSkills"
            :key="skill.id || skill.name"
            class="glass-card p-5 rounded-xl border border-blood-900/50 space-y-2 hover:border-blood-700/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-charcoal-800 text-parchment-400 border border-charcoal-700">
                  {{ skill.category_name || skill.category || 'Habilidad' }}
                </span>
                <Badge v-if="skill.is_elite" variant="gold" class="text-[10px]">
                  ÉLITE
                </Badge>
              </div>

              <h3 class="font-heading font-bold text-parchment-100 text-base">
                {{ skill.name }}
              </h3>

              <p class="text-xs text-parchment-400 mt-2 leading-relaxed">
                {{ skill.description || 'Sin descripción detallada disponible en el compendio.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: JUGADORES ESTRELLA -->
      <div v-if="activeTab === 'stars'" class="space-y-6">
        <div class="glass-panel p-4 rounded-xl border border-blood-900/40 flex items-center justify-between">
          <div class="relative w-full sm:w-80">
            <Search class="w-4 h-4 absolute left-3 top-3 text-parchment-500" />
            <Input
              v-model="starSearch"
              placeholder="Buscar jugador estrella o regla..."
              class="pl-9"
            />
          </div>
          <span class="text-xs text-parchment-400 hidden sm:inline-block">
            Mostrando {{ filteredStars.length }} jugadores estrella
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="star in filteredStars"
            :key="star.id || star.name"
            class="glass-panel p-6 rounded-xl border border-blood-900/60 space-y-4 hover:border-blood-700/80 transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-heading font-black text-lg text-parchment-100 flex items-center gap-2">
                  <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{{ star.name }}</span>
                </h3>
                <p class="text-xs text-parchment-400 mt-0.5">
                  Juega para: <span class="text-parchment-200">{{ Array.isArray(star.plays_for) ? star.plays_for.join(', ') : star.plays_for }}</span>
                </p>
              </div>
              <Badge variant="gold" class="font-mono font-bold text-sm">
                {{ formatGold(star.cost || 200000) }}
              </Badge>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-5 gap-2 text-center bg-charcoal-950 p-2.5 rounded-lg border border-blood-900/40 text-xs font-mono">
              <div><span class="text-parchment-500 text-[10px] block">MA</span><span class="font-bold text-parchment-200">{{ star.ma }}</span></div>
              <div><span class="text-parchment-500 text-[10px] block">ST</span><span class="font-bold text-parchment-200">{{ star.st }}</span></div>
              <div><span class="text-parchment-500 text-[10px] block">AG</span><span class="font-bold text-parchment-200">{{ star.ag }}</span></div>
              <div><span class="text-parchment-500 text-[10px] block">PA</span><span class="font-bold text-parchment-200">{{ star.pa || '-' }}</span></div>
              <div><span class="text-parchment-500 text-[10px] block">AV</span><span class="font-bold text-parchment-200">{{ star.av }}</span></div>
            </div>

            <!-- Skills -->
            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold text-parchment-500 block">Habilidades</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="sk in (star.skills || [])"
                  :key="sk"
                  class="px-2 py-0.5 rounded text-[11px] bg-charcoal-900 text-parchment-300 border border-charcoal-700"
                >
                  {{ sk }}
                </span>
              </div>
            </div>

            <!-- Special Rule -->
            <div v-if="star.special_rule" class="p-3 rounded bg-blood-950/40 border border-blood-900/40 text-xs">
              <span class="font-heading font-bold text-amber-400 block mb-0.5">Regla Especial: {{ star.special_rule_name || 'Habilidad Única' }}</span>
              <p class="text-parchment-300 text-[11px] leading-relaxed">{{ star.special_rule }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: INCENTIVOS OFICIALES -->
      <div v-if="activeTab === 'inducements'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="ind in inducementsData"
          :key="ind.id || ind.name"
          class="glass-panel p-5 rounded-xl border border-blood-900/50 space-y-3 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs text-parchment-400 font-mono">Max: {{ ind.max_allowed || 1 }}</span>
              <Badge variant="gold" class="font-mono">
                {{ formatGold(ind.cost || 50000) }}
              </Badge>
            </div>

            <h3 class="font-heading font-bold text-parchment-100 text-base">
              {{ ind.name }}
            </h3>

            <p class="text-xs text-parchment-400 mt-2 leading-relaxed">
              {{ ind.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
