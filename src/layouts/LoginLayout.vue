<template>
  <q-layout class="auth-layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LoginLayout'
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: #f5f7f1;
}
</style>
