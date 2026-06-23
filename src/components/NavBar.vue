<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useScrollTo } from '../composables/useScrollTo'

const router = useRouter()
const authStore = useAuthStore()
const { scrollToSection } = useScrollTo()

// 是否已登入，決定 Navbar 右側顯示「登入/註冊」還是「使用者選單」
const isLoggedIn = computed(() => authStore.isLoggedIn)

// 點擊「我要投保」：
// - 已登入 → 之後導向 Bolin 的投保頁面（路由尚未建立，先留 TODO）
// - 未登入 → 發出事件，讓父層打開登入 Modal
function handleApplyClick() {
    if (isLoggedIn.value) {
        // 等 投保頁面路由確定後補上
    } else {
        emit('open-login')
    }
}

// 登出：清空 Pinia 跟 localStorage 的登入狀態，導回首頁
function handleLogout() {
    authStore.logout()
    router.push('/')
}

// NavBar 本身不負責顯示登入 Modal，只發出事件，
// 由外層（App.vue 或 HomePage.vue）決定何時顯示 Modal
const emit = defineEmits<{
    (e: 'open-login'): void
    (e: 'open-forgot-password'): void
}>()
// 已登入使用者想改密碼：直接走「忘記密碼」流程
// 因為改密碼跟忘記密碼本質上是同一件事（都是想換新密碼，透過 Email 驗證身份再設定新密碼）
// 已登入使用者想改密碼：直接走「忘記密碼」流程
// 不登出，讓使用者保持登入狀態去完成這個流程
function handleChangePassword() {
    emit('open-forgot-password')
}

</script>

<template>
    <q-toolbar class="bg-white text-dark" style="border-bottom: 1px solid #e0e0e0;">
        <!-- Logo / 網站名稱，點擊回首頁 -->
        <q-toolbar-title class="cursor-pointer row items-center" @click="router.push('/')">
            <q-icon name="park" size="28px" class="q-mr-sm" color="green" />
            大樹人壽
        </q-toolbar-title>

        <!-- 錨點導航：只在首頁有效，滾動到對應區塊 -->
        <q-btn flat label="商品特色" @click="scrollToSection('product-intro')" />
        <q-btn flat label="一鍵速算" @click="scrollToSection('quote-section')" />
        <q-btn flat label="常見問題" @click="scrollToSection('faq-section')" />
        <q-btn flat label="我要投保" @click="handleApplyClick" />

        <!-- 未登入：只有一個登入按鈕（圖示 + 文字） -->
        <q-btn v-if="!isLoggedIn" flat icon="person" label="登入" @click="emit('open-login')" />

        <!-- 已登入：顯示使用者下拉選單 -->
        <template v-else>
            <q-btn-dropdown flat>
                <template #label>
                    <q-avatar size="28px" color="green" text-color="white" icon="person" class="q-mr-sm" />
                    {{ authStore.name }}
                </template>
                <q-list>
                    <q-item clickable v-close-popup @click="router.push('/profile')">
                        <q-item-section>個人資料</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="router.push('/plans')">
                        <q-item-section>我的保單</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="handleChangePassword">
                        <q-item-section>修改密碼</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="handleLogout">
                        <q-item-section>登出</q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </template>
    </q-toolbar>
</template>