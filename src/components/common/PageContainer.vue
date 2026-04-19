<template>
  <div class="page-container">
    <div v-if="$slots.header" class="page-header">
      <slot name="header" />
    </div>
    <div class="page-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 16px 20px;
  box-shadow: var(--shadow-card);
}

.page-body {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: var(--shadow-card);
}
</style>
