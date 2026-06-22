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

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/register', '/reset-password']
  const hasToken = !!localStorage.getItem('token')

  if (!publicPages.includes(to.path) && !hasToken) {
    Notify.create({
      type: 'warning',
      message: '請先登入才能使用此功能',
      position: 'top',
    })
    next('/')
  } else {
    next()
  }
})

export default router