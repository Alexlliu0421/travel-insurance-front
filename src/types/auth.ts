export interface LoginReqDTO {
  idNumber: string
  password: string
}

export interface LoginRespDTO {
  userId: number
  name: string
  role: 'USER' | 'SALESMAN' | 'MANAGER'
  token: string
}

export interface RegisterReqDTO {
  name: string
  idNumber: string
  email: string
  phone: string
  address: string
  password: string
  birthDate: string      // 'YYYY-MM-DD'
  nationality: string
  gender: 'MALE' | 'FEMALE'
  occupationName: string // 'TOURIST' | 'OFFICE' | 'STUDENT' | 'SERVICE' | 'LABOR' | 'CREW' | 'HIGHRISK'
}

// 統一的 API 回應格式（對應後端 ApiResponse<T>）
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}