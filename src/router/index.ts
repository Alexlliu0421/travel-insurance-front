import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import approvalRoutes from './modules/approval'
import ResetPasswordPage from '../pages/ResetPasswordPage.vue'
import { Notify } from 'quasar'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/register', name: 'register', component: RegisterPage },
    { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage },
    approvalRoutes,
  ],
})

router.beforeEach((to) => {
  const publicPages = ['/', '/register', '/reset-password']
  const hasToken = !!localStorage.getItem('token')

  if (!publicPages.includes(to.path) && !hasToken) {
    Notify.create({
      type: 'warning',
      message: '請先登入才能使用此功能',
      position: 'top',
    })
    return '/' // 新寫法：直接 return 要導向的路徑，取代呼叫 next('/')
  }
  // 沒有 return 任何東西，等同於放行，取代呼叫 next()
})

export default router