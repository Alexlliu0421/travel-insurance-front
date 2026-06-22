// 重設密碼表單邏輯：從網址取出 token，管理新密碼輸入、呼叫 API
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '../services/auth'

export function useResetPassword() {
  const route = useRoute()
  const router = useRouter()

  // 從網址 query string 取出 token（信件連結格式：/reset-password?token=xxx）
  const token = route.query.token as string

  const newPassword = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const errorMsg = ref('')
  const success = ref(false)

  async function submitResetPassword() {
    errorMsg.value = ''

    // 先檢查網址裡有沒有 token（沒有 token 代表使用者亂打網址進來，不是從信件連結點過來的）
    if (!token) {
      errorMsg.value = '連結無效，請重新申請忘記密碼'
      return false
    }

    // 前端先檢查兩次密碼輸入是否一致，不用浪費一次 API 呼叫
    if (newPassword.value !== confirmPassword.value) {
      errorMsg.value = '兩次輸入的密碼不一致'
      return false
    }

    loading.value = true
    try {
      await resetPassword({ token, newPassword: newPassword.value })
      success.value = true
      // 重設成功，等 2 秒後自動導回首頁，讓使用者重新登入
      setTimeout(() => router.push('/'), 2000)
      return true
    } catch (e: any) {
      errorMsg.value = e.response?.data?.message || '重設失敗，連結可能已過期'
      return false
    } finally {
      loading.value = false
    }
  }

  return { newPassword, confirmPassword, loading, errorMsg, success, submitResetPassword }
}