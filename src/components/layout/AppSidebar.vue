<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <span class="logo-icon">V</span>
      <Transition name="fade">
        <span v-if="!appStore.sidebarCollapsed" class="logo-title">
          {{ appTitle }}
        </span>
      </Transition>
    </div>

    <!-- Navigation -->
    <el-scrollbar class="sidebar-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :unique-opened="true"
        background-color="var(--bg-sidebar)"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <SidebarItem
          v-for="route in permissionStore.menuTree"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePermissionStore } from '@/stores/permission'
import SidebarItem from './SidebarItem.vue'

const appStore        = useAppStore()
const permissionStore = usePermissionStore()
const route           = useRoute()
const appTitle        = import.meta.env.VITE_APP_TITLE

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.28s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--el-color-primary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.logo-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-scroll {
  flex: 1;
}

:deep(.el-menu) {
  border-right: none;
}
</style>
