import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useUserStore } from '@/stores/user'

// ── Token-refresh queue ──────────────────────────────────────────────────────
// On first 401, one refresh call is made. All concurrent requests are held in
// this queue and replayed with the new token once refresh succeeds.

let isRefreshing = false
let resolveQueue: Array<(token: string) => void> = []
let rejectQueue:  Array<(err: unknown) => void>  = []

function enqueue(res: (t: string) => void, rej: (e: unknown) => void) {
  resolveQueue.push(res)
  rejectQueue.push(rej)
}
function flushQueue(token: string) {
  resolveQueue.forEach(fn => fn(token))
  resolveQueue = []; rejectQueue = []
}
function drainQueue(err: unknown) {
  rejectQueue.forEach(fn => fn(err))
  resolveQueue = []; rejectQueue = []
}

// ── AbortController registry ─────────────────────────────────────────────────
// Keyed by "METHOD URL". Call abortAll() on route change to cancel stale requests.

const controllers = new Map<string, AbortController>()

export function abortAll() {
  controllers.forEach(c => c.abort())
  controllers.clear()
}

// ── Instance ─────────────────────────────────────────────────────────────────

function createHttp(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { token } = useUserStore()
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Register abort controller
    const key = `${config.method?.toUpperCase()} ${config.url}`
    const ctrl = new AbortController()
    controllers.set(key, ctrl)
    config.signal = ctrl.signal

    return config
  })

  instance.interceptors.response.use(
    (res) => {
      const key = `${res.config.method?.toUpperCase()} ${res.config.url}`
      controllers.delete(key)
      // Unwrap envelope: { code, message, data }
      return res.data?.data ?? res.data
    },
    async (error) => {
      if (axios.isCancel(error)) return Promise.reject(error)

      const { response, config } = error

      if (response?.status === 401 && config && !config.__retried) {
        config.__retried = true
        const userStore = useUserStore()

        if (!isRefreshing) {
          isRefreshing = true
          try {
            const newToken = await userStore.doRefreshToken()
            isRefreshing = false
            flushQueue(newToken)
          } catch (err) {
            isRefreshing = false
            drainQueue(err)
            await userStore.logout()
            return Promise.reject(err)
          }
        }

        return new Promise((res, rej) => {
          enqueue((token) => {
            config.headers.Authorization = `Bearer ${token}`
            res(instance(config))
          }, rej)
        })
      }

      return Promise.reject(response?.data ?? error)
    },
  )

  return instance
}

export const http = createHttp()

export const get  = <T>(url: string, params?: object, cfg?: AxiosRequestConfig) =>
  http.get<unknown, T>(url, { params, ...cfg })

export const post = <T>(url: string, data?: object, cfg?: AxiosRequestConfig) =>
  http.post<unknown, T>(url, data, cfg)

export const put  = <T>(url: string, data?: object, cfg?: AxiosRequestConfig) =>
  http.put<unknown, T>(url, data, cfg)

export const del  = <T>(url: string, cfg?: AxiosRequestConfig) =>
  http.delete<unknown, T>(url, cfg)
