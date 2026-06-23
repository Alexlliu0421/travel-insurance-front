<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import LoginModal from '../components/LoginModal.vue'
import ForgotPasswordModal from '../components/ForgotPasswordModal.vue'
import HeroBanner from '../components/HeroBanner.vue'
import ProductIntro from '../components/ProductIntro.vue'
import QuoteForm from '../components/QuoteForm.vue'
import FaqSection from '../components/FaqSection.vue'

const showLoginModal = ref(false)
const showForgotPasswordModal = ref(false)

function handleOpenLogin() {
  showLoginModal.value = true
}

function handleOpenForgotPassword() {
  showForgotPasswordModal.value = true
}
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