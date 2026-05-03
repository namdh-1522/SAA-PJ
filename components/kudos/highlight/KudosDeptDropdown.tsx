'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import ChevronDownIcon from '@/components/icons/chevron-down-icon'
import type { Department } from '@/types/kudos'

interface KudosDeptDropdownProps {
  departments: readonly Department[]
  /** Active department code (`null` = "Tất cả phòng ban"). */
  value: string | null
  onChange: (code: string | null) => void
  className?: string
}

/** B.1.2 Phòng ban — Figma `WXK5AYB_rG`.
 *
 *  Custom popover dropdown so we can render the active row with the gold
 *  text-shadow glow shown in the design (native `<option>` cannot be styled).
 *  Trigger pill matches the existing `KudosFilters` hashtag pill so the two
 *  filters look identical when closed.
 *
 *  A11y: trigger is a `combobox` with `aria-haspopup="listbox"`; panel is a
 *  `listbox` with `role="option"` items and `aria-selected` on the active row.
 *  Keyboard: ↑/↓ moves focus, Enter/Space selects, Esc closes (mirrors the
 *  click-outside / Esc pattern in `components/ui/avatar-menu.tsx`). */
export default function KudosDeptDropdown({
  departments,
  value,
  onChange,
  className = '',
}: KudosDeptDropdownProps) {
  const t = useTranslations('kudos.highlight')
  const [isOpen, setIsOpen] = useState(false)
  // Focused row index inside the panel — `-1` = trigger has focus.
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxId = useId()

  // Build the option list once per `departments` change. The "All" option is
  // a synthetic row at the top — its value is `null` and clearing the filter.
  const options = useMemo(
    () => [
      { code: null as string | null, label: t('filter_all_depts') },
      ...departments.map((d) => ({ code: d.code, label: d.name })),
    ],
    [departments, t]
  )

  const activeIndex = useMemo(
    () => options.findIndex((o) => o.code === value),
    [options, value]
  )
  const triggerLabel =
    activeIndex >= 0 ? options[activeIndex].label : t('filter_all_depts')

  // Close on click-outside + Esc — same pattern as <AvatarMenu>.
  useEffect(() => {
    if (!isOpen) return
    const onMouseDown = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  // When the panel opens, jump focus to the active row (or first row).
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
      return
    }
    setFocusedIndex(activeIndex >= 0 ? activeIndex : 0)
  }, [isOpen, activeIndex])

  const handleSelect = useCallback(
    (code: string | null) => {
      onChange(code)
      setIsOpen(false)
      // Return focus to the trigger so keyboard users don't lose their place.
      requestAnimationFrame(() => triggerRef.current?.focus())
    },
    [onChange]
  )

  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (!isOpen) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((i) => Math.min(options.length - 1, i + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((i) => Math.max(0, i - 1))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setFocusedIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setFocusedIndex(options.length - 1)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const sel = options[focusedIndex]
        if (sel) handleSelect(sel.code)
      }
    },
    [isOpen, options, focusedIndex, handleSelect]
  )

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={t('filter_dept_label')}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
        className="relative inline-flex h-[72px] min-h-[72px] max-w-[min(100%,280px)] cursor-pointer items-center gap-2 overflow-hidden rounded-[var(--radius-kudos-pill-md)] border border-[var(--color-kudos-border)] pl-4 pr-3 text-[16px] font-bold leading-[24px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-dark)]"
        style={{
          backgroundColor: 'var(--color-kudos-pill-idle)',
          color: 'var(--color-text-primary)',
        }}
      >
        <span className="min-w-0 flex-1 truncate text-left">{triggerLabel}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          className="flex-shrink-0 text-[var(--color-cta-bg)]"
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('filter_dept_label')}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="absolute right-0 top-full z-[var(--z-kudos-tooltip,40)] mt-2 flex min-w-[min(280px,100vw-2rem)] flex-col gap-0 rounded-[var(--radius-sm)] p-[6px] shadow-lg outline-none"
          style={{
            background: 'var(--color-kudos-bg-panel)',
            border: 'var(--border-kudos-panel)',
          }}
        >
          {options.map((opt, i) => {
            const isActive = opt.code === value
            const isFocused = i === focusedIndex
            const optionId = `${listboxId}-${i}`
            return (
              <li
                key={optionId}
                id={optionId}
                role="option"
                aria-selected={isActive}
                tabIndex={isFocused ? 0 : -1}
                ref={(el) => {
                  if (isFocused && el) el.focus()
                }}
                onClick={() => handleSelect(opt.code)}
                onMouseEnter={() => setFocusedIndex(i)}
                className="flex h-14 cursor-pointer items-center justify-start rounded-[var(--radius-xs)] px-4 py-4 text-[16px] font-bold leading-[24px] tracking-[0.5px] outline-none transition-colors duration-150"
                style={{
                  color: 'var(--color-text-primary)',
                  background: isActive || isFocused ? 'var(--color-kudos-pill-idle)' : 'transparent',
                  textShadow: isActive ? 'var(--text-shadow-active)' : undefined,
                }}
              >
                {opt.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
