import { createRouter, createWebHistory } from 'vue-router';
import approvalRoutes from './modules/approval'; 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/approval/worklist' },
    approvalRoutes, 
  ]
});

export default router;