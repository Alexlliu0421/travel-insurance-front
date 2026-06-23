<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useScrollTo } from '../composables/useScrollTo'
import ForgotPasswordModal from './ForgotPasswordModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { scrollToSection } = useScrollTo()

// --- 權限與狀態計算 ---
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userRole = computed(() => authStore.role || '')

// 判斷是否為內部員工（業務員或主管）
const isStaff = computed(() => ['SALESMAN', 'MANAGER'].includes(userRole.value))

// 確認目前是否再根目錄
const isHomePage = computed(() => route.path === '/')

// 忘記密碼 Modal 狀態直接放在 NavBar
const showForgotPasswordModal = ref(false)

// --- 事件處理 ---

// scrollToSection 只在根首頁有效
// 不在根首頁時先導回去，等頁面載入後再滾動
async function handleScrollTo(sectionId: string) {
  if (isHomePage.value) {
    scrollToSection(sectionId)
  } else {
    await router.push('/')
    // 等 DOM 渲染完再滾動
    setTimeout(() => scrollToSection(sectionId), 300)
  }
}

// 點擊「我要投保」或「保單查詢」按鈕的邏輯
function handleApplyClick() {
    if (!isLoggedIn.value) {
        // 未登入則打開登入 Modal
        emit('open-login')
    } else if (isStaff.value) {
        // 業務員/主管導向歷程查詢頁
        router.push('/approval/history')
    } else {
        // 一般使用者導向前台投保頁
        router.push('/client')
    }
}

// 登出：清空 Pinia 跟 localStorage 的登入狀態，導回首頁
function handleLogout() {
    authStore.logout()
    router.push('/')
}

// 定義向外傳遞的事件
const emit = defineEmits<{
    (e: 'open-login'): void
    (e: 'open-forgot-password'): void
}>()

// 修改密碼：emit 給父層
// 不在根首頁時先導回去，等頁面載入後 emit
// 但 emit 跨頁面無法傳遞，所以改用 query 參數通知根首頁開啟 modal
function handleChangePassword() {
  showForgotPasswordModal.value = true
}
</script>

<template>
    <q-toolbar class="bg-white text-dark" style="border-bottom: 1px solid #e0e0e0;">
        <q-toolbar-title class="cursor-pointer row items-center" @click="router.push('/')">
            <q-icon size="22px" class="q-mr-sm">
                <img src="/airplane.png" />
            </q-icon>
            <span class="text-weight-bold" style="font-size: 19px; color: #374151; letter-spacing: 0.5px;">緯致旅平險</span>
        </q-toolbar-title>

        <q-btn flat label="商品特色" @click="handleScrollTo('product-intro')" />
        <q-btn flat label="一鍵速算" @click="handleScrollTo('quote-section')" />
        <q-btn flat label="常見問題" @click="handleScrollTo('faq-section')" />

        <q-btn flat :label="isStaff ? '保單歷程查詢' : '我要投保'" @click="handleApplyClick" />

        <q-btn v-if="!isLoggedIn" flat icon="person" label="登入" @click="emit('open-login')" />

        <template v-else>
            <q-btn-dropdown flat>
                <template #label>
                    <q-avatar size="28px" color="green" text-color="white" icon="person" class="q-mr-sm" />
                    {{ authStore.name }}
                </template>
                <q-list>
                    <q-item clickable v-close-popup @click="router.push('/client/profile')">
                        <q-item-section>個人資料</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="router.push('/client/plans')">
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

    <!-- 忘記密碼 Modal -->
  <ForgotPasswordModal v-model="showForgotPasswordModal" />
</template>