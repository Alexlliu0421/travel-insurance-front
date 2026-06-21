<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

// App 啟動時，從 localStorage 還原登入狀態（重新整理頁面後不會被登出）
onMounted(() => {
  authStore.loadFromStorage()
})
</script>

<template>
  <router-view />
</template>