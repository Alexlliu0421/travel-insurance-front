<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import LoginModal from '../components/LoginModal.vue'

const showLoginModal = ref(false)

function handleOpenLogin() {
  showLoginModal.value = true
}
</script>

<template>
  <div>
    <NavBar @open-login="handleOpenLogin" />
    <LoginModal v-model="showLoginModal" />
    <h1>首頁（建置中）</h1>
  </div>
</template>