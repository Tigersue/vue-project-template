import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { authApi } from '@/api/auth'

const modules = import.meta.glob('../views/**/*.vue')

function resolveComponent(path: string) {
  const key = `../views/${path}.vue`
  return modules[key] ?? (() => import('../views/error/404View.vue'))
}

function transform(raw: RouteRecordRaw[]): RouteRecordRaw[] {
  return raw.map(r => ({
    ...r,
    component: resolveComponent(r.component as unknown as string),
    children:  r.children ? transform(r.children) : undefined,
  }))
}

export const usePermissionStore = defineStore('permission', () => {
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  const menuTree      = ref<RouteRecordRaw[]>([])

  async function buildRoutes(roles: string[]): Promise<RouteRecordRaw[]> {
    const raw    = await authApi.getRoutes(roles)
    const routes = transform(raw)
    dynamicRoutes.value = routes
    menuTree.value      = routes.filter(r => !r.meta?.hidden)
    return routes
  }

  function $reset() {
    dynamicRoutes.value = []
    menuTree.value      = []
  }

  return { dynamicRoutes, menuTree, buildRoutes, $reset }
})

