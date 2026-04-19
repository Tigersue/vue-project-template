/**
 * Common formatting utilities
 */

/** Format bytes to human-readable string */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/** Format ISO date string to locale string */
export function formatDate(iso: string, locale = 'zh-CN'): string {
  return new Date(iso).toLocaleString(locale)
}

/** Pad number to given length */
export function padStart(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}
