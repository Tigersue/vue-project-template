/** Common validation helpers (usable in Element Plus form rules) */

export const isEmail = (val: string) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(val)
export const isPhone = (val: string) => /^1[3-9]\d{9}$/.test(val)
export const isUrl   = (val: string) => /^https?:\/\/.+/.test(val)
export const isEmpty = (val: unknown) =>
  val === null || val === undefined || val === ''

/** Element Plus async rule helper */
export function requiredRule(message: string) {
  return { required: true, message, trigger: 'blur' }
}
