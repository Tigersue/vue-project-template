<template>
  <div class="admin-layout" :class="{ collapsed: appStore.sidebarCollapsed }">
    <AppSidebar />
    <div class="main-container">
      <AppHeader />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader  from '@/components/layout/AppHeader.vue'
import AppMain    from '@/components/layout/AppMain.vue'

const appStore = useAppStore()
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  transition: margin-left 0.28s;
}
</style>
