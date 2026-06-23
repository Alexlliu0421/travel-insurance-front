import http from './http'
import type { ApiResponse } from '../types/common'
import type { Profile, ProfileUpdateRequest } from '../types/profile'

export function fetchProfile() {
  return http.get<ApiResponse<Profile>>('/client/profile')
}

export function updateProfile(data: ProfileUpdateRequest) {
  return http.put<ApiResponse<Profile>>('/client/profile', data)
}