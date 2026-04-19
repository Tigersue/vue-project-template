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
