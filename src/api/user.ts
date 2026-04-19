import { get, post, put, del } from '@/plugins/http'
import type { PageQuery, PageResult } from '@/types/api'

export interface User {
  id:        string
  username:  string
  name:      string
  email:     string
  phone:     string
  roles:     string[]
  status:    0 | 1       // 0 = disabled, 1 = enabled
  createdAt: string
}

export interface CreateUserDto {
  username: string
  name:     string
  email:    string
  phone:    string
  roles:    string[]
  password: string
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {}

export const userApi = {
  list:   (params: PageQuery)                      => get<PageResult<User>>('/users', params),
  detail: (id: string)                             => get<User>(`/users/${id}`),
  create: (data: CreateUserDto)                    => post<User>('/users', data),
  update: (id: string, data: UpdateUserDto)        => put<User>(`/users/${id}`, data),
  remove: (id: string)                             => del<void>(`/users/${id}`),
  enable: (id: string, status: 0 | 1)             => put<void>(`/users/${id}/status`, { status }),
}
