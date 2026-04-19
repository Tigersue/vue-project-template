import { get, post } from '@/plugins/http'
import type { RouteRecordRaw } from 'vue-router'
import type { UserProfile } from '@/stores/user'

interface LoginRes  { token: string; refreshToken: string }
interface RefreshRes { token: string; refreshToken: string }

export const authApi = {
  login:        (data: { username: string; password: string }) =>
    post<LoginRes>('/auth/login', data),

  getProfile:   () =>
    get<UserProfile>('/auth/profile'),

  refreshToken: (refreshToken: string) =>
    post<RefreshRes>('/auth/refresh', { refreshToken }),

  getRoutes:    (roles: string[]) =>
    get<RouteRecordRaw[]>('/auth/routes', { roles }),

  logout:       () =>
    post<void>('/auth/logout'),
}
