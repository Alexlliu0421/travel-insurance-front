import http from './http'
import type { ApiResponse } from '../types/common'
import type { QuoteRequest, QuoteResult, ApplyRequest, PolicyDetail } from '../types/policy'

export function calculateQuote(data: QuoteRequest) {
  return http.post<ApiResponse<QuoteResult>>('/client/policy/quote', data)
}

export function applyPolicy(data: ApplyRequest) {
  return http.post<ApiResponse<PolicyDetail>>('/client/policy/apply', data)
}