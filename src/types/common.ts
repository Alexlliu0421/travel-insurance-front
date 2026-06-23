// 對應後端 ApiResponse<T>
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}