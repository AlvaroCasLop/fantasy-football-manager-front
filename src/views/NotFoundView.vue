<script setup lang="ts">
import { MapPinOff } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
</script>

<template>
  <EmptyState
    :icon="MapPinOff"
    :title="$t('shell.not_found.title')"
    :description="$t('shell.not_found.description')"
  >
    <template #action>
      <RouterLink to="/" custom v-slot="{ navigate }">
        <BaseButton variant="secondary" @click="navigate">{{ $t('shell.not_found.back_home') }}</BaseButton>
      </RouterLink>
    </template>
  </EmptyState>
</template>
