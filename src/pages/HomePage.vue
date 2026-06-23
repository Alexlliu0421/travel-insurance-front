<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import LoginModal from '../components/LoginModal.vue'
import ForgotPasswordModal from '../components/ForgotPasswordModal.vue'
import HeroBanner from '../components/HeroBanner.vue'
import ProductIntro from '../components/ProductIntro.vue'
import QuoteForm from '../components/QuoteForm.vue'
import FaqSection from '../components/FaqSection.vue'

const router = useRouter()
const route = useRoute()
const showLoginModal = ref(false)
const showForgotPasswordModal = ref(false)

function handleOpenLogin() {
  showLoginModal.value = true
}

function handleOpenForgotPassword() {
  showForgotPasswordModal.value = true
}

// 監聽路由變化，如果路由包含 'forgot-password' query 參數，則打開忘記密碼 Modal
watch(() => route.query.action, (action) => {
  if (action === 'forgot-password') {
    showForgotPasswordModal.value = true
    // 清掉 query 避免重整時再次觸發
    router.replace({ path: '/', query: {} })
  }
})
</script>

<template>
  <div>
    <NavBar @open-login="handleOpenLogin" @open-forgot-password="handleOpenForgotPassword" />
    <LoginModal v-model="showLoginModal" />
    <ForgotPasswordModal v-model="showForgotPasswordModal" />
    <HeroBanner />
    <ProductIntro />
    <QuoteForm />
    <FaqSection />
  </div>
</template>