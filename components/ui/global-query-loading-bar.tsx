'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'

/** Thin top-of-viewport progress bar that appears whenever any TanStack
 *  Query is fetching or mutating. Gives the user feedback on data-heavy
 *  screens (vd /kudos: filter change, scroll-to-load-more, realtime
 *  refetch) without forcing a full skeleton swap.
 *
 *  The animation is defined as `@keyframes global-loader-slide` in
 *  globals.css so the bar can be a server-renderable component if needed
 *  later (currently runs as a client component because it needs the
 *  React Query hooks). */
export default function GlobalQueryLoadingBar() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const visible = isFetching > 0 || isMutating > 0

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none overflow-hidden transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div
        className="h-full"
        style={{
          background: 'var(--color-cta-bg)',
          animation: visible ? 'global-loader-slide 1.4s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  )
}
