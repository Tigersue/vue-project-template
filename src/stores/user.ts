import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { abortAll } from '@/plugins/http'
import router from '@/router'

export interface UserProfile {
  id: string
  name: string
  avatar: string
  roles: string[]
}

const TOKEN_KEY         = 'app_token'
const REFRESH_TOKEN_KEY = 'app_refresh_token'

export const useUserStore = defineStore('user', () => {
  const token        = ref(localStorage.getItem(TOKEN_KEY) ?? '')
  const refreshToken = ref(localStorage.getItem(REFRESH_TOKEN_KEY) ?? '')
  const profile      = ref<UserProfile | null>(null)

  const isLoaded = computed(() => profile.value !== null)
  const roles    = computed(() => profile.value?.roles ?? [])

  function _setTokens(access: string, refresh: string) {
    token.value        = access
    refreshToken.value = refresh
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  }

  async function login(credentials: { username: string; password: string }) {
    const res = await authApi.login(credentials)
    _setTokens(res.token, res.refreshToken)
  }

  async function fetchProfile() {
    profile.value = await authApi.getProfile()
  }

  async function doRefreshToken(): Promise<string> {
    const res = await authApi.refreshToken(refreshToken.value)
    _setTokens(res.token, res.refreshToken)
    return res.token
  }

  async function logout() {
    abortAll()
    token.value        = ''
    refreshToken.value = ''
    profile.value      = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    await router.replace('/login')
  }

  function $reset() {
    token.value        = ''
    refreshToken.value = ''
    profile.value      = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  return { token, refreshToken, profile, isLoaded, roles,
           login, fetchProfile, doRefreshToken, logout, $reset }
})
