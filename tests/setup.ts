import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

if (typeof globalThis.IntersectionObserver === 'undefined') {
  class StubIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  vi.stubGlobal('IntersectionObserver', StubIntersectionObserver)
}

beforeEach(() => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear()
  }
})
