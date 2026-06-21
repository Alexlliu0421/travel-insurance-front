<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin } from '../composables/useLogin'
import { useCaptcha } from '../composables/useCaptcha'

// 用 v-model 控制 Modal 開關，由父層（HomePage.vue）決定何時顯示
const visible = defineModel<boolean>()

const router = useRouter()
const { idNumber, password, errorMsg, loading, submitLogin } = useLogin()
const { canvasRef, refresh, verify } = useCaptcha()
watch(visible, async (val) => {
    if (val) {
        await nextTick() // 等畫面真正渲染完成，Canvas 元素才存在
        refresh()
    }
})


const captchaInput = ref('')
const showPassword = ref(false)

async function onSubmit() {
    // 先檢查假驗證碼，錯了就不打 API，直接重新產生一組
    if (!verify(captchaInput.value)) {
        errorMsg.value = '驗證碼錯誤，請重新輸入'
        captchaInput.value = ''
        refresh()
        return
    }

    const success = await submitLogin()
    if (success) {
        visible.value = false // 登入成功，關閉 Modal
    } else {
        captchaInput.value = ''
        refresh() // 登入失敗也換一組新的驗證碼，避免一直用同一組猜
    }
}

// 點擊「馬上註冊」：關閉登入 Modal，導向獨立的註冊頁
function goToRegister() {
    visible.value = false
    router.push('/register')
}
</script>

<template>
    <q-dialog v-model="visible">
        <q-card style="width: 360px">
            <q-card-section class="row items-center justify-between">
                <div class="text-h6">歡迎登入</div>
                <q-btn flat round dense icon="close" v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="text-caption text-grey-7 q-mb-md">
                    還沒有帳戶嗎？
                    <a class="text-primary cursor-pointer" @click="goToRegister">馬上註冊</a>
                </div>

                <q-input v-model="idNumber" label="身分證字號" outlined class="q-mb-sm" />

                <q-input v-model="password" label="密碼" :type="showPassword ? 'text' : 'password'" outlined
                    class="q-mb-sm">
                    <template #append>
                        <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                            @click="showPassword = !showPassword" />
                    </template>
                </q-input>

                <!-- 假驗證碼區塊 -->
                <div class="row items-center q-gutter-sm q-mb-sm">
                    <canvas ref="canvasRef" width="120" height="44" style="border-radius: 4px" />
                    <q-btn flat round dense icon="refresh" @click="refresh" />
                </div>
                <q-input v-model="captchaInput" label="請輸入驗證碼" outlined class="q-mb-md" />

                <div v-if="errorMsg" class="text-negative text-caption q-mb-sm">{{ errorMsg }}</div>

                <q-btn color="primary" label="登入" class="full-width" :loading="loading" @click="onSubmit" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>