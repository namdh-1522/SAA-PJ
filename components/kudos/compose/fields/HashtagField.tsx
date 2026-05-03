'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'
import FormLabel from '@/components/kudos/compose/atoms/FormLabel'
import type { Hashtag } from '@/types/kudos'

const MAX_HASHTAGS = 5

async function fetchHashtagOptions(): Promise<Hashtag[]> {
  const res = await fetch('/api/hashtags')
  if (!res.ok) throw new Error('Failed to load hashtags')
  return (await res.json()) as Hashtag[]
}

export default function HashtagField() {
  const id = useId()
  const t = useTranslations('kudos.compose')
  const { form, toggleHashtag, errors } = useKudoComposeContext()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const error = errors.hashtags

  const { data: options = [] } = useQuery({
    queryKey: ['kudos-hashtags'],
    queryFn: fetchHashtagOptions,
    staleTime: 5 * 60 * 1000,
  })

  // Outside click closes dropdown
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

  const reachedMax = form.hashtags.length >= MAX_HASHTAGS
  const availableOptions = options.filter((h) => !form.hashtags.includes(h.name))

  return (
    <div className="flex flex-col gap-[8px] w-full">
      <div className="flex flex-row items-center gap-[16px]" ref={containerRef}>
        <div className="w-[108px] flex-shrink-0">
          <FormLabel htmlFor={id}>
            {t('fields.hashtag_label')}
          </FormLabel>
        </div>
        <div className="relative flex-1 flex flex-row flex-wrap items-center gap-[8px]">
          {form.hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-[6px] px-[12px] py-[4px] font-bold text-[14px] leading-[20px]"
              style={{
                background: 'rgba(255, 234, 158, 0.4)',
                border: '1px solid var(--color-kudos-compose-border)',
                borderRadius: '999px',
                color: 'var(--color-kudos-compose-text)',
              }}
            >
              #{tag}
              <button
                type="button"
                aria-label={`Remove hashtag ${tag}`}
                onClick={() => toggleHashtag(tag)}
                className="cursor-pointer leading-none text-[14px] hover:opacity-70"
                style={{ color: 'var(--color-kudos-compose-text)' }}
              >
                ×
              </button>
            </span>
          ))}
          {!reachedMax && (
            <button
              type="button"
              id={id}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="listbox"
              className="inline-flex flex-col items-center justify-center px-[16px] py-[6px] cursor-pointer transition-colors gap-[2px]"
              style={{
                background: open ? 'rgba(255, 234, 158, 0.2)' : 'transparent',
                border: '1px solid var(--color-kudos-compose-border)',
                borderRadius: '8px',
                color: 'var(--color-kudos-compose-text)',
              }}
            >
              <span className="font-bold text-[14px] leading-[20px]">
                {t('fields.hashtag_add')}
              </span>
              <span
                className="font-medium text-[12px] leading-[16px]"
                style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
              >
                {t('fields.hashtag_max')}
              </span>
            </button>
          )}
          {open && (
            <ul
              role="listbox"
              className="absolute left-0 top-full mt-1 max-h-[240px] overflow-y-auto"
              style={{
                background: 'var(--color-kudos-compose-input-bg)',
                border: '1px solid var(--color-kudos-compose-border)',
                borderRadius: 'var(--radius-kudos-compose-input)',
                minWidth: '200px',
                zIndex: 'var(--z-modal)',
              }}
            >
              {availableOptions.length === 0 ? (
                <li
                  className="px-[16px] py-[10px] text-[14px]"
                  style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
                >
                  Không có hashtag nào
                </li>
              ) : (
                availableOptions.map((h) => (
                  <li
                    key={h.id}
                    role="option"
                    aria-selected="false"
                    tabIndex={0}
                    onClick={() => {
                      toggleHashtag(h.name)
                      setOpen(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleHashtag(h.name)
                        setOpen(false)
                      }
                    }}
                    className="px-[16px] py-[10px] cursor-pointer hover:bg-[rgba(255,234,158,0.15)] font-bold text-[14px]"
                    style={{ color: 'var(--color-kudos-compose-text)' }}
                  >
                    #{h.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
      {error && (
        <p
          className="pl-[124px] text-[14px] leading-[20px]"
          style={{ color: 'var(--color-kudos-compose-required)' }}
        >
          {t(`errors.${error}` as 'errors.hashtag_required')}
        </p>
      )}
    </div>
  )
}
