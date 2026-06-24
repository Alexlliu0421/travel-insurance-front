// Request
export interface QuoteRequest {
  departureDate: string
  returnDate: string
  insuredBirthDate: string
  insuredGender: 0 | 1
  insuredOccupationCode: string
  coverageId: number
}

export interface ApplyRequest {
  insuredName: string
  insuredIdNumber: string
  insuredBirthDate: string
  insuredGender: 0 | 1
  insuredOccupationCode: string
  departureDate: string
  returnDate: string
  coverageId: number
}

// Response
export interface QuoteResult {
  coverageId: number
  coverageAmount: number
  insuredDays: number
  basePremium: number
  finalPremium: number
}

export interface PolicyDetail {
  policyId: number
  policyNumber: string
  insuredName: string
  insuredIdNumber: string
  insuredBirthDate: string
  insuredGender: 0 | 1
  insuredOccupationCode: string
  occupationName: string
  departureDate: string
  returnDate: string
  insuredDays: number
  coverageAmount: number
  basePremium: number
  finalPremium: number
  status: PolicyStatus
  lastReviewDate: string | null
  createdAt: string
  updatedAt: string
}

export type PolicyStatus = 'Draft' | 'Signing' | 'Finish' | 'Rejected' | 'Void'