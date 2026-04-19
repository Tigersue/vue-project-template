/**
 * v-auth directive + hasAuth() helper
 *
 * <el-button v-auth="'admin'">Delete</el-button>
 * <el-button v-auth="['admin','editor']">Edit</el-button>
 * if (hasAuth('admin')) { ... }
 */
import type { App, Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export function hasAuth(required: string | string[]): boolean {
  const { roles } = useUserStore()
  const list = Array.isArray(required) ? required : [required]
  return list.some(r => roles.includes(r))
}

const authDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, { value }) {
    if (!hasAuth(value)) el.parentNode?.removeChild(el)
  },
}

export function setupAuthDirective(app: App) {
  app.directive('auth', authDirective)
}
