import type { RouteRecordRaw } from 'vue-router'

const clientRoutes: RouteRecordRaw = {
  path: '/client',
  children: [
    {
      path: '',
      name: 'client-home',
      component: () => import('@/views/ClientHome.vue')
    },
    {
      path: 'policy',
      name: 'policy',
      component: () => import('@/views/PolicyPage.vue')
    },
    {
      path: 'plans',
      name: 'plans',
      component: () => import('@/views/PlansPage.vue')
    },
    {
      path: 'profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue')
    }
  ]
}

export default clientRoutes