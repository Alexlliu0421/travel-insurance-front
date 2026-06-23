import { ref } from 'vue'
import { fetchProfile, updateProfile } from '../services/profile'
import type { Profile, ProfileUpdateRequest } from '../types/profile'

export function useProfile() {
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getProfile() {
    loading.value = true
    error.value = null
    try {
      const res = await fetchProfile()
      profile.value = res.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '查詢個人資料失敗'
    } finally {
      loading.value = false
    }
  }

  async function update(payload: ProfileUpdateRequest) {
    loading.value = true
    error.value = null
    try {
      const res = await updateProfile(payload)
      profile.value = res.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '更新失敗'
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, error, getProfile, update }
}