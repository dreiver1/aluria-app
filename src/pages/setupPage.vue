<template>
  <q-page class="setup-page flex flex-center q-pa-md">
    <main class="setup-shell">
      <section class="brand-panel">
        <div class="brand-mark">alúria<span>.</span></div>
        <div>
          <p class="eyebrow">PRIMEIRA INSTALAÇÃO</p>
          <h1>Prepare a rotina da sua escola.</h1>
          <p class="brand-description">Crie a conta responsável pelo painel Alúria e comece com uma instalação segura.</p>
        </div>
        <div class="brand-detail" aria-hidden="true"><span></span><span></span><span></span></div>
      </section>

      <section class="form-panel" aria-labelledby="setup-title">
        <div class="form-heading">
          <p class="eyebrow">CONFIGURAÇÃO INICIAL</p>
          <h2 id="setup-title">Criar administrador</h2>
          <p>Use o código disponibilizado no servidor para ativar esta instalação.</p>
        </div>

        <q-form class="setup-form" @submit.prevent="handleSetup">
          <q-banner v-if="message" :class="messageType === 'error' ? 'setup-error' : 'setup-success'" rounded role="alert">
            <template v-slot:avatar><q-icon :name="messageType === 'error' ? 'error_outline' : 'check_circle'" /></template>
            {{ message }}
          </q-banner>

          <q-input v-model.trim="form.code" label="Código de instalação" outlined autocomplete="one-time-code" :disable="isSubmitting" :rules="[requiredRule]" lazy-rules />
          <q-input v-model.trim="form.nome" label="Nome completo" outlined autocomplete="name" :disable="isSubmitting" :rules="[requiredRule]" lazy-rules />
          <q-input v-model.trim="form.email" label="E-mail" type="email" outlined autocomplete="email" :disable="isSubmitting" :rules="[emailRule]" lazy-rules />
          <q-input v-model="form.senha" label="Senha" :type="isPwd ? 'password' : 'text'" outlined autocomplete="new-password" :disable="isSubmitting" :rules="[passwordRule]" lazy-rules>
            <template v-slot:append>
              <q-btn :icon="isPwd ? 'visibility_off' : 'visibility'" aria-label="Mostrar ou ocultar senha" flat round dense type="button" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-input v-model="form.confirmacao" label="Confirmar senha" type="password" outlined autocomplete="new-password" :disable="isSubmitting" :rules="[confirmationRule]" lazy-rules />

          <q-btn class="setup-submit full-width" label="Configurar instalação" unelevated no-caps type="submit" :loading="isSubmitting" :disable="isSubmitting" />
        </q-form>
      </section>
    </main>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'SetupPage',
  setup () {
    const router = useRouter()
    const form = ref({ code: '', nome: '', email: '', senha: '', confirmacao: '' })
    const isPwd = ref(true)
    const isSubmitting = ref(false)
    const message = ref('')
    const messageType = ref('error')

    const requiredRule = value => Boolean(value) || 'Este campo é obrigatório.'
    const emailRule = value => {
      if (!value) return 'Informe seu e-mail.'
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Informe um e-mail válido.'
    }
    const passwordRule = value => (value && value.length >= 8) || 'Use pelo menos 8 caracteres.'
    const confirmationRule = value => value === form.value.senha || 'As senhas não coincidem.'

    const handleSetup = async () => {
      if (isSubmitting.value) return
      message.value = ''
      if (form.value.senha !== form.value.confirmacao) {
        message.value = 'As senhas não coincidem.'
        return
      }

      isSubmitting.value = true
      try {
        await api.post('/setup/bootstrap', {
          code: form.value.code,
          nome: form.value.nome,
          email: form.value.email,
          senha: form.value.senha
        })
        messageType.value = 'success'
        message.value = 'Instalação configurada. Você será direcionado ao login.'
        window.setTimeout(() => router.push({ name: 'loginPage' }), 700)
      } catch (error) {
        messageType.value = 'error'
        message.value = error.response?.data?.message || 'Não foi possível configurar a instalação.'
      } finally {
        isSubmitting.value = false
      }
    }

    return { confirmationRule, emailRule, form, handleSetup, isPwd, isSubmitting, message, messageType, passwordRule, requiredRule }
  }
})
</script>

<style scoped>
.setup-page { min-height: 100vh; color: #121614; }
.setup-shell { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(360px, .95fr); width: min(1040px, 100%); min-height: 680px; overflow: hidden; border-radius: 34px; background: #fff; box-shadow: 0 20px 60px rgba(30, 45, 35, .12); }
.brand-panel { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(32px, 6vw, 72px); background: #121614; color: #fff; }
.brand-mark { font-size: 2rem; font-weight: 800; letter-spacing: -.08em; }.brand-mark span { color: #9dff6e; }
.eyebrow { margin: 0 0 18px; color: #376344; font-size: .78rem; font-weight: 700; letter-spacing: .16em; }.brand-panel .eyebrow { color: #9dff6e; }
h1, h2 { margin: 0; font-weight: 750; letter-spacing: -.06em; line-height: .98; } h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); } h2 { font-size: clamp(2.2rem, 4vw, 3.4rem); }
.brand-description { max-width: 330px; margin: 24px 0 0; color: #c3cdc5; font-size: 1.1rem; line-height: 1.5; }.brand-detail { display: flex; gap: 10px; }.brand-detail span { display: block; width: 44px; height: 10px; border-radius: 999px; background: #9dff6e; }.brand-detail span:nth-child(2) { width: 24px; opacity: .7; }.brand-detail span:nth-child(3) { width: 10px; opacity: .45; }
.form-panel { display: flex; flex-direction: column; justify-content: center; padding: clamp(32px, 6vw, 72px); }.form-heading > p:last-child { margin: 18px 0 0; color: #657068; font-size: 1rem; }.setup-form { margin-top: 30px; }.setup-form :deep(.q-field__control) { min-height: 54px; margin-bottom: 4px; border-radius: 14px; }.setup-error { margin-bottom: 16px; background: #fff0ed; color: #9a3d32; }.setup-success { margin-bottom: 16px; background: #edf9e8; color: #376344; }.setup-submit { min-height: 56px; margin-top: 12px; border-radius: 16px; background: #9dff6e; color: #121614; font-weight: 700; }
@media (max-width: 720px) { .setup-page { align-items: flex-start; padding: 0; }.setup-shell { grid-template-columns: 1fr; min-height: 100vh; border-radius: 0; }.brand-panel { min-height: 300px; padding: 32px 26px 38px; }.brand-panel h1 { font-size: 2.8rem; }.form-panel { justify-content: flex-start; padding: 42px 26px 48px; } }
</style>
