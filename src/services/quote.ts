// 負責保費試算的 API 呼叫（對應 Bolin 的 POST /client/policy/quote）
// 純粹打 API，不含任何畫面邏輯

import http from './http'
import type { ApiResponse } from '../types/auth'
import type { QuoteRequestDto, QuoteResponseDto } from '../types/quote'

export function getQuote(data: QuoteRequestDto) {
  return http.post<ApiResponse<QuoteResponseDto>>('/client/policy/quote', data)
}