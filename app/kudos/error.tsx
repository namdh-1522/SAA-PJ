'use client'

import { useEffect } from 'react'

interface KudosErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function KudosError({ error, reset }: KudosErrorProps) {
  useEffect(() => {
    console.error('[KudosError]', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-[24px] px-[24px]"
      style={{ background: 'var(--color-bg-dark)' }}
    >
      <p className="text-[20px] font-bold text-[var(--color-text-primary)] text-center">
        Không thể tải trang Sun* Kudos. Vui lòng thử lại.
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-[24px] py-[12px] rounded-[var(--radius-kudos-open-gift)] font-bold text-[var(--color-cta-text)] cursor-pointer"
        style={{ background: 'var(--color-cta-bg)' }}
      >
        Thử lại
      </button>
    </div>
  )
}
