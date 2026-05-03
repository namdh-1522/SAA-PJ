const STORAGE_KEY = 'saa.postAuthRedirect'

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function stashRedirectTarget(target: string): void {
  const storage = safeStorage()
  if (!storage) return
  if (!target.startsWith('/')) return
  try {
    storage.setItem(STORAGE_KEY, target)
  } catch {
    // ignore — quota or privacy mode
  }
}

export function consumePostAuthRedirect(): string | null {
  const storage = safeStorage()
  if (!storage) return null
  try {
    const value = storage.getItem(STORAGE_KEY)
    if (value) {
      storage.removeItem(STORAGE_KEY)
    }
    return value
  } catch {
    return null
  }
}

export function captureSameOriginReferrer(): string | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null
  const referrer = document.referrer
  if (!referrer) return null
  try {
    const url = new URL(referrer)
    if (url.origin !== window.location.origin) return null
    if (url.pathname === '/' || url.pathname === '/auth/callback') return null
    return `${url.pathname}${url.hash}`
  } catch {
    return null
  }
}
