// 對應後端 QuoteRequestDto / QuoteResponseDto（保費試算 API：POST /client/policy/quote）
// 此檔案不含任何邏輯，純粹定義打 API 時請求與回應的資料格式
export interface QuoteRequestDto {
    departureDate: string       // 'YYYY-MM-DD'
    returnDate: string
    insuredBirthDate: string
    insuredGender: 0 | 1         // 0:女 1:男
    insuredOccupationCode: string
    coverageId: number
}

export interface QuoteResponseDto {
    coverageId: number
    coverageAmount: number
    insuredDays: number
    basePremium: number
    finalPremium: number
}