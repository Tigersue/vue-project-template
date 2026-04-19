<template>
  <el-form :model="modelValue" inline class="search-form">
    <slot />
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="$emit('search')">Search</el-button>
      <el-button :icon="Refresh" @click="$emit('reset')">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'

defineProps<{ modelValue: Record<string, unknown> }>()
defineEmits<{ search: []; reset: [] }>()
</script>

<style scoped>
.search-form {
  flex-wrap: wrap;
  gap: 4px;
}
</style>
