// 忘記密碼表單邏輯：管理 email 輸入、呼叫 API、處理成功狀態
import { ref } from 'vue'
import { forgotPassword } from '../services/auth'

export function useForgotPassword() {
  const email = ref('')
  const loading = ref(false)
  const errorMsg = ref('')
  const submitted = ref(false) // 是否已送出（用來切換畫面顯示「請去信箱收信」的提示）

  async function submitForgotPassword() {
    loading.value = true
    errorMsg.value = ''
    try {
      await forgotPassword({ email: email.value })
      submitted.value = true // 不管後端實際有沒有寄信，前端都顯示「已送出」
      return true
    } catch (e: any) {
      errorMsg.value = e.response?.data?.message || '發送失敗，請稍後再試'
      return false
    } finally {
      loading.value = false
    }
  }

  return { email, loading, errorMsg, submitted, submitForgotPassword }
}