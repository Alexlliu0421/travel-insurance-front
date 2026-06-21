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