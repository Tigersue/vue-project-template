import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { setupRouterGuard } from './guard'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: 'Login', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403View.vue'),
    meta: { title: 'Forbidden', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404View.vue'),
    meta: { title: 'Not Found', hidden: true },
  },
  { path: '/', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

setupRouterGuard(router)

export default router
