import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

describe('use-copy-link', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('sets copied=true after successful copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const { useCopyLink } = await import('@/hooks/kudos/use-copy-link')
    const { result } = renderHook(() => useCopyLink())

    expect(result.current.copied).toBe(false)

    await act(async () => {
      await result.current.copy('https://example.com/kudos/1')
    })

    expect(result.current.copied).toBe(true)
    expect(writeText).toHaveBeenCalledWith('https://example.com/kudos/1')
  })

  it('resets copied to false after 2s', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const { useCopyLink } = await import('@/hooks/kudos/use-copy-link')
    const { result } = renderHook(() => useCopyLink())

    await act(async () => {
      await result.current.copy('https://example.com/kudos/1')
    })
    expect(result.current.copied).toBe(true)

    act(() => vi.advanceTimersByTime(2100))
    expect(result.current.copied).toBe(false)
  })

  it('handles clipboard API unavailable gracefully', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined })

    const { useCopyLink } = await import('@/hooks/kudos/use-copy-link')
    const { result } = renderHook(() => useCopyLink())

    await act(async () => {
      await result.current.copy('https://example.com/kudos/1')
    })
    expect(result.current.copied).toBe(false)
  })
})
