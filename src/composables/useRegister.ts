// 註冊流程的共用狀態管理
// 管理 3 個步驟的所有表單欄位，直到 Step3 完成才真正打 API
// TermsStep.vue、BasicInfoStep.vue、PasswordStep.vue 都會用到這裡的狀態

import { ref , computed } from 'vue'
import { register } from '../services/auth'
import type { RegisterReqDTO } from '../types/auth'

export function useRegister() {
    // 目前在第幾步（1~3）
    const step = ref(1)

    // Step1：條款是否已閱讀完成（全部勾選）
    const termsAgreed = ref(false)

    // Step2：基本資料
    const name = ref('')
    const idNumber = ref('')
    const birthDate = ref('')
    const gender = ref<'MALE' | 'FEMALE' | ''>('')
    const occupationName = ref('')
    const email = ref('')
    const phone = ref('')
    const address = ref('')
    const nationality = ref('台灣')

    // Step3：密碼
    const password = ref('')
    const confirmPassword = ref('')

    const errorMsg = ref('')
    const loading = ref(false)

    // 密碼是否符合強度規則（跟 PasswordStep.vue 的檢查清單邏輯一致）
    const isPasswordValid = computed(() =>
        password.value.length >= 8 && // 最少 8 個字
        /[a-zA-Z]/.test(password.value) &&  // 有字母
        /\d/.test(password.value)   //正規表達式檢查字串裡有沒有任何一個數字
    )

    // 密碼跟確認密碼是否一致
    const isPasswordMatching = computed(() =>
        password.value === confirmPassword.value && confirmPassword.value.length > 0
    )


    function nextStep() {
        if (step.value < 3) step.value++
    }

    function prevStep() {
        if (step.value > 1) step.value--
    }

    // Step3 按下「完成註冊」時呼叫，把 3 步驟收集的資料一次打包送出
    async function submitRegister() {
        loading.value = true
        errorMsg.value = ''
        try {
            const data: RegisterReqDTO = {
                name: name.value,
                idNumber: idNumber.value,
                email: email.value,
                phone: phone.value,
                address: address.value,
                password: password.value,
                birthDate: birthDate.value,
                nationality: nationality.value,
                gender: gender.value as 'MALE' | 'FEMALE',
                occupationName: occupationName.value,
            }
            await register(data)
            return true
        } catch (e: any) {
            errorMsg.value = e.response?.data?.message || '註冊失敗，請稍後再試'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        step, nextStep, prevStep,
        termsAgreed,
        name, idNumber, birthDate, gender, occupationName, email, phone, address, nationality,
        password, confirmPassword,
        errorMsg, loading,
        submitRegister,isPasswordValid, isPasswordMatching
    }
}