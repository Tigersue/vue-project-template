<template>
  <main class="app-main">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <KeepAlive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()

const cachedViews = computed(() =>
  permissionStore.dynamicRoutes
    .filter(r => r.meta?.keepAlive)
    .map(r => r.name as string),
)
</script>

<style scoped>
.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg-page);
}
</style>
