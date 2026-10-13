<template>
  <q-page class="login-page flex flex-center q-pa-md">
    <main class="login-shell">
      <section class="brand-panel">
        <div class="brand-mark" aria-label="Alúria">alúria<span>.</span></div>
        <div class="brand-copy">
          <p class="eyebrow">GESTÃO ESCOLAR</p>
          <h1>Organize a rotina da sua escola.</h1>
          <p class="brand-description">Acompanhe alunos, turmas e resultados em um só lugar.</p>
        </div>
        <div class="brand-detail" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </section>

      <section class="form-panel" aria-labelledby="login-title">
        <div class="form-heading">
          <p class="eyebrow">BEM-VINDO DE VOLTA</p>
          <h2 id="login-title">Entrar na Alúria</h2>
          <p>Acesse o painel da sua instituição.</p>
        </div>

        <q-form class="login-form" @submit.prevent="handleLogin">
          <q-banner v-if="errorMessage" class="login-error" rounded role="alert">
            <template v-slot:avatar>
              <q-icon name="error_outline" />
            </template>
            {{ errorMessage }}
          </q-banner>

          <q-input
            v-model.trim="form.email"
            label="E-mail"
            type="email"
            autocomplete="username"
            outlined
            :disable="isSubmitting"
            :rules="[emailRule]"
            lazy-rules
          />

          <q-input
            v-model="form.senha"
            label="Senha"
            :type="isPwd ? 'password' : 'text'"
            autocomplete="current-password"
            outlined
            :disable="isSubmitting"
            :rules="[requiredRule]"
            lazy-rules
          >
            <template v-slot:append>
              <q-btn
                :icon="isPwd ? 'visibility_off' : 'visibility'"
                aria-label="Mostrar ou ocultar senha"
                flat
                round
                dense
                type="button"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-btn
            class="login-submit full-width"
            label="Entrar"
            unelevated
            no-caps
            type="submit"
            :loading="isSubmitting"
            :disable="isSubmitting"
          />
        </q-form>
      </section>
    </main>
  </q-page>
</template>

<script>
import useAuthAdmin from 'src/composables/useAuth'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

export default defineComponent({
  name: 'LoginForm',
  setup () {
    const router = useRouter()
    const { login, isLoggedIn } = useAuthAdmin()
    const form = ref({ email: '', senha: '' })
    const isPwd = ref(true)
    const isSubmitting = ref(false)
    const errorMessage = ref('')

    const requiredRule = value => Boolean(value) || 'Informe sua senha.'
    const emailRule = value => {
      if (!value) return 'Informe seu e-mail.'
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Informe um e-mail válido.'
    }

    onMounted(async () => {
      if (await isLoggedIn()) {
        router.push({ name: 'me' })
      }
    })

    const handleLogin = async () => {
      if (isSubmitting.value) return

      errorMessage.value = ''
      isSubmitting.value = true

      try {
        const token = await login(form.value)
        Cookies.set('_myAppToken', token)
        await router.push({ name: 'me' })
      } catch (error) {
        errorMessage.value = error.message || 'Não foi possível entrar. Tente novamente.'
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      emailRule,
      errorMessage,
      form,
      handleLogin,
      isPwd,
      isSubmitting,
      requiredRule
    }
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  color: #121614;
}

.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  width: min(1040px, 100%);
  min-height: 620px;
  overflow: hidden;
  border-radius: 34px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(30, 45, 35, 0.12);
}

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(32px, 6vw, 72px);
  background: #121614;
  color: #fff;
}

.brand-mark {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.08em;
}

.brand-mark span { color: #9dff6e; }

.eyebrow {
  margin: 0 0 18px;
  color: #376344;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.brand-panel .eyebrow { color: #9dff6e; }

.brand-copy h1,
.form-heading h2 {
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 750;
  letter-spacing: -0.06em;
  line-height: 0.98;
}

.brand-description {
  max-width: 330px;
  margin: 24px 0 0;
  color: #c3cdc5;
  font-size: 1.1rem;
  line-height: 1.5;
}

.brand-detail { display: flex; gap: 10px; }

.brand-detail span {
  display: block;
  width: 44px;
  height: 10px;
  border-radius: 999px;
  background: #9dff6e;
}

.brand-detail span:nth-child(2) { width: 24px; opacity: 0.7; }
.brand-detail span:nth-child(3) { width: 10px; opacity: 0.45; }

.form-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(32px, 6vw, 72px);
  background: #fff;
}

.form-heading h2 { font-size: clamp(2.2rem, 4vw, 3.4rem); }

.form-heading > p:last-child {
  margin: 18px 0 0;
  color: #657068;
  font-size: 1rem;
}

.login-form { margin-top: 42px; }

.login-form :deep(.q-field__control) {
  min-height: 58px;
  border-radius: 14px;
}

.login-form :deep(.q-field--outlined .q-field__control:before) { border-color: #dce3dc; }

.login-form :deep(.q-field--outlined.q-field--focused .q-field__control:after) {
  border-color: #376344;
}

.login-error {
  margin-bottom: 20px;
  background: #fff0ed;
  color: #9a3d32;
}

.login-submit {
  min-height: 58px;
  margin-top: 14px;
  border-radius: 16px;
  background: #9dff6e;
  color: #121614;
  font-size: 1rem;
  font-weight: 700;
}

@media (max-width: 720px) {
  .login-page { align-items: flex-start; padding: 0; }

  .login-shell {
    grid-template-columns: 1fr;
    min-height: 100vh;
    border-radius: 0;
  }

  .brand-panel {
    min-height: 330px;
    padding: 32px 26px 38px;
  }

  .brand-copy h1 { max-width: 420px; font-size: 2.8rem; }
  .brand-description { margin-top: 16px; font-size: 1rem; }
  .form-panel { justify-content: flex-start; padding: 42px 26px 48px; }
  .login-form { margin-top: 32px; }
}
</style>
