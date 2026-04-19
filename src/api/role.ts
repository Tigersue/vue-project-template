import { get, post, put, del } from '@/plugins/http'
import type { PageQuery, PageResult } from '@/types/api'

export interface Role {
  id:          string
  name:        string
  code:        string
  description: string
  permissions: string[]
  createdAt:   string
}

export const roleApi = {
  list:   (params?: PageQuery)                    => get<PageResult<Role>>('/roles', params),
  all:    ()                                       => get<Role[]>('/roles/all'),
  detail: (id: string)                            => get<Role>(`/roles/${id}`),
  create: (data: Partial<Role>)                   => post<Role>('/roles', data),
  update: (id: string, data: Partial<Role>)       => put<Role>(`/roles/${id}`, data),
  remove: (id: string)                            => del<void>(`/roles/${id}`),
}
