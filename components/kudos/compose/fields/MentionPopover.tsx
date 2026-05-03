'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useKudosSunnerSearch } from '@/hooks/kudos/use-sunner-search'

export interface MentionCandidate {
  readonly id: string
  readonly name: string
  readonly avatarUrl: string | null
  readonly department: string | null
}

export interface MentionPopoverPosition {
  /** Caret X relative to the editor surface. */
  readonly left: number
  /** Caret Y (top edge of the line) relative to the editor surface. */
  readonly top: number
  /** Line height of the caret — used to offset the popover below the line. */
  readonly lineHeight: number
}

interface MentionPopoverProps {
  readonly query: string
  readonly position: MentionPopoverPosition
  readonly onSelect: (sunner: MentionCandidate) => void
  readonly onDismiss: () => void
}

/**
 * Floating dropdown anchored under the caret while the user is mid-mention.
 *
 * Owned by `RichTextEditor`. The editor decides when this is open (it sees
 * the `@trigger`) and keeps the caret inside the contentEditable; the popover
 * receives query + position and renders matches.
 *
 * Keyboard handling intentionally lives on `document` (not the popover root)
 * because the caret stays inside the editor while this is open — the popover
 * never receives focus, so we have to listen globally and `preventDefault()`
 * the relevant keys before they reach the editor's `keydown`.
 */
export default function MentionPopover({
  query,
  position,
  onSelect,
  onDismiss,
}: MentionPopoverProps) {
  const t = useTranslations('kudos.compose')
  const { results, isLoading } = useKudosSunnerSearch(query)
  const [rawActiveIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  // Clamp at render time rather than resetting via an effect — when results
  // shrink (user typed another char and fewer match), this keeps the cursor
  // visible without an extra render pass.
  const activeIndex =
    results.length === 0 ? 0 : Math.min(rawActiveIndex, results.length - 1)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (results.length === 0 ? 0 : (i + 1) % results.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) =>
          results.length === 0 ? 0 : (i - 1 + results.length) % results.length,
        )
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (results.length === 0) return
        e.preventDefault()
        onSelect(results[activeIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onDismiss()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [activeIndex, results, onSelect, onDismiss])

  const empty = !isLoading && results.length === 0

  return (
    <ul
      ref={listRef}
      role="listbox"
      aria-label={t('fields.mention_listbox_label')}
      className="absolute z-50 max-h-[240px] min-w-[240px] overflow-y-auto"
      style={{
        top: position.top + position.lineHeight + 4,
        left: position.left,
        background: 'var(--color-kudos-compose-input-bg)',
        border: '1px solid var(--color-kudos-compose-border)',
        borderRadius: 'var(--radius-kudos-compose-input)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
      }}
    >
      {isLoading && results.length === 0 ? (
        <li
          className="px-[16px] py-[10px] text-[14px]"
          style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
        >
          {t('fields.mention_loading')}
        </li>
      ) : empty ? (
        <li
          className="px-[16px] py-[10px] text-[14px]"
          style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
        >
          {t('fields.mention_empty')}
        </li>
      ) : (
        results.map((s, idx) => {
          const active = idx === activeIndex
          return (
            <li
              key={s.id}
              role="option"
              aria-selected={active}
              onMouseDown={(e) => {
                // Prevent the editor from losing its caret before we can
                // splice the mention in.
                e.preventDefault()
                onSelect(s)
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className="flex cursor-pointer items-center gap-[12px] px-[16px] py-[10px] text-[14px] font-bold"
              style={{
                background: active ? 'rgba(255, 234, 158, 0.25)' : 'transparent',
                color: 'var(--color-kudos-compose-text)',
              }}
            >
              <span className="flex-1 truncate">{s.name}</span>
              {s.department && (
                <span
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
                >
                  {s.department}
                </span>
              )}
            </li>
          )
        })
      )}
    </ul>
  )
}
