import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    roles?: string[]
    hidden?: boolean
    keepAlive?: boolean
    breadcrumb?: boolean
  }
}

export {}
