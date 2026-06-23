<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useScrollTo } from '../composables/useScrollTo'

const router = useRouter()
const authStore = useAuthStore()
const { scrollToSection } = useScrollTo()

// --- 權限與狀態計算 ---
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userRole = computed(() => authStore.role || '')

// 判斷是否為內部員工（業務員或主管）
const isStaff = computed(() => ['SALESMAN', 'MANAGER'].includes(userRole.value))

// --- 事件處理 ---

// 點擊「我要投保」或「保單查詢」按鈕的邏輯
function handleApplyClick() {
    if (!isLoggedIn.value) {
        // 未登入則打開登入 Modal
        emit('open-login')
    } else if (isStaff.value) {
        // 業務員/主管導向歷程查詢頁
        router.push('/approval/history')
    } else {
        // 一般使用者導向投保頁 (請替換為實際路由)
        router.push('/insurance/apply')
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

// 已登入使用者想改密碼：直接走「忘記密碼」流程
// 不登出，讓使用者保持登入狀態去完成這個流程
function handleChangePassword() {
    emit('open-forgot-password')
}

</script>

<template>
    <q-toolbar class="bg-white text-dark" style="border-bottom: 1px solid #e0e0e0;">
        <q-toolbar-title class="cursor-pointer row items-center" @click="router.push('/')">
            <q-icon name="park" size="28px" class="q-mr-sm" color="green" />
            大樹人壽
        </q-toolbar-title>

        <q-btn flat label="商品特色" @click="scrollToSection('product-intro')" />
        <q-btn flat label="一鍵速算" @click="scrollToSection('quote-section')" />
        <q-btn flat label="常見問題" @click="scrollToSection('faq-section')" />
        
        <q-btn 
            flat 
            :label="isStaff ? '保單歷程查詢' : '我要投保'" 
            @click="handleApplyClick" 
        />

        <q-btn v-if="!isLoggedIn" flat icon="person" label="登入" @click="emit('open-login')" />

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