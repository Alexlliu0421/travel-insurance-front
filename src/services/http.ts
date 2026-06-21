import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

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

export default http