import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme            = ref<'light' | 'dark'>('light')
  const language         = ref('zh-CN')

  const isDark = computed(() => theme.value === 'dark')

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function $reset() {
    sidebarCollapsed.value = false
    theme.value            = 'light'
  }

  return { sidebarCollapsed, theme, language, isDark, toggleSidebar, toggleTheme, $reset }
})
