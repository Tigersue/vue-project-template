<template>
  <div class="error-page">
    <div class="error-code">404</div>
    <p class="error-msg">Page not found</p>
    <el-button type="primary" @click="router.replace('/')">Back to Home</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
}
.error-code { font-size: 96px; font-weight: 700; color: #dcdfe6; line-height: 1; }
.error-msg  { font-size: 18px; color: var(--text-secondary); margin: 0; }
</style>
