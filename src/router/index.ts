import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import approvalRoutes from './modules/approval'
import ResetPasswordPage from '../pages/ResetPasswordPage.vue'
import { Notify } from 'quasar'
import { useAuthStore } from '../stores/authStore.ts' // 假設你的 store 在這裡
import clientRoutes from './modules/client'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/register', name: 'register', component: RegisterPage },
    { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage },
    approvalRoutes,
    clientRoutes
  ],
})

router.beforeEach((to) => {
  const publicPages = ['/', '/register', '/reset-password']
  const hasToken = !!localStorage.getItem('token')
  const authStore = useAuthStore() // 在 beforeEach 裡面呼叫才不會有初始化順序問題
  const role = authStore.role      // 直接從 store 取得
  
  if (!publicPages.includes(to.path) && !hasToken) {
    Notify.create({
      type: 'warning',
      message: '請先登入才能使用此功能',
      position: 'top',
    })
    return '/' // 新寫法：直接 return 要導向的路徑，取代呼叫 next('/')
  }
  if (to.path.startsWith('/approval')) {
    // 如果角色不是 SALESMAN 也不是 MANAGER，一律拒絕並導回首頁
    if (role !== 'SALESMAN' && role !== 'MANAGER') {
      console.error('權限不足，無法存取審核系統')
      return '/' 
    }
  }
  // 沒有 return 任何東西，等同於放行，取代呼叫 next()
})

export default router