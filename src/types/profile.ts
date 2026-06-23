export interface Profile {
  id: number
  name: string
  idNumber: string
  email: string
  phone: string | null
  address: string | null
  gender: string | null
  birthDate: string | null
  nationality: string | null
  occupationName: string | null
  status: string
  createdDate: string
  updatedDate: string
}

export interface ProfileUpdateRequest {
  name: string
  phone: string
  address: string
  nationality: string
  occupationName: string
}