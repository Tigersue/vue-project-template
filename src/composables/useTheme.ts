import { useAppStore } from '@/stores/app'

export function useTheme() {
  const appStore = useAppStore()

  function applyTheme(t: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', t)
  }

  function init() {
    applyTheme(appStore.theme)
  }

  return { ...appStore, init, applyTheme }
}
