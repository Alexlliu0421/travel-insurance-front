import { defineStore } from 'pinia'
import type { LoginRespDTO } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null as number | null,
    name: null as string | null,
    role: null as string | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setAuth(data: LoginRespDTO) {
      this.userId = data.userId
      this.name = data.name
      this.role = data.role
      this.token = data.token
      localStorage.setItem('token', data.token)
      localStorage.setItem('name', data.name)
      localStorage.setItem('role', data.role)
      localStorage.setItem('userId', String(data.userId))
    },
    loadFromStorage() {
      const token = localStorage.getItem('token')
      const name = localStorage.getItem('name')
      const role = localStorage.getItem('role')
      const userId = localStorage.getItem('userId')
      if (token) {
        this.token = token
        this.name = name
        this.role = role
        this.userId = userId ? Number(userId) : null
      }
    },
    logout() {
      this.userId = null
      this.name = null
      this.role = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
    },
  },
})