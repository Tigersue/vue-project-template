# Vue 3 企业应用模板

> 一个基于 Vue 3 + TypeScript + Vite 的现代化企业级项目模板

## 📋 快速开始

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/Tigersue/vue-project-template.git

# 或使用 SSH
git clone git@github.com:Tigersue/vue-project-template.git

# 进入项目目录
cd vue-project-template
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

项目会自动在 `http://localhost:5173` 启动（如果端口被占用会自动换端口）

### 4. 登录信息

- **用户名**: `admin`
- **密码**: `password123`

## 🏗️ 项目结构

```
src/
├── api/              # API 接口定义
├── assets/           # 静态资源
├── components/       # Vue 组件
│   ├── common/       # 公共组件
│   └── layout/       # 布局组件
├── composables/      # 可组合函数
├── layouts/          # 页面布局
├── mocks/            # MSW 模拟数据
├── plugins/          # 插件配置
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
└── views/            # 页面组件
```

## 📦 核心技术栈

| 层级 | 选择 | 版本 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | ^3.4 |
| 构建 | Vite | ^5.x |
| 语言 | TypeScript | ^5.5 |
| UI 框架 | Element Plus | ^2.7 |
| 状态管理 | Pinia | ^2.1 |
| 路由 | Vue Router 4 | ^4.3 |
| HTTP | Axios | ^1.7 |
| 样式 | UnoCSS | ^0.61 |
| 测试 | Vitest | ^2.0 |

## 🛠️ 可用命令

```bash
# 开发服务器
pnpm dev

# 类型检查
pnpm typecheck

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查和修复
pnpm lint

# 运行测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 测试覆盖率
pnpm test:coverage
```

## ⚙️ 环境配置

项目支持多个环境配置文件：

- `.env.development` - 开发环境（已启用 MSW 模拟数据）
- `.env.production` - 生产环境
- `.env.test` - 测试环境
- `.env.local.example` - 本地环境示例

### 常用环境变量

```env
# API 基础 URL
VITE_API_BASE_URL=http://localhost:3000

# 应用标题
VITE_APP_TITLE=Enterprise App

# 是否启用 MSW 模拟数据
VITE_ENABLE_MOCK=true
```

## 🔐 MSW 模拟数据

项目内置 MSW (Mock Service Worker) 用于开发阶段的 API 模拟。

### 禁用 MSW

编辑 `.env.development` 文件：

```env
VITE_ENABLE_MOCK=false
```

然后重启开发服务器。

### 自定义模拟数据

编辑 `src/mocks/handlers.ts` 来自定义 API 响应。

## 🎨 新页面开发指南

本指南展示如何添加一个新页面并进行开发。以添加"产品管理"页面为例。

### 1️⃣ 创建 API 接口定义

在 `src/api/` 目录创建 `product.ts`：

```typescript
// src/api/product.ts
import { get, post, put, del } from '@/plugins/http'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 1 | 0  // 1: 上架 0: 下架
  createdAt: string
}

export interface ProductListQuery {
  name?: string
  category?: string
  status?: 1 | 0
  page?: number
  pageSize?: number
}

export interface ProductListResponse {
  list: Product[]
  total: number
  page: number
  pageSize: number
}

export const productApi = {
  // 获取产品列表
  getList: (query: ProductListQuery) =>
    get<ProductListResponse>('/products', query),

  // 创建产品
  create: (data: Omit<Product, 'id' | 'createdAt'>) =>
    post<Product>('/products', data),

  // 获取产品详情
  getDetail: (id: string) =>
    get<Product>(`/products/${id}`),

  // 更新产品
  update: (id: string, data: Partial<Product>) =>
    put<Product>(`/products/${id}`, data),

  // 删除产品
  delete: (id: string) =>
    del<void>(`/products/${id}`),
}
```

### 2️⃣ 添加 MSW 模拟数据

编辑 `src/mocks/handlers.ts` 添加产品相关的模拟处理器：

```typescript
// 在文件顶部导入部分后添加模拟数据
const mockProducts: Product[] = [
  { 
    id: '1', 
    name: '产品A', 
    description: '产品A描述',
    price: 99.99,
    stock: 100,
    category: '电子产品',
    status: 1,
    createdAt: '2024-01-01T00:00:00Z' 
  },
  { 
    id: '2', 
    name: '产品B', 
    description: '产品B描述',
    price: 199.99,
    stock: 50,
    category: '服装',
    status: 1,
    createdAt: '2024-01-02T00:00:00Z' 
  },
]

// 在 handlers 数组中添加以下处理器
export const handlers = [
  // ... 现有的处理器

  // ── Products ──────────────────────────────────────────────────────────────
  http.get('/products', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20)
    const list = mockProducts.slice((page - 1) * pageSize, page * pageSize)
    return HttpResponse.json({ 
      code: 0, 
      message: 'ok', 
      data: { list, total: mockProducts.length, page, pageSize } 
    })
  }),

  http.post('/products', async ({ request }) => {
    const body = await request.json() as Omit<Product, 'id' | 'createdAt'>
    const product: Product = { 
      id: String(Date.now()), 
      createdAt: new Date().toISOString(), 
      ...body 
    }
    mockProducts.push(product)
    return HttpResponse.json({ code: 0, message: 'ok', data: product })
  }),

  http.put('/products/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<Product>
    const idx = mockProducts.findIndex(p => p.id === params.id)
    if (idx === -1) 
      return HttpResponse.json({ code: 404, message: 'Not found' }, { status: 404 })
    mockProducts[idx] = { ...mockProducts[idx], ...body }
    return HttpResponse.json({ code: 0, message: 'ok', data: mockProducts[idx] })
  }),

  http.delete('/products/:id', ({ params }) => {
    const idx = mockProducts.findIndex(p => p.id === params.id)
    if (idx !== -1) mockProducts.splice(idx, 1)
    return HttpResponse.json({ code: 0, message: 'ok', data: null })
  }),
]
```

### 3️⃣ 更新路由配置

编辑 `src/mocks/handlers.ts` 中的 `/auth/routes` 处理器，添加产品管理路由：

```typescript
http.get('/auth/routes', () =>
  HttpResponse.json({
    code: 0, 
    message: 'ok',
    data: [
      // ... 现有的路由
      {
        path: '/system', 
        name: 'System',
        component: 'system/index',
        meta: { title: 'System', icon: 'Setting' },
        children: [
          { path: 'users', name: 'Users', component: 'system/users/UserListView', meta: { title: 'Users', roles: ['admin'] } },
          { path: 'roles', name: 'Roles', component: 'system/roles/RoleListView', meta: { title: 'Roles', roles: ['admin'] } },
          { path: 'products', name: 'Products', component: 'system/products/ProductListView', meta: { title: 'Products', roles: ['admin'] } },
        ],
      },
    ],
  }),
)
```

### 4️⃣ 创建页面组件

创建 `src/views/system/products/ProductListView.vue`：

```vue
<template>
  <PageContainer>
    <!-- Search -->
    <template #header>
      <SearchForm :model-value="query" @search="load" @reset="reset">
        <el-form-item label="产品名称">
          <el-input v-model="query.name" placeholder="搜索产品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="query.category" placeholder="请选择" clearable style="width:120px">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="食品" value="食品" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="请选择" clearable style="width:120px">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
      </SearchForm>
    </template>

    <!-- Toolbar -->
    <TableActions @refresh="load">
      <template #left>
        <el-button type="primary" :icon="Plus" @click="openCreate">新增产品</el-button>
      </template>
    </TableActions>

    <!-- Table -->
    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="name" label="产品名称" min-width="120" />
      <el-table-column prop="category" label="分类" min-width="100" />
      <el-table-column prop="price" label="价格" width="100" align="right">
        <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80" align="center" />
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'" size="small">
            {{ row.status ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="160">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      class="mt-4"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- Create / Edit dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑产品' : '新增产品'"
      width="500px"
      @close="closeDialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="食品" value="食品" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="formData.price" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="formData.stock" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { productApi, type Product } from '@/api/product'
import { useTable } from '@/composables/useTable'
import { formatDate } from '@/utils/format'
import PageContainer from '@/components/common/PageContainer.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import TableActions from '@/components/common/TableActions.vue'

const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const isEdit = ref(false)

const { list, loading, total, pagination, load, reset, handlePageChange, handleSizeChange } = useTable<Product, any>({
  fetchList: (query) => productApi.getList(query),
})

const query = reactive({
  name: '',
  category: '',
  status: undefined,
})

const formData = reactive({
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  status: 1,
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

function openCreate() {
  isEdit.value = false
  Object.assign(formData, {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    status: 1,
  })
  dialogVisible.value = true
}

function openEdit(product: Product) {
  isEdit.value = true
  Object.assign(formData, product)
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value?.validate()
  try {
    if (isEdit.value) {
      const { name, description, category, price, stock, status } = formData
      await productApi.update((formData as any).id, { 
        name, description, category, price, stock, status 
      })
      ElMessage.success('更新成功')
    } else {
      await productApi.create(formData)
      ElMessage.success('添加成功')
    }
    closeDialog()
    await load({ ...query, ...pagination })
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message ?? '操作失败'
    ElMessage.error(msg)
  }
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleDelete(product: Product) {
  try {
    await ElMessageBox.confirm('确认删除该产品？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await productApi.delete(product.id)
    ElMessage.success('删除成功')
    await load({ ...query, ...pagination })
  } catch {
    // 取消删除
  }
}

// 初始加载
load({ ...query, ...pagination })
</script>

<style scoped>
:deep(.el-table__header) {
  background-color: #f5f7fa;
}
</style>
```

### 5️⃣ 开发流程总结

| 步骤 | 文件 | 描述 |
|------|------|------|
| 1 | `src/api/product.ts` | 定义 API 接口和类型 |
| 2 | `src/mocks/handlers.ts` | 添加 MSW 模拟数据和路由 |
| 3 | `src/mocks/handlers.ts` | 更新 `/auth/routes` 响应 |
| 4 | `src/views/system/products/ProductListView.vue` | 创建页面组件 |
| 5 | 重启开发服务器 | 加载新路由和模拟数据 |

### 6️⃣ 快速检查清单

- [ ] API 接口类型完整定义
- [ ] MSW 处理器已添加
- [ ] 路由已注册到 `/auth/routes`
- [ ] 页面组件文件创建
- [ ] 页面与 API 接口对接
- [ ] 测试所有 CRUD 操作
- [ ] 检查权限角色配置
- [ ] 运行 `pnpm typecheck` 确保类型正确

### 7️⃣ 常见坑位

**路由不显示？**
- 检查 `/auth/routes` API 是否返回了该路由
- 确认用户角色是否满足路由的 `roles` 要求
- 检查浏览器控制台是否有错误

**组件加载不出来？**
- 确认文件路径是否与路由 `component` 字段一致
- 检查组件的 `<template>` 中是否有错误
- 运行 `pnpm typecheck` 检查类型

**API 请求失败？**
- 查看浏览器 Network 标签检查请求
- 检查 MSW 处理器 URL 是否匹配
- 查看浏览器控制台 MSW 日志

## 📝 项目规范

### 代码风格

- ✅ 仅使用 Composition API（`<script setup lang="ts">`）
- ✅ 严格的 TypeScript 模式（禁止使用 `any`）
- ✅ 自动 import 和组件注册（由 unplugin 处理）
- ✅ UnoCSS 工具类用于样式

### 组件规范

- Props 使用 `defineProps<{...}>()`
- Emits 使用 `defineEmits<{...}>()`
- 超过 30 行代码应提取为 composable
- 组件文件名使用 PascalCase

### 状态管理

- 使用 Setup Store 模式
- 每个域一个独立的 store 文件
- 提供 `$reset()` 方法重置状态

### 路由元数据

```ts
meta: {
  title?: string       // 面包屑和标签页标题
  icon?: string        // 侧边栏图标
  roles?: string[]     // 必需角色（省略表示任何认证用户可访问）
  hidden?: boolean     // 是否在侧边栏隐藏
  keepAlive?: boolean  // 是否使用 KeepAlive 缓存
}
```

## 🚀 构建与部署

### 生产构建

```bash
pnpm build
```

构建产物输出到 `dist` 目录。

### 预览构建结果

```bash
pnpm preview
```

## 🤝 Git 工作流

### 分支命名规范

- `feat/<id>-description` - 新功能
- `fix/<id>-description` - Bug 修复
- `chore/description` - 构建、依赖等

### 提交信息规范

遵循 Conventional Commits：

```
feat: 添加用户管理功能
fix: 修复登录页面样式问题
chore: 更新依赖版本
```

## 📚 API 接口文档

### 认证相关

#### 登录
- **POST** `/auth/login`
- Body: `{ username: string; password: string }`
- Response: `{ token: string; refreshToken: string }`

#### 获取当前用户信息
- **GET** `/auth/profile`
- Response: `{ id: string; name: string; avatar: string; roles: string[] }`

#### 刷新 Token
- **POST** `/auth/refresh`
- Body: `{ refreshToken: string }`
- Response: `{ token: string; refreshToken: string }`

### 用户管理

#### 获取用户列表
- **GET** `/users?page=1&pageSize=20`
- Response: `{ list: User[]; total: number; page: number; pageSize: number }`

#### 创建用户
- **POST** `/users`
- Body: User 对象
- Response: User 对象

#### 更新用户
- **PUT** `/users/:id`
- Body: 更新字段
- Response: 更新后的 User 对象

#### 删除用户
- **DELETE** `/users/:id`
- Response: null

## 🐛 常见问题

### 端口被占用

如果 5173 端口被占用，Vite 会自动使用下一个可用端口。查看控制台输出获取实际端口。

### 依赖安装失败

清除缓存并重新安装：

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 类型错误

运行类型检查：

```bash
pnpm typecheck
```

## 📖 更多资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)

## 📄 许可证

MIT License

---

**最后更新**: 2026 年 4 月 19 日
