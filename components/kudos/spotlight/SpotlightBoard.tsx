'use client'

// TODO(d3-upgrade): D3 forceSimulation word cloud + pan/zoom (T102). Canvas styling per design-style § B.7.

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ExpandFullscreenIcon from '@/components/icons/expand-fullscreen-icon'
import SpotlightSearch from '@/components/kudos/spotlight/SpotlightSearch'
import SpotlightActivityFeed from '@/components/kudos/spotlight/SpotlightActivityFeed'
import KudosSectionHeading from '@/components/kudos/shared/KudosSectionHeading'
import { useKudosSpotlightBoard } from '@/hooks/kudos/use-kudos-spotlight-board'
import { useKudosTotal } from '@/hooks/kudos/use-kudos-total'

// Cloud sizing is proportional to `kudosReceived`. Map [minCount, maxCount]
// linearly onto [12px, 16px] so the busiest receiver visibly outranks the
// quietest. When everyone has the same count, fall back to the floor.
function cloudFontSizePx(count: number, minCount: number, maxCount: number): number {
  const MIN_PX = 10
  const MAX_PX = 16
  if (maxCount <= minCount) return MIN_PX
  const ratio = (count - minCount) / (maxCount - minCount)
  return Math.round(MIN_PX + ratio * (MAX_PX - MIN_PX))
}

// Deterministic 0..1 hash for chip placement. Same `id` always maps to the
// same scatter coordinate, so positions are stable across renders/refetches.
function fract(n: number): number {
  const v = Math.sin(n) * 43758.5453
  return v - Math.floor(v)
}
function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h = (h ^ id.charCodeAt(i)) >>> 0
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}
function chipPosition(id: string, salt: number): number {
  return fract(hashId(id) * 0.000001 + salt * 78.233)
}

export default function SpotlightBoard() {
  const router = useRouter()
  const boardRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('kudos.spotlight')
  const tPage = useTranslations('kudos.page')
  const tFeed = useTranslations('kudos.feed')
  const [query, setQuery] = useState('')
  const { sunners, isLoading: cloudLoading, isSearchMode } = useKudosSpotlightBoard(query)
  const { total, isLoading: totalLoading } = useKudosTotal()

  const awaitingTotalWhileCloudEmpty =
    !isSearchMode && totalLoading && sunners.length === 0 && !cloudLoading

  const showSkeleton = cloudLoading || awaitingTotalWhileCloudEmpty

  const showEmptyFeedCopy =
    !showSkeleton &&
    !isSearchMode &&
    !totalLoading &&
    total === 0 &&
    sunners.length === 0

  const showEmptySearchMessage = !showSkeleton && isSearchMode && sunners.length === 0

  const requestBoardFullscreen = () => {
    const el = boardRef.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen?.()
      return
    }
    void el.requestFullscreen?.()
  }

  const cloudBlock = showSkeleton ? (
    <div className="relative z-[2] grid w-full max-w-3xl grid-cols-3 gap-3 px-2 py-6 animate-pulse">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className="h-12 rounded-[12px]"
          style={{ background: 'var(--color-kudos-skeleton)' }}
        />
      ))}
    </div>
  ) : showEmptyFeedCopy ? (
    <div
      className="relative z-[2] mx-auto mt-4 max-w-md rounded-[12px] px-6 py-8 text-center"
      style={{
        background: 'rgba(255, 248, 225, 0.06)',
        border: '1px solid rgba(153, 140, 95, 0.4)',
      }}
    >
      <p className="text-[16px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
        {tFeed('empty')}
      </p>
    </div>
  ) : showEmptySearchMessage ? (
    <p className="relative z-[2] py-8 text-center text-[14px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
      {t('empty')}
    </p>
  ) : (
    (() => {
      // Font scale + hot-highlight are derived from kudos counts in the
      // current cloud. The leader (or leaders, on ties) renders in the
      // red-accent token per design-style § B.7 ("hot" → --color-accent-red).
      const counts = sunners.map((s) => s.kudosReceived)
      const minKudos = counts.length ? Math.min(...counts) : 0
      const maxKudos = counts.length ? Math.max(...counts) : 0
      // Grid + jitter so chips can't collide. Cloud area is wider than tall,
      // so we bias toward more cols than rows (~2.5:1 cell aspect).
      const N = sunners.length
      const rows = Math.max(1, Math.ceil(Math.sqrt(N / 2.5)))
      const cols = Math.max(1, Math.ceil(N / rows))
      const cellW = 1 / cols
      const cellH = 1 / rows
      // Keep height short enough that chips never reach the bottom-left
      // activity feed (which sits in an absolute layer at panel-bottom).
      return (
        <div className="relative z-[2] mx-auto w-full max-w-3xl" style={{ height: 'clamp(120px, 18vh, 150px)' }}>
          {sunners.map((sunner, i) => {
            const fs = cloudFontSizePx(sunner.kudosReceived, minKudos, maxKudos)
            const isHot = maxKudos > 0 && sunner.kudosReceived === maxKudos
            const col = i % cols
            const row = Math.floor(i / cols)
            // Jitter within ±25% of cell dims so chips look scattered while
            // staying inside their own cell — no overlap between chips.
            const jx = (chipPosition(sunner.id, 1) - 0.5) * cellW * 0.5
            const jy = (chipPosition(sunner.id, 2) - 0.5) * cellH * 0.5
            const leftPct = ((col + 0.5) * cellW + jx) * 100
            const topPct = ((row + 0.5) * cellH + jy) * 100
            return (
              <button
                key={sunner.id}
                type="button"
                onClick={() => router.push(`/profile/${sunner.id}`)}
                className="absolute max-w-[160px] truncate font-bold transition-opacity hover:opacity-80"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${fs}px`,
                  lineHeight: 1.25,
                  color: isHot ? 'var(--color-accent-red)' : 'var(--color-text-primary)',
                }}
                title={sunner.department ? `${sunner.name} — ${sunner.department}` : sunner.name}
              >
                {sunner.name}
              </button>
            )
          })}
        </div>
      )
    })()
  )

  return (
    <section className="flex flex-col gap-6" aria-label={t('section_title')}>
      <KudosSectionHeading caption={tPage('brand_caption')} title={t('section_title')} />

      <div
        ref={boardRef}
        className="relative min-h-[var(--spotlight-board-min-height)] overflow-hidden rounded-[var(--radius-kudos-card)] border"
        style={{
          border: 'var(--border-kudos-panel)',
          backgroundColor: 'var(--color-spotlight-canvas-base)',
        }}
      >
        {/*
          Background layers behind the cloud (z-[3]) and chrome (z-[4]).
          1. Connectivity / constellation network — covers the whole canvas.
          2. Warm KV ribbon anchored bottom-left at reduced opacity.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[url('/assets/kudos/spotlight-connectivity.svg')] bg-cover bg-center bg-no-repeat opacity-90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] bg-[url('/assets/kudos/spotlight-kv-bg.png')] bg-cover bg-center bg-no-repeat opacity-40"
        />

        <div className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,234,158,0.06)]" aria-hidden />

        <div className="absolute left-4 top-4 z-[4] sm:left-6 sm:top-6">
          <SpotlightSearch variant="board" value={query} onChange={setQuery} />
        </div>

        <div className="absolute bottom-4 left-4 z-[4] max-w-[min(calc(100%-6rem),420px)] sm:bottom-6 sm:left-6">
          <SpotlightActivityFeed />
        </div>

        <div className="absolute bottom-4 right-4 z-[4] sm:bottom-6 sm:right-6">
          <button
            type="button"
            onClick={requestBoardFullscreen}
            className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-kudos-arrow)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-kudos-pill-idle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-bg)]"
            aria-label={t('expand_aria')}
            title={t('expand_aria')}
          >
            <ExpandFullscreenIcon width={22} height={22} />
          </button>
        </div>

        <div className="relative z-[3] flex flex-col items-center px-10 pb-48 pt-14 sm:px-12 sm:pt-16">
          <p
            className="text-center text-[28px] font-bold leading-tight tracking-[-0.02em] sm:text-[32px] sm:leading-[40px] md:text-[36px] md:leading-[44px]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t('kudos_total', { count: total })}
          </p>
          {cloudBlock}
        </div>
      </div>
    </section>
  )
}
