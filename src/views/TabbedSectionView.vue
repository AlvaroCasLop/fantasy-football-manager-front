<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Contenedor provisional de liga y torneo: pinta las pestañas (rutas hijas) y la activa.
// Se sustituirá por la cabecera real de cada sección al portarla.
const route = useRoute()

const tabs = computed(() => {
  const parent = route.matched[0]
  return (parent?.children ?? [])
    .filter((child) => child.path && child.name && child.meta?.titleKey)
    .map((child) => ({ name: child.name!, titleKey: child.meta!.titleKey! }))
})
</script>

<template>
  <div>
    <nav class="tabs" :aria-label="$t(route.matched[0]?.meta.titleKey ?? 'app.name')">
      <RouterLink
        v-for="tab in tabs"
        :key="String(tab.name)"
        :to="{ name: tab.name, params: route.params }"
        class="tabs__link"
        active-class="tabs__link--active"
      >
        {{ $t(tab.titleKey) }}
      </RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  gap: space(1);
  margin-bottom: space(6);
  overflow-x: auto;
  border-bottom: 1px solid color('border');

  &__link {
    @include focus-ring;
    flex-shrink: 0;
    padding: space(2) space(3);
    border-bottom: 2px solid transparent;
    font-family: $font-heading;
    font-size: font-size('xs');
    font-weight: 600;
    color: color('text-secondary');
    white-space: nowrap;

    &:hover {
      color: color('text');
    }

    &--active {
      border-bottom-color: color('crimson');
      color: color('text');
    }
  }
}
</style>
