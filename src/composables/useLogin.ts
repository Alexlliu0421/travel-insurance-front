// 登入表單邏輯：管理表單狀態、呼叫登入 API、處理成功/失敗
// LoginModal.vue 只負責呼叫這裡的方法，不直接寫 API 邏輯

import { ref } from 'vue'
import { login } from '../services/auth'
import { useAuthStore } from '../stores/authStore'

export function useLogin() {
  const idNumber = ref('')
  const password = ref('')
  const errorMsg = ref('')

  // loading：是否正在等待 API 回應中（true=載入中）
  // 用途：按鈕綁定這個狀態，登入過程中顯示轉圈圈動畫並禁用按鈕，
  //      避免使用者連點多次重複送出請求
  const loading = ref(false)

  const authStore = useAuthStore()

  async function submitLogin() {
    loading.value = true
    errorMsg.value = ''
    try {
      // await：暫停往下執行，直到 login(...) 真正拿到後端回應為止
      // （login 回傳的是 Promise，代表非同步、需要等待的操作）
      const res = await login({ idNumber: idNumber.value, password: password.value })
      authStore.setAuth(res.data.data) // 存 token、name、role、userId 進 Pinia
      return true
    } catch (e: any) {
      // e: any → TypeScript 型別標註，代表這個錯誤物件的型別不限制
      // catch 抓到的錯誤理論上可能是任意型別，這裡用 any 跳過嚴格檢查，
      // 方便直接存取 e.response.data.message（axios 錯誤的慣用格式）
      errorMsg.value = e.response?.data?.message || '登入失敗，請確認帳號密碼'
      return false
    } finally {
      // finally：不管成功或失敗都會執行，確保 loading 一定會設回 false
      loading.value = false
    }
  }

  return { idNumber, password, errorMsg, loading, submitLogin }
}