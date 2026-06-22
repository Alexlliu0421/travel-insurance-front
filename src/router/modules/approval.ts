import { type RouteRecordRaw } from 'vue-router';

const approvalRoutes: RouteRecordRaw = {
  path: '/approval',
  children: [
    {
      path: 'worklist',
      name: 'worklist',
      component: () => import("@/views/worklist.vue") // 使用 lazy loading 效能更好
    },
    {
      path: 'form/:policyId', // 動態路由，接收保單 ID
      name: 'ApprovalForm',
      component: () => import('@/views/approvalForm.vue')
    },
    {
      path: 'history',
      name: 'HistoryQuery',
      component: () => import('@/views/HistoryQuery.vue') 
    },
  ]
};

export default approvalRoutes;