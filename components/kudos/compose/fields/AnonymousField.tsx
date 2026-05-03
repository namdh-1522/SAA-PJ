'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'

const ANON_NICKNAME_MAX = 50

/**
 * G — Gửi ẩn danh / Anonymous toggle (+ required nickname).
 *
 * Layout matches the user-supplied PNG (`5c7PkAibyD`):
 *   - Checkbox row: square + "Gửi lời cám ơn và ghi nhận ẩn danh" label.
 *   - Nickname row (visible only when checkbox is on): label "Nickname ẩn
 *     danh*" on the LEFT (146 px column, same width as `Người nhận*` /
 *     `Hashtag*`), free-text input on the RIGHT — same shell tokens as the
 *     RecipientField input (white fill, 1 px gold border, 8 px radius, 16/24
 *     padding).
 *
 * Field becomes REQUIRED once the user opts to be anonymous — the server
 * still allows empty (DB default `''` ⇒ generic "Ẩn danh" label) but the
 * client now enforces a value so anonymous senders are forced to choose an
 * alias rather than ship the placeholder accidentally.
 *
 * On toggle-off: nickname value is cleared so a stale alias can't follow the
 * form into a non-anonymous submit.
 */
export default function AnonymousField() {
  const id = useId()
  const nicknameId = `${id}-nickname`
  const t = useTranslations('kudos.compose')
  const { form, setField, errors } = useKudoComposeContext()
  const checked = form.isAnonymous
  const nicknameError = errors.anonymousNickname

  const handleToggle = (next: boolean) => {
    setField('isAnonymous', next)
    if (!next && form.anonymousNickname) {
      setField('anonymousNickname', '')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Checkbox row */}
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer select-none items-center gap-[8px]"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => handleToggle(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center transition-colors peer-checked:bg-[var(--color-kudos-compose-primary-btn)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-kudos-compose-primary-btn)] peer-focus-visible:ring-offset-1"
          style={{
            border: '1px solid var(--color-kudos-compose-border)',
            borderRadius: 'var(--radius-kudos-compose-checkbox)',
            background: checked ? 'var(--color-kudos-compose-primary-btn)' : 'transparent',
          }}
        >
          {checked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 6.5L4.75 9L9.75 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--color-kudos-compose-text)' }}
              />
            </svg>
          )}
        </span>
        <span
          className="font-bold"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-kudos-compose-body-size)',
            lineHeight: 'var(--text-kudos-compose-body-lh)',
            letterSpacing: 'var(--text-kudos-compose-body-ls)',
            color: 'var(--color-kudos-compose-text)',
          }}
        >
          {t('fields.anonymous')}
        </span>
      </label>

      {/* Nickname row — same horizontal "label-left / input-right" pattern as
          the recipient row above so the form columns line up. The label uses
          body-size (16px) instead of the primary label-size (22px) — it's a
          sub-field nested under the anonymous toggle, not a top-level form
          field, so the design wants it visually subordinate. */}
      {checked && (
        <div className="flex w-full flex-row items-center gap-[16px]">
          <div className="w-[146px] flex-shrink-0">
            <label
              htmlFor={nicknameId}
              className="inline-flex items-center gap-[2px] font-bold"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 'var(--text-kudos-compose-body-size)',
                lineHeight: 'var(--text-kudos-compose-body-lh)',
                letterSpacing: 'var(--text-kudos-compose-body-ls)',
                color: 'var(--color-kudos-compose-text)',
              }}
            >
              {t('fields.anonymous_nickname_label')}
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--color-kudos-compose-required)',
                  fontSize: 'var(--text-kudos-compose-body-size)',
                  lineHeight: 'var(--text-kudos-compose-body-lh)',
                }}
              >
                *
              </span>
            </label>
          </div>
          <div className="relative flex-1">
            <input
              id={nicknameId}
              type="text"
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!nicknameError}
              aria-describedby={nicknameError ? `${nicknameId}-error` : undefined}
              value={form.anonymousNickname}
              onChange={(e) => setField('anonymousNickname', e.target.value)}
              maxLength={ANON_NICKNAME_MAX}
              placeholder={t('fields.anonymous_nickname_placeholder')}
              className="w-full font-bold outline-none transition-colors"
              style={{
                padding: '16px 24px',
                background: 'var(--color-kudos-compose-input-bg)',
                border: nicknameError
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
            {nicknameError && (
              <p
                id={`${nicknameId}-error`}
                className="mt-[4px] text-[14px] leading-[20px] font-bold"
                style={{ color: 'var(--color-kudos-compose-required)' }}
              >
                {t(`errors.${nicknameError}` as 'errors.anon_nickname_required')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
