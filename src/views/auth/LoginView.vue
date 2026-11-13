<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { safeRedirect } from '@/router/redirect'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

type Mode = 'login' | 'signup' | 'forgot'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const mode = ref<Mode>('login')
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const notice = ref('')

const copy = computed(() => {
  switch (mode.value) {
    case 'signup':
      return {
        title: t('login.title_signup'),
        subtitle: t('login.subtitle_signup'),
        submit: t('login.button_signup'),
      }
    case 'forgot':
      return {
        title: t('login.title_forgot'),
        subtitle: t('login.subtitle_forgot'),
        submit: t('login.button_forgot'),
      }
    default:
      return {
        title: t('login.title_login'),
        subtitle: t('login.subtitle_login'),
        submit: t('login.button_login'),
      }
  }
})

function switchMode(next: Mode) {
  mode.value = next
  error.value = ''
  notice.value = ''
}

async function submit() {
  loading.value = true
  error.value = ''
  notice.value = ''
  try {
    if (mode.value === 'login') {
      await auth.signIn(email.value, password.value)
      await router.replace(safeRedirect(route.query.redirect))
    } else if (mode.value === 'signup') {
      const pendingConfirmation = await auth.signUp(
        email.value,
        password.value,
        username.value.trim() || email.value.split('@')[0]!,
      )
      if (pendingConfirmation) {
        notice.value = t('login.alert_signup_success')
        mode.value = 'login'
      } else {
        await router.replace(safeRedirect(route.query.redirect))
      }
    } else {
      await auth.requestPasswordReset(email.value)
      notice.value = t('login.alert_forgot_success')
    }
  } catch (e) {
    error.value = e instanceof Error && e.message ? e.message : t('login.error_default')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <header class="login__header">
      <span class="login__logo" aria-hidden="true">BB</span>
      <h1 class="login__title">{{ copy.title }}</h1>
      <p class="login__subtitle">{{ copy.subtitle }}</p>
    </header>

    <BaseAlert v-if="error" variant="error">{{ error }}</BaseAlert>
    <BaseAlert v-if="notice" variant="success">{{ notice }}</BaseAlert>

    <form class="login__form" @submit.prevent="submit">
      <BaseInput
        v-if="mode === 'signup'"
        v-model="username"
        :label="$t('login.username_label')"
        :placeholder="$t('login.username_placeholder')"
        autocomplete="username"
        required
      />
      <BaseInput
        v-model="email"
        :label="$t('login.email_label')"
        :placeholder="$t('login.email_placeholder')"
        type="email"
        autocomplete="email"
        required
      />
      <BaseInput
        v-if="mode !== 'forgot'"
        v-model="password"
        :label="$t('login.password_label')"
        :placeholder="$t('login.password_placeholder')"
        type="password"
        :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
        minlength="6"
        required
      />

      <button
        v-if="mode === 'login'"
        type="button"
        class="login__link login__link--end"
        @click="switchMode('forgot')"
      >
        {{ $t('login.forgot_password_link') }}
      </button>

      <BaseButton type="submit" block :loading="loading">
        {{ loading ? $t('login.button_loading') : copy.submit }}
      </BaseButton>
    </form>

    <footer class="login__footer">
      <template v-if="mode === 'login'">
        {{ $t('login.footer_login') }}
        <button type="button" class="login__link" @click="switchMode('signup')">
          {{ $t('login.toggle_login') }}
        </button>
      </template>
      <template v-else-if="mode === 'signup'">
        {{ $t('login.footer_signup') }}
        <button type="button" class="login__link" @click="switchMode('login')">
          {{ $t('login.toggle_signup') }}
        </button>
      </template>
      <button v-else type="button" class="login__link" @click="switchMode('login')">
        {{ $t('login.back_to_login') }}
      </button>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.login {
  @include panel;
  display: flex;
  flex-direction: column;
  gap: space(5);
  width: 100%;
  max-width: 24rem;
  padding: space(6);
  box-shadow: $shadow-card;

  @include up('sm') {
    padding: space(7);
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: space(1.5);
    text-align: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: space(2);
    border-radius: $radius-lg;
    background: color('crimson');
    font-family: $font-heading;
    font-size: font-size('sm');
    font-weight: 900;
  }

  &__title {
    font-size: font-size('lg');
    font-weight: 900;
  }

  &__subtitle {
    font-size: font-size('xs');
    color: color('text-secondary');
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: space(3.5);
  }

  &__footer {
    padding-top: space(3);
    border-top: 1px solid color('border');
    font-size: font-size('xs');
    color: color('text-secondary');
    text-align: center;
  }

  &__link {
    @include focus-ring;
    padding: 0;
    border: 0;
    background: none;
    font-size: font-size('xs');
    font-weight: 600;
    color: color('crimson-hover');

    &:hover {
      text-decoration: underline;
    }

    &--end {
      align-self: flex-end;
      margin-top: space(-1.5);
      font-weight: 400;
      color: color('text-secondary');
    }
  }
}
</style>
