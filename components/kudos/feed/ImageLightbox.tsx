'use client'

import { useState, useEffect, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
// Plain <img>: lightbox displays full-size attachments whose hosts may not be
// allowlisted. See KudosPostContent for rationale.
import { useTranslations } from 'next-intl'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
}: ImageLightboxProps) {
  const t = useTranslations('kudos.a11y')
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (open) setIndex(initialIndex)
  }, [open, initialIndex])

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(images.length - 1, i + 1)), [images.length])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, prev, next, onClose])

  const current = images[index]

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0"
          style={{ background: 'rgba(0,0,0,0.90)', zIndex: 'var(--z-kudos-lightbox)' }}
        />
        <Dialog.Content
          aria-modal="true"
          aria-label={t('lightbox_counter', { current: index + 1, total: images.length })}
          className="fixed inset-0 flex flex-col items-center justify-center outline-none"
          style={{ zIndex: 'var(--z-kudos-lightbox)' }}
        >
          {/* Counter */}
          <div className="absolute top-[16px] right-[16px] text-[16px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {index + 1} / {images.length}
          </div>

          {/* Close */}
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t('lightbox_close')}
              className="absolute top-[16px] left-[16px] w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.10)', color: 'var(--color-text-primary)' }}
            >
              ✕
            </button>
          </Dialog.Close>

          {/* Image */}
          {current && (
            <div className="relative max-w-[90vw] max-h-[80vh] w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current}
                alt={`${index + 1} / ${images.length}`}
                className="max-w-full max-h-full object-contain"
                decoding="async"
              />
            </div>
          )}

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label={t('lightbox_prev')}
                className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--color-text-primary)' }}
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index === images.length - 1}
                aria-label={t('lightbox_next')}
                className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--color-text-primary)' }}
              >
                →
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
