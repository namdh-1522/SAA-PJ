'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'
import FormLabel from '@/components/kudos/compose/atoms/FormLabel'
import type { KudosUser } from '@/types/kudos'

// MVP: inline autocomplete fallback. The eventual design routes the user to the
// Tìm kiếm sunner overlay (`3jgwke3E8O`); when that screen ships, this component
// becomes a Link/Button that calls router.push with a returnTo query param.
// See research.md "Open Questions" #1 for context.

interface SearchResult {
  id: string
  name: string
  avatarUrl: string | null
  department: string | null
}

export default function RecipientField() {
  const id = useId()
  const t = useTranslations('kudos.compose')
  const { recipient, setRecipient, errors, setErrors } = useKudoComposeContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  // Tracks whether the user has actually interacted with this field (typed
  // anything). Without it, the blur-validation below would fire the moment
  // focus leaves the input — including when the modal opens and the user
  // tabs or clicks straight into the title / content / hashtag fields
  // without ever engaging with the recipient row. Bug fix per Figma
  // `5c7PkAibyD`: don't surface "Người nhận không hợp lệ" until the user has
  // either typed in the field or attempted to submit.
  const hasTypedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const error = errors.receiverId

  // Drop receiverId from errors without touching the rest. We can't use a
  // partial update API because the context only exposes a batch setErrors().
  const clearReceiverError = () => {
    if (!errors.receiverId) return
    const { receiverId: _drop, ...rest } = errors
    void _drop
    setErrors(rest)
  }

  // Debounced search (300ms per TR-001). Skips when query is empty.
  useEffect(() => {
    if (!query.trim()) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sunners?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = (await res.json()) as SearchResult[]
          setResults(data)
        }
      } catch {
        // Silently fail — leave previous results visible
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(user: SearchResult) {
    setRecipient({
      id: user.id,
      name: user.name,
      email: '',
      avatarUrl: user.avatarUrl,
      department: user.department,
      starTier: null,
    } as KudosUser)
    setQuery('')
    setResults([])
    setOpen(false)
    clearReceiverError()
  }

  // Eager validation on blur — surface the same "Người nhận không hợp lệ"
  // (Zod's "Invalid uuid") that submit would emit, so the user gets feedback
  // the moment they leave the field instead of waiting for Gửi.
  //
  // BUT only after the user has actually engaged with the field (typed at
  // least one character). Otherwise opening the modal and tabbing past the
  // recipient straight into the title / content / hashtag fields — totally
  // legitimate flow — would flash an error before the user has had a chance
  // to fill anything in. The eventual `Gửi` submit still surfaces the error
  // through `useKudoCompose.submit()`, so nothing slips through unchecked.
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Focus moving inside the dropdown (keyboard Tab onto a result option, or
    // mouse-down on a result that prevents default) — let the eventual select
    // happen without flashing an error.
    if (containerRef.current?.contains(e.relatedTarget as Node)) return
    setOpen(false)
    if (!recipient && hasTypedRef.current) {
      // Match Zod's `z.string().uuid()` default for empty/invalid values so
      // the error key resolves to `kudos.compose.errors.Invalid uuid`.
      setErrors({ ...errors, receiverId: 'Invalid uuid' })
    }
  }

  return (
    <div className="flex flex-row items-center gap-[16px] w-full">
      <div className="w-[146px] flex-shrink-0">
        <FormLabel htmlFor={id} required>
          {t('fields.recipient_label')}
        </FormLabel>
      </div>
      <div className="relative flex-1" ref={containerRef}>
        <input
          id={id}
          type="text"
          autoComplete="off"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          value={recipient ? recipient.name : query}
          placeholder={t('fields.recipient_placeholder')}
          onChange={(e) => {
            const next = e.target.value
            setQuery(next)
            if (!next.trim()) setResults([])
            if (recipient) setRecipient(null)
            setOpen(true)
            // Flip the touched flag — once the user has typed anything, blur
            // is allowed to surface "Người nhận không hợp lệ" if they leave
            // without picking a recipient. Without this gate, the error
            // would also trigger on the modal's first blur (e.g. tabbing
            // straight past the field), which is the bug we're fixing.
            hasTypedRef.current = true
            // User is engaging again — drop the stale blur error.
            clearReceiverError()
          }}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          className="w-full font-bold outline-none transition-colors"
          style={{
            padding: '16px 24px',
            background: 'var(--color-kudos-compose-input-bg)',
            border: error
              ? '1px solid var(--color-kudos-compose-required)'
              : '1px solid var(--color-kudos-compose-border)',
            borderRadius: 'var(--radius-kudos-compose-input)',
            color: 'var(--color-kudos-compose-text)',
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-kudos-compose-body-size)',
            lineHeight: 'var(--text-kudos-compose-body-lh)',
            letterSpacing: 'var(--text-kudos-compose-body-ls)',
          }}
        />
        {open && results.length > 0 && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1 max-h-[280px] overflow-y-auto"
            style={{
              background: 'var(--color-kudos-compose-input-bg)',
              border: '1px solid var(--color-kudos-compose-border)',
              borderRadius: 'var(--radius-kudos-compose-input)',
              zIndex: 'var(--z-modal)',
            }}
          >
            {results.map((user) => (
              <li
                key={user.id}
                role="option"
                aria-selected="false"
                tabIndex={0}
                // Prevent input blur on mousedown so the click can fire and
                // run handleSelect before the blur handler would set the
                // "Invalid uuid" error.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(user)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(user)
                  }
                }}
                className="flex items-center gap-[12px] px-[16px] py-[10px] cursor-pointer hover:bg-[rgba(255,234,158,0.15)]"
                style={{ color: 'var(--color-kudos-compose-text)' }}
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-kudos-compose-border)]" />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] leading-[20px]">{user.name}</span>
                  {user.department && (
                    <span
                      className="text-[12px] leading-[16px]"
                      style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
                    >
                      {user.department}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <p
            id={`${id}-error`}
            className="mt-[4px] text-[14px] leading-[20px]"
            style={{ color: 'var(--color-kudos-compose-required)' }}
          >
            {t(`errors.${error}` as 'errors.recipient_required')}
          </p>
        )}
      </div>
    </div>
  )
}
