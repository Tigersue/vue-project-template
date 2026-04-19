<template>
  <header class="app-header">
    <!-- Left: collapse toggle + breadcrumb -->
    <div class="header-left">
      <el-icon class="toggle-btn" @click="appStore.toggleSidebar()">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <AppBreadcrumb />
    </div>

    <!-- Right: theme, user -->
    <div class="header-right">
      <el-tooltip :content="appStore.isDark ? 'Light mode' : 'Dark mode'">
        <el-icon class="action-icon" @click="appStore.toggleTheme()">
          <Sunny v-if="appStore.isDark" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>

      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="28" :src="userStore.profile?.avatar">
            {{ userStore.profile?.name?.[0] }}
          </el-avatar>
          <span class="user-name">{{ userStore.profile?.name }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">Profile</el-dropdown-item>
            <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import AppBreadcrumb from './AppBreadcrumb.vue'

const appStore  = useAppStore()
const userStore = useUserStore()

async function handleCommand(cmd: string) {
  if (cmd === 'logout') await userStore.logout()
}
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--bg-header);
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  box-shadow: var(--shadow-card);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-btn,
.action-icon {
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.toggle-btn:hover,
.action-icon:hover {
  background: #f5f7fa;
  color: var(--el-color-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-name {
  font-size: 13px;
  color: var(--text-primary);
}
</style>
