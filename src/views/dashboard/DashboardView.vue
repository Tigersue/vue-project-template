<template>
  <PageContainer>
    <template #header>
      <div class="welcome">
        <h2 class="welcome-title">Welcome, {{ userStore.profile?.name }} 👋</h2>
        <p class="welcome-sub">Here's what's happening today</p>
      </div>
    </template>

    <!-- Stat cards -->
    <div class="stat-grid">
      <el-card v-for="stat in stats" :key="stat.label" class="stat-card" shadow="never">
        <div class="stat-inner">
          <div class="stat-info">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-change" :class="stat.up ? 'up' : 'down'">
              {{ stat.up ? '↑' : '↓' }} {{ stat.change }}% vs last month
            </p>
          </div>
          <div class="stat-icon" :style="{ background: stat.color + '18', color: stat.color }">
            <el-icon size="24"><component :is="stat.icon" /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Placeholder chart area -->
    <el-card shadow="never" style="margin-top: 16px;">
      <template #header><span>Overview (connect your chart library here)</span></template>
      <div class="chart-placeholder">📊 Chart area — integrate ECharts or Chart.js</div>
    </el-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import PageContainer from '@/components/common/PageContainer.vue'

const userStore = useUserStore()

const stats = [
  { label: 'Total Users',    value: '12,480', change: 12.5, up: true,  icon: 'UserFilled', color: '#409eff' },
  { label: 'Active Sessions',value: '3,210',  change: 8.3,  up: true,  icon: 'Connection',  color: '#67c23a' },
  { label: 'Revenue (¥)',    value: '98,620',  change: 4.1,  up: false, icon: 'Money',       color: '#e6a23c' },
  { label: 'Pending Tasks',  value: '56',      change: 2.0,  up: false, icon: 'Bell',        color: '#f56c6c' },
]
</script>

<style scoped>
.welcome-title { margin: 0 0 4px; font-size: 20px; }
.welcome-sub   { margin: 0; color: var(--text-secondary); font-size: 13px; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card { border-radius: 8px; }

.stat-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label { font-size: 13px; color: var(--text-secondary); margin: 0 0 6px; }
.stat-value { font-size: 28px; font-weight: 700; margin: 0 0 6px; color: var(--text-primary); }
.stat-change { font-size: 12px; margin: 0; }
.stat-change.up   { color: #67c23a; }
.stat-change.down { color: #f56c6c; }

.stat-icon {
  width: 52px; height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 16px;
  color: var(--text-secondary);
}
</style>
