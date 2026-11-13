<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Hammer } from 'lucide-vue-next'
import EmptyState from '@/components/ui/EmptyState.vue'

// Vista provisional para las rutas que aún no se han portado.
const route = useRoute()
</script>

<template>
  <EmptyState
    :icon="Hammer"
    :title="$t('shell.placeholder.title')"
    :description="`${$t('shell.placeholder.description')} (${String(route.name)})`"
  />
</template>
