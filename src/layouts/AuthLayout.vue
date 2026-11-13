<script setup lang="ts">
import LocaleSwitcher from '@/components/layout/LocaleSwitcher.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__locale">
      <LocaleSwitcher />
    </div>
    <main class="auth-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  position: relative;
  display: flex;
  min-height: 100vh;
  padding: space(4);
  background:
    radial-gradient(ellipse at top, color('crimson-subtle'), transparent 60%),
    color('ground');

  &__locale {
    position: absolute;
    top: space(4);
    right: space(4);
  }

  &__main {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
}
</style>
