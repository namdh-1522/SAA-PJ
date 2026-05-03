'use client'

import { useState } from 'react'
// Plain <img> instead of next/image — kudos attachment URLs may originate from
// Supabase Storage, user-pasted external links, or dev seed data (picsum etc.).
// next/image's strict hostname allowlist would throw at render and crash the
// surrounding KudosSectionErrorBoundary if any attachment host isn't whitelisted.
import Link from 'next/link'
import ImageLightbox from '@/components/kudos/feed/ImageLightbox'
import { formatKudosTimestamp } from '@/lib/kudos/format-timestamp'
import { sanitizeKudosContent } from '@/lib/kudos/sanitize-content'
import { MAX_HASHTAGS_DISPLAY, MAX_IMAGES_DISPLAY } from '@/lib/kudos/constants'
import type { Hashtag } from '@/types/kudos'

interface KudosPostContentProps {
  kudosId: string
  /** Danh hiệu — Figma C.3.5: 16/24 700, letter-spacing 0.5, centred above content. */
  title: string
  content: string
  imageUrls: readonly string[]
  hashtags: readonly Hashtag[]
  /** ISO timestamp — rendered at the top of the content frame (Figma C.3.4). */
  timestamp: string
  onHashtagClick?: (tag: string) => void
}

export default function KudosPostContent({
  kudosId,
  title,
  content,
  imageUrls,
  hashtags,
  timestamp,
  onHashtagClick,
}: KudosPostContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const visibleImages = imageUrls.slice(0, MAX_IMAGES_DISPLAY)
  const extraImages = imageUrls.length - MAX_IMAGES_DISPLAY
  const visibleTags = hashtags.slice(0, MAX_HASHTAGS_DISPLAY)
  const hasMoreTags = hashtags.length > MAX_HASHTAGS_DISPLAY

  return (
    <div className="flex flex-col gap-4">
      {/* C.3.4 Timestamp — gray, left-aligned, font 16/24 700, letter-spacing 0.5px */}
      <span
        className="text-[16px] font-bold leading-[24px] tracking-[0.5px]"
        style={{ color: 'var(--color-kudos-text-timestamp)' }}
      >
        {formatKudosTimestamp(timestamp)}
      </span>

      {/* C.3.5 Danh hiệu (title) — Figma 16/24 700, letter-spacing 0.5px, centred,
          dark-on-cream. Rendered above the content body. */}
      {title && (
        <p
          className="text-center text-[16px] font-bold uppercase leading-[24px] tracking-[0.5px]"
          style={{ color: 'var(--color-kudos-text-on-cream)' }}
        >
          {title}
        </p>
      )}

      {/* Content body — Figma `Frame 425`: yellow-α background, gold border,
          radius 12, padding 16/24, with the content text justified inside. */}
      <Link href={`/kudos/${kudosId}`} className="block">
        <div
          className="flex flex-col items-start rounded-[12px]"
          style={{
            background: 'rgba(255, 234, 158, 0.40)',
            border: '1px solid var(--color-cta-bg)',
            padding: '16px 24px',
          }}
        >
          <div
            className="kudos-rich-content text-justify text-[20px] font-bold leading-[32px]"
            style={{
              color: 'var(--color-kudos-text-on-cream)',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            // Content is HTML produced by RichTextEditor (b/i/s/u/strong/em/
            // strike/p/div/span/ol/ul/li/blockquote/a). It's already sanitised
            // on insert by `createKudo`, and we sanitise again here as
            // defence-in-depth in case any pre-existing rows contain raw markup.
            // Using <div> (not <p>) so nested block elements (<ol>, <blockquote>)
            // are valid HTML.
            dangerouslySetInnerHTML={{ __html: sanitizeKudosContent(content) }}
          />
        </div>
      </Link>

      {/* Image thumbnails — Figma C.3.6: up to 5, 88x88, gap 16, radius 18 */}
      {visibleImages.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {visibleImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
              className="relative h-[88px] w-[88px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[18px]"
              style={{
                border: '1px solid var(--color-cta-outline-border)',
                background: '#FFF',
              }}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Ảnh ${i + 1}`}
                width={88}
                height={88}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {i === MAX_IMAGES_DISPLAY - 1 && extraImages > 0 && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-[14px] font-bold"
                  style={{ background: 'rgba(0,0,0,0.60)', color: '#fff' }}
                >
                  +{extraImages}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* C.3.7 Hashtags — Figma: plain red text, single line, 16/24 700, no chip background */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {visibleTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onHashtagClick?.(tag.name)}
              className="cursor-pointer text-[16px] font-bold leading-[24px] tracking-[0.5px] hover:underline"
              style={{ color: 'var(--color-accent-red)' }}
            >
              #{tag.name}
            </button>
          ))}
          {hasMoreTags && (
            <span
              className="text-[14px] font-bold"
              style={{ color: 'var(--color-kudos-text-timestamp)' }}
            >
              +{hashtags.length - MAX_HASHTAGS_DISPLAY}
            </span>
          )}
        </div>
      )}

      <ImageLightbox
        images={visibleImages as string[]}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
