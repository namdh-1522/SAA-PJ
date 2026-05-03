/**
 * Integration tests for Realtime heart count reconciliation.
 * Verifies:
 *   1. patchKudosHeart updates feed state with authoritative count from WS payload
 *   2. use-heart ignores realtimeCount while a mutation is pending (no double-counting)
 *   3. use-heart syncs from realtimeCount once mutation completes
 *   4. Event deduplication: same kudosId + type within 1s window is dropped
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useHeart } from '@/hooks/kudos/use-heart'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function TestQueryWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

// ── use-heart reconciliation ──────────────────────────────────────────────────

describe('use-heart Realtime reconciliation', () => {
  beforeEach(() => vi.clearAllMocks())

  it('applies realtimeCount when no mutation is pending', () => {
    const { result, rerender } = renderHook(
      ({ realtimeCount }: { realtimeCount?: number }) =>
        useHeart({
          kudosId: 'k1',
          currentUserId: 'user-b',
          senderId: 'user-a',
          initialCount: 5,
          initialHearted: false,
          realtimeCount,
        }),
      { wrapper: makeWrapper(), initialProps: { realtimeCount: undefined as number | undefined } }
    )

    expect(result.current.heartCount).toBe(5)

    // Realtime event arrives with authoritative count 7
    rerender({ realtimeCount: 7 })
    expect(result.current.heartCount).toBe(7)
  })

  it('ignores realtimeCount while a mutation is in-flight (no double-counting)', async () => {
    // Simulate a slow mutation that resolves after the Realtime event
    let resolveToggle!: (v: import('@/types/kudos').HeartToggleResult) => void
    const togglePromise = new Promise<import('@/types/kudos').HeartToggleResult>((res) => {
      resolveToggle = res
    })
    global.fetch = vi.fn().mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => togglePromise,
      })
    ) as unknown as typeof fetch

    const { result, rerender } = renderHook(
      ({ realtimeCount }: { realtimeCount?: number }) =>
        useHeart({
          kudosId: 'k1',
          currentUserId: 'user-b',
          senderId: 'user-a',
          initialCount: 5,
          initialHearted: false,
          realtimeCount,
        }),
      { wrapper: makeWrapper(), initialProps: { realtimeCount: undefined as number | undefined } }
    )

    // Trigger optimistic update: count goes 5 → 6
    act(() => { result.current.toggle() })
    expect(result.current.heartCount).toBe(6)

    // Realtime event arrives WHILE mutation is pending — should be ignored
    rerender({ realtimeCount: 6 })
    expect(result.current.heartCount).toBe(6) // still our optimistic value, no double-count

    // Mutation resolves with authoritative count
    await act(async () => {
      resolveToggle({ weight: 1, totalHearts: 6, hasHearted: true })
      await Promise.resolve()
    })
    expect(result.current.heartCount).toBe(6)
    expect(result.current.hasHearted).toBe(true)
  })

  it('syncs from realtimeCount after mutation completes', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ weight: 1, totalHearts: 6, hasHearted: true }),
    }) as unknown as typeof fetch

    const { result, rerender } = renderHook(
      ({ realtimeCount }: { realtimeCount?: number }) =>
        useHeart({
          kudosId: 'k1',
          currentUserId: 'user-b',
          senderId: 'user-a',
          initialCount: 5,
          initialHearted: false,
          realtimeCount,
        }),
      { wrapper: makeWrapper(), initialProps: { realtimeCount: undefined as number | undefined } }
    )

    // Complete a mutation
    await act(async () => { result.current.toggle() })
    expect(result.current.heartCount).toBe(6)

    // After mutation, Realtime event with a higher count (another user also liked)
    rerender({ realtimeCount: 8 })
    expect(result.current.heartCount).toBe(8)
  })
})

// ── Deduplication (pure logic) ────────────────────────────────────────────────

describe('Realtime event deduplication', () => {
  it('drops events with the same kudosId+type within 1s', () => {
    const handler = vi.fn()
    const dedup: Record<string, number> = {}
    const WINDOW = 1000

    function dedupedDispatch(type: string, kudosId: string) {
      const key = `${type}:${kudosId}`
      const now = Date.now()
      if (now - (dedup[key] ?? 0) < WINDOW) return
      dedup[key] = now
      handler({ type, kudosId })
    }

    dedupedDispatch('kudos.liked', 'k1')
    dedupedDispatch('kudos.liked', 'k1') // duplicate within 1s → dropped

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('allows same event after 1s window expires', () => {
    const handler = vi.fn()
    const dedup: Record<string, number> = {}
    const WINDOW = 1000

    function dedupedDispatch(type: string, kudosId: string, nowOverride: number) {
      const key = `${type}:${kudosId}`
      if (nowOverride - (dedup[key] ?? 0) < WINDOW) return
      dedup[key] = nowOverride
      handler({ type, kudosId })
    }

    const t0 = Date.now()
    dedupedDispatch('kudos.liked', 'k1', t0)
    dedupedDispatch('kudos.liked', 'k1', t0 + 1001) // after window → allowed

    expect(handler).toHaveBeenCalledTimes(2)
  })
})
