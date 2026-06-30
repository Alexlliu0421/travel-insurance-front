import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { Notify } from 'quasar'

const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})

// 每個請求自動帶上 token（如果有登入）
http.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 統一處理常見的錯誤狀態碼，避免每個元件都要自己寫 catch 判斷
// 正常操作下，403 幾乎不會發生（因為 router 路由守衛會先擋掉），
// 這層是給「繞過前端直接打 API」或「前端邏輯漏洞」這種異常情況的最後一道提示
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 403) {
      Notify.create({
        type: 'negative',
        message: '權限不足，無法執行此操作',
        position: 'top',
      })
    }

    if (status === 401) {
      Notify.create({
        type: 'warning',
        message: '登入已過期，請重新登入',
        position: 'top',
      })
      // Token失效時，順手清掉本機登入狀態，避免使用者帶著壞掉的token繼續操作
      localStorage.removeItem('token')
    }

    // 繼續往外拋，讓原本呼叫API的地方還是可以自己用catch做後續處理（例如停止loading動畫）
    return Promise.reject(error)
  }
)

export default http