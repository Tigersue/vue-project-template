<template>
  <!-- Single leaf route (no children, or all children hidden) -->
  <el-menu-item
    v-if="!hasVisibleChildren"
    :index="resolvePath(item.path)"
  >
    <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
    <template #title>{{ item.meta?.title }}</template>
  </el-menu-item>

  <!-- Route with visible children → submenu -->
  <el-sub-menu v-else :index="resolvePath(item.path)">
    <template #title>
      <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
      <span>{{ item.meta?.title }}</span>
    </template>
    <SidebarItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(child.path)"
    />
  </el-sub-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item:     RouteRecordRaw
  basePath: string
}>()

const visibleChildren = computed(
  () => props.item.children?.filter(c => !c.meta?.hidden) ?? [],
)
const hasVisibleChildren = computed(() => visibleChildren.value.length > 0)

function resolvePath(path: string): string {
  if (path.startsWith('/')) return path
  return `${props.basePath}/${path}`.replace(/\/+/g, '/')
}
</script>
