<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const collapsed = ref(false)
const mobileOpen = ref(false)
</script>

<template>
  <div class="app-layout" :class="{ 'app-layout--collapsed': collapsed }">
    <AppSidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="collapsed = !collapsed"
      @close-mobile="mobileOpen = false"
    />
    <div class="app-layout__body">
      <AppHeader @open-mobile="mobileOpen = true" />
      <main class="app-layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  min-height: 100vh;

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    transition: padding-left 200ms ease;

    @include up('lg') {
      padding-left: $sidebar-width;

      .app-layout--collapsed & {
        padding-left: $sidebar-width-collapsed;
      }
    }
  }

  &__main {
    flex: 1;
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    padding: space(4);

    @include up('sm') {
      padding: space(6);
    }

    @include up('lg') {
      padding: space(8);
    }
  }
}
</style>
