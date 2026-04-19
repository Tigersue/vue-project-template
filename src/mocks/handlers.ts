import { http, HttpResponse } from 'msw'
import type { User } from '@/api/user'

const mockUsers: User[] = [
  { id: '1', username: 'admin',  name: 'Admin User',   email: 'admin@example.com',  phone: '13800001111', roles: ['admin'],  status: 1, createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', username: 'editor', name: 'Editor User',  email: 'editor@example.com', phone: '13800002222', roles: ['editor'], status: 1, createdAt: '2024-02-01T00:00:00Z' },
]

// 允许登入的用户名白名单
const ALLOWED_USERS = ['admin', 'editor']

// 用于存储当前登录用户的信息
let currentUser: User | null = null

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post('/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string }
    
    // 检查用户名是否在白名单中
    if (!ALLOWED_USERS.includes(body.username)) {
      return HttpResponse.json({ code: 401, message: 'User not found' }, { status: 401 })
    }
    
    // 检查密码
    if (body.password !== 'password123') {
      return HttpResponse.json({ code: 401, message: 'Invalid credentials' }, { status: 401 })
    }
    
    // 查找用户
    const user = mockUsers.find(u => u.username === body.username)
    if (!user) {
      return HttpResponse.json({ code: 401, message: 'User not found' }, { status: 401 })
    }
    
    // 保存当前登录用户
    currentUser = user
    
    return HttpResponse.json({ code: 0, message: 'ok', data: { token: 'mock-token', refreshToken: 'mock-refresh' } })
  }),

  http.get('/auth/profile', () =>
    HttpResponse.json({ code: 0, message: 'ok', data: currentUser ? { id: currentUser.id, name: currentUser.name, avatar: '', roles: currentUser.roles } : { id: '1', name: 'Admin User', avatar: '', roles: ['admin'] } }),
  ),

  http.post('/auth/refresh', () =>
    HttpResponse.json({ code: 0, message: 'ok', data: { token: 'new-mock-token', refreshToken: 'new-mock-refresh' } }),
  ),

  http.get('/auth/routes', () =>
    HttpResponse.json({
      code: 0, message: 'ok',
      data: [
        {
          path: '/dashboard', name: 'Dashboard',
          component: 'dashboard/DashboardView',
          meta: { title: 'Dashboard', icon: 'House' },
        },
        {
          path: '/system', name: 'System',
          component: 'system/index',
          meta: { title: 'System', icon: 'Setting' },
          children: [
            { path: 'users', name: 'Users', component: 'system/users/UserListView', meta: { title: 'Users', roles: ['admin'] } },
            { path: 'roles', name: 'Roles', component: 'system/roles/RoleListView', meta: { title: 'Roles', roles: ['admin'] } },
          ],
        },
      ],
    }),
  ),

  // ── Users ─────────────────────────────────────────────────────────────────
  http.get('/users', ({ request }) => {
    const url  = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const size = Number(url.searchParams.get('pageSize') ?? 20)
    const list = mockUsers.slice((page - 1) * size, page * size)
    return HttpResponse.json({ code: 0, message: 'ok', data: { list, total: mockUsers.length, page, pageSize: size } })
  }),

  http.post('/users', async ({ request }) => {
    const body = await request.json() as Partial<User>
    const user: User = { id: String(Date.now()), status: 1, createdAt: new Date().toISOString(), ...body } as User
    mockUsers.push(user)
    return HttpResponse.json({ code: 0, message: 'ok', data: user })
  }),

  http.put('/users/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<User>
    const idx  = mockUsers.findIndex(u => u.id === params.id)
    if (idx === -1) return HttpResponse.json({ code: 404, message: 'Not found' }, { status: 404 })
    mockUsers[idx] = { ...mockUsers[idx], ...body }
    return HttpResponse.json({ code: 0, message: 'ok', data: mockUsers[idx] })
  }),

  http.delete('/users/:id', ({ params }) => {
    const idx = mockUsers.findIndex(u => u.id === params.id)
    if (idx !== -1) mockUsers.splice(idx, 1)
    return HttpResponse.json({ code: 0, message: 'ok', data: null })
  }),
]
