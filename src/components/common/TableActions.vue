<template>
  <div class="table-actions">
    <div class="table-actions-left">
      <slot name="left" />
    </div>
    <div class="table-actions-right">
      <slot name="right" />
      <el-tooltip content="Refresh">
        <el-button circle :icon="Refresh" @click="$emit('refresh')" />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
defineEmits<{ refresh: [] }>()
</script>

<style scoped>
.table-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.table-actions-left,
.table-actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
