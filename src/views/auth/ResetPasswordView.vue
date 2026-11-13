<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

const password = ref('')
const confirmation = ref('')
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function submit() {
  error.value = ''
  if (!password.value) return (error.value = t('reset.error_empty'))
  if (password.value !== confirmation.value) return (error.value = t('reset.error_mismatch'))
  // Supabase abre la sesión de recuperación al llegar desde el enlace del correo.
  if (!auth.isAuthenticated) return (error.value = t('reset.error_no_session'))

  loading.value = true
  try {
    await auth.updatePassword(password.value)
    done.value = true
    setTimeout(() => router.replace({ name: 'profile' }), 1500)
  } catch (e) {
    error.value = e instanceof Error && e.message ? e.message : t('login.error_default')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="reset">
    <header class="reset__header">
      <h1 class="reset__title">{{ $t('reset.title') }}</h1>
      <p class="reset__subtitle">{{ $t('reset.subtitle') }}</p>
    </header>

    <BaseAlert v-if="error" variant="error">{{ error }}</BaseAlert>
    <BaseAlert v-if="done" variant="success">{{ $t('reset.success') }}</BaseAlert>

    <form v-if="!done" class="reset__form" @submit.prevent="submit">
      <BaseInput
        v-model="password"
        :label="$t('reset.password_label')"
        :placeholder="$t('reset.password_placeholder')"
        type="password"
        autocomplete="new-password"
        minlength="6"
        required
      />
      <BaseInput
        v-model="confirmation"
        :label="$t('reset.confirm_password_label')"
        :placeholder="$t('reset.confirm_password_placeholder')"
        type="password"
        autocomplete="new-password"
        required
      />
      <BaseButton type="submit" block :loading="loading">{{ $t('reset.button') }}</BaseButton>
    </form>

    <RouterLink :to="{ name: 'login' }" class="reset__back">{{ $t('login.back_to_login') }}</RouterLink>
  </section>
</template>

<style scoped lang="scss">
.reset {
  @include panel;
  display: flex;
  flex-direction: column;
  gap: space(5);
  width: 100%;
  max-width: 24rem;
  padding: space(7);
  box-shadow: $shadow-card;

  &__header {
    text-align: center;
  }

  &__title {
    font-size: font-size('lg');
    font-weight: 900;
  }

  &__subtitle {
    margin-top: space(1.5);
    font-size: font-size('xs');
    color: color('text-secondary');
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: space(3.5);
  }

  &__back {
    font-size: font-size('xs');
    color: color('text-secondary');
    text-align: center;

    &:hover {
      color: color('text');
    }
  }
}
</style>
