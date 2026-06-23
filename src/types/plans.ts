import type { PolicyStatus } from './policy'

export interface PlanSummary {
  policyId: number
  policyNumber: string
  insuredName: string
  departureDate: string
  returnDate: string
  insuredDays: number
  coverageAmount: number
  finalPremium: number
  status: PolicyStatus
  createdAt: string
}

export interface CancelRequest {
  policyId: number
  reason?: string
}