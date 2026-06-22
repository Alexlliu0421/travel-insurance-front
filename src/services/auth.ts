// 負責登入、註冊、登出的 API 呼叫
// 純粹打 API，不含任何畫面邏輯或狀態管理

import http from './http'
import type { ApiResponse, LoginReqDTO, LoginRespDTO, RegisterReqDTO } from '../types/auth'

export function login(data: LoginReqDTO) {
  return http.post<ApiResponse<LoginRespDTO>>('/api/auth/login', data)
}

export function register(data: RegisterReqDTO) {
  return http.post<ApiResponse<null>>('/api/auth/register', data)
}

export function logout() {
  return http.post<ApiResponse<null>>('/api/auth/logout')
}
// 忘記密碼：輸入 email，後端寄送重設密碼信
// 不管 email 是否存在，後端都回應成功（安全性考量，避免帳號枚舉）
export function forgotPassword(data: { email: string }) {
  return http.post<ApiResponse<null>>('/api/auth/forgot-password', data)
}

// 重設密碼：帶 token + 新密碼，更新使用者密碼
export function resetPassword(data: { token: string; newPassword: string }) {
  return http.post<ApiResponse<null>>('/api/auth/reset-password', data)
}