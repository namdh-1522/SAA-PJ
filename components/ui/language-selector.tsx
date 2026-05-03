'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import VnFlagIcon from '@/components/icons/vn-flag-icon'
import UkFlagIcon from '@/components/icons/uk-flag-icon'
import ChevronDownIcon from '@/components/icons/chevron-down-icon'

type SupportedLocale = 'vi' | 'en'

interface LocaleOption {
  code: SupportedLocale
  label: 'VN' | 'EN'
  Flag: typeof VnFlagIcon
}

const LOCALES: readonly LocaleOption[] = [
  { code: 'vi', label: 'VN', Flag: VnFlagIcon },
  { code: 'en', label: 'EN', Flag: UkFlagIcon },
] as const

export default function LanguageSelector() {
  const router = useRouter()
  const activeLocale = useLocale() as SupportedLocale
  const t = useTranslations('LanguageMenu')

  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const panelId = useId()

  const activeIndex = LOCALES.findIndex((l) => l.code === activeLocale)
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0
  const active = LOCALES[safeActiveIndex]

  const persistMutation = useMutation({
    mutationFn: async (locale: SupportedLocale) => {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })
      if (!res.ok) throw new Error(`PUT /api/users/me failed: ${res.status}`)
    },
    onError: (err) => {
      // FR-011: persistence failure is silently logged; client-side switch is preserved.
      console.warn('Locale persistence failed', err)
    },
  })

  const closePanel = useCallback((restoreFocus = true) => {
    setIsOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  const selectLocale = useCallback(
    (code: SupportedLocale) => {
      if (code === activeLocale) {
        closePanel()
        return
      }
      document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`
      persistMutation.mutate(code)
      router.refresh()
      closePanel()
    },
    [activeLocale, closePanel, persistMutation, router],
  )

  const openPanel = useCallback(() => {
    setFocusedIndex(safeActiveIndex)
    setIsOpen(true)
  }, [safeActiveIndex])

  // Outside click → close (no focus restore — let the user keep clicking).
  useEffect(() => {
    if (!isOpen) return
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [isOpen])

  // Escape closes + returns focus to the trigger (US2 / WCAG 2.1.2).
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePanel()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closePanel])

  // When the panel opens, move focus to the active row.
  useEffect(() => {
    if (!isOpen) return
    itemRefs.current[focusedIndex]?.focus()
  }, [isOpen, focusedIndex])

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isOpen) closePanel()
      else openPanel()
    }
  }

  function handleRowKeyDown(e: React.KeyboardEvent<HTMLLIElement>, code: SupportedLocale) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectLocale(code)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((i) => (i + 1) % LOCALES.length)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((i) => (i - 1 + LOCALES.length) % LOCALES.length)
    }
  }

  const { Flag: ActiveFlag } = active

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? closePanel(false) : openPanel())}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={t('triggerAriaLabel')}
        className="flex items-center justify-between w-[108px] h-[56px] px-4 rounded-[var(--radius-lang)] text-[var(--color-text-primary)] hover:bg-white/[0.08] active:bg-white/[0.12] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-lang-focus-ring)] transition-[background-color] duration-150 ease-in-out cursor-pointer gap-0.5"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: 'var(--text-nav-lang-size)',
          fontWeight: 'var(--text-nav-lang-weight)',
          lineHeight: 'var(--text-nav-lang-lh)',
          letterSpacing: 'var(--text-nav-lang-ls)',
        }}
      >
        <ActiveFlag width={20} height={15} />
        <span>{active.label}</span>
        <ChevronDownIcon width={16} height={16} />
      </button>

      {isOpen && (
        <ul
          id={panelId}
          role="menu"
          aria-activedescendant={`${panelId}-row-${focusedIndex}`}
          className="absolute right-0 top-[calc(100%+4px)] w-[122px] h-[124px] p-[6px] rounded-[var(--radius-lang-panel)] border border-[var(--color-lang-panel-border)] bg-[var(--color-lang-panel-bg)] flex flex-col items-stretch"
          style={{ zIndex: 'var(--z-dropdown)' }}
        >
          {LOCALES.map(({ code, label, Flag }, index) => {
            const isSelected = code === activeLocale
            const accessibleName = t(code)
            return (
              <li
                key={code}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                id={`${panelId}-row-${index}`}
                role="menuitemradio"
                aria-checked={isSelected}
                aria-label={accessibleName}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => selectLocale(code)}
                onKeyDown={(e) => handleRowKeyDown(e, code)}
                onMouseEnter={() => setFocusedIndex(index)}
                onFocus={() => setFocusedIndex(index)}
                className={[
                  'h-[56px] flex items-center justify-between px-4 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-lang-focus-ring)] motion-safe:transition-[background-color] motion-safe:duration-120 motion-safe:ease-in-out',
                  isSelected
                    ? 'mx-[1px] w-[108px] rounded-[var(--radius-lang-selected)] bg-[var(--color-lang-selected-bg)] hover:bg-[var(--color-lang-selected-bg-hover)] active:bg-[var(--color-lang-selected-bg-active)]'
                    : 'w-full rounded-[var(--radius-lang-row)] hover:bg-[var(--color-lang-default-bg-hover)] active:bg-[var(--color-lang-default-bg-active)]',
                ].join(' ')}
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 'var(--text-nav-lang-size)',
                  fontWeight: 'var(--text-nav-lang-weight)',
                  lineHeight: 'var(--text-nav-lang-lh)',
                  letterSpacing: 'var(--text-nav-lang-ls)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <span className="flex items-center gap-1">
                  <Flag width={20} height={15} />
                  <span>{label}</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
