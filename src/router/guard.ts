import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

const WHITE_LIST = ['/login', '/403', '/404']

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore       = useUserStore()
    const permissionStore = usePermissionStore()

    if (!userStore.token) {
      return WHITE_LIST.includes(to.path) ? next() : next({ path: '/login', query: { redirect: to.fullPath } })
    }

    if (!userStore.isLoaded) {
      try {
        await userStore.fetchProfile()
        const routes = await permissionStore.buildRoutes(userStore.roles)
        routes.forEach(r => router.addRoute(r))
        return next({ ...to, replace: true })
      } catch {
        await userStore.logout()
        return next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }

    const requiredRoles = to.meta?.roles
    if (requiredRoles?.length && !requiredRoles.some(r => userStore.roles.includes(r))) {
      return next({ path: '/403' })
    }

    next()
  })
}
