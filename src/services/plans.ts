import http from './http'
import type { ApiResponse } from '../types/common'
import type { PlanSummary, CancelRequest } from '../types/plans'
import type { PolicyDetail } from '../types/policy'

export function fetchPlans() {
  return http.get<ApiResponse<PlanSummary[]>>('/client/plans')
}

export function cancelPlan(data: CancelRequest) {
  return http.post<ApiResponse<null>>('/client/plans/cancel', data)
}

export function downloadPlan(policyId: number) {
  return http.get('/client/plans/download', {
    params: { policyId },
    responseType: 'blob'
  })
}

export function fetchPlanDetail(policyId: number) {
  return http.get<ApiResponse<PolicyDetail>>(`/client/plans/${policyId}`)
}