<template>
  <div class="empty-layout">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.empty-layout {
  min-height: 100vh;
  background: var(--bg-page);
}
</style>
