'use client'

import { useId, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'

// Same allow-list as `lib/kudos/sanitize-content.ts:SAFE_HREF`. The two MUST
// stay aligned — the server will strip any href that fails this regex when the
// kudo is submitted, so accepting an out-of-list URL here would silently
// disappear from the saved content.
const SAFE_HREF = /^(?:https?:|mailto:|\/|#)/i

interface KudoLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Prefilled "Nội dung" — typically the editor's currently-selected text. */
  initialContent?: string
  /** Prefilled URL — defaults to "https://" so the user can append the host. */
  initialUrl?: string
  onSave: (values: { content: string; url: string }) => void
}

const LinkIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const CloseIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/** Add link box — Figma `OyDLDuSGEa`. Replaces the native `window.prompt()`
 *  link input previously used by the rich-text editor toolbar. The dialog is
 *  stacked on top of the compose modal (Radix supports nested dialogs) and
 *  uses the same compose tokens so the two surfaces look like the same family. */
export default function KudoLinkDialog({
  open,
  onOpenChange,
  initialContent = '',
  initialUrl = 'https://',
  onSave,
}: KudoLinkDialogProps) {
  const t = useTranslations('kudos.compose.fields')
  const id = useId()
  const [contentValue, setContentValue] = useState(initialContent)
  const [urlValue, setUrlValue] = useState(initialUrl)
  const [urlError, setUrlError] = useState<string | null>(null)

  // Reset fields every time the dialog transitions closed → open, so a
  // previous session's input doesn't bleed into the next one. Uses the
  // "adjust state during render" pattern (React docs) instead of a
  // useEffect — the conditional setState makes React re-render with the
  // fresh state without committing the stale state, so no cascade.
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setContentValue(initialContent)
      setUrlValue(initialUrl)
      setUrlError(null)
    }
  }

  const trimmedUrl = urlValue.trim()
  const saveDisabled = trimmedUrl.length === 0

  const handleSave = () => {
    if (!SAFE_HREF.test(trimmedUrl)) {
      setUrlError(t('link_dialog_url_invalid'))
      return
    }
    onSave({ content: contentValue.trim(), url: trimmedUrl })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            // Stack above the compose modal (--z-modal) so the link dialog
            // overlay paints on top of the parent dialog's overlay.
            zIndex: 'calc(var(--z-modal) + 1)',
          }}
        />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none"
          style={{
            width: 'min(752px, calc(100vw - 32px))',
            padding: 'var(--spacing-kudos-compose-padding)',
            background: 'var(--color-kudos-compose-modal-bg)',
            borderRadius: 'var(--radius-kudos-compose-modal)',
            zIndex: 'calc(var(--z-modal) + 1)',
          }}
        >
          <div
            className="flex flex-col"
            style={{ gap: 'var(--spacing-kudos-compose-gap)' }}
          >
            <Dialog.Title
              className="font-bold text-left"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 'var(--text-kudos-compose-title-size)',
                fontWeight: 'var(--text-kudos-compose-title-weight)',
                lineHeight: 'var(--text-kudos-compose-title-lh)',
                color: 'var(--color-kudos-compose-text)',
              }}
            >
              {t('link_dialog_title')}
            </Dialog.Title>

            {/* B — Nội dung row */}
            <div className="flex flex-row items-center" style={{ gap: '16px' }}>
              <label
                htmlFor={`${id}-content`}
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '22px',
                  fontWeight: 700,
                  lineHeight: '28px',
                  color: 'var(--color-kudos-compose-text)',
                }}
              >
                {t('link_dialog_content_label')}
              </label>
              <input
                id={`${id}-content`}
                type="text"
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
                placeholder={t('link_dialog_content_placeholder')}
                className="flex-1 outline-none"
                style={{
                  height: '56px',
                  padding: '16px 24px',
                  background: 'var(--color-kudos-compose-input-bg)',
                  border: '1px solid var(--color-kudos-compose-border)',
                  borderRadius: 'var(--radius-kudos-compose-input)',
                  color: 'var(--color-kudos-compose-text)',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 'var(--text-kudos-compose-body-size)',
                  lineHeight: 'var(--text-kudos-compose-body-lh)',
                }}
              />
            </div>

            {/* C — URL row */}
            <div className="flex flex-col" style={{ gap: '4px' }}>
              <div
                className="flex flex-row items-center"
                style={{ gap: '16px' }}
              >
                <label
                  htmlFor={`${id}-url`}
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: '28px',
                    color: 'var(--color-kudos-compose-text)',
                  }}
                >
                  {t('link_dialog_url_label')}
                </label>
                <div
                  className="relative flex flex-1 flex-row items-center"
                  style={{
                    height: '56px',
                    padding: '16px 24px',
                    background: 'var(--color-kudos-compose-input-bg)',
                    border: urlError
                      ? '1px solid var(--color-kudos-compose-required)'
                      : '1px solid var(--color-kudos-compose-border)',
                    borderRadius: 'var(--radius-kudos-compose-input)',
                  }}
                >
                  <input
                    id={`${id}-url`}
                    type="url"
                    value={urlValue}
                    onChange={(e) => {
                      setUrlValue(e.target.value)
                      if (urlError) setUrlError(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !saveDisabled) {
                        e.preventDefault()
                        handleSave()
                      }
                    }}
                    aria-invalid={!!urlError}
                    aria-describedby={urlError ? `${id}-url-error` : undefined}
                    placeholder={t('link_dialog_url_placeholder')}
                    className="flex-1 bg-transparent outline-none"
                    style={{
                      color: 'var(--color-kudos-compose-text)',
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: 'var(--text-kudos-compose-body-size)',
                      lineHeight: 'var(--text-kudos-compose-body-lh)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
                  >
                    {LinkIcon}
                  </span>
                </div>
              </div>
              {urlError && (
                <span
                  id={`${id}-url-error`}
                  role="alert"
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '14px',
                    color: 'var(--color-kudos-compose-required)',
                  }}
                >
                  {urlError}
                </span>
              )}
            </div>

            {/* D — Footer buttons */}
            <div
              className="flex flex-row items-start"
              style={{ gap: '24px' }}
            >
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex flex-row items-center justify-center font-bold cursor-pointer transition-colors"
                style={{
                  padding: '16px 40px',
                  gap: '8px',
                  background: 'var(--color-kudos-compose-secondary-btn-bg)',
                  border: '1px solid var(--color-kudos-compose-border)',
                  borderRadius: 'var(--radius-kudos-compose-cancel-btn)',
                  color: 'var(--color-kudos-compose-text)',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 'var(--text-kudos-compose-body-size)',
                  lineHeight: 'var(--text-kudos-compose-body-lh)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'var(--color-kudos-compose-secondary-btn-bg-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'var(--color-kudos-compose-secondary-btn-bg)'
                }}
              >
                <span>{t('link_dialog_cancel')}</span>
                {CloseIcon}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveDisabled}
                aria-disabled={saveDisabled}
                className="flex flex-1 flex-row items-center justify-center font-bold transition-colors"
                style={{
                  height: '60px',
                  padding: '16px',
                  gap: '8px',
                  background: saveDisabled
                    ? 'rgba(255, 234, 158, 0.4)'
                    : 'var(--color-kudos-compose-primary-btn)',
                  border: 'none',
                  borderRadius: 'var(--radius-kudos-compose-input)',
                  color: 'var(--color-kudos-compose-text)',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '22px',
                  lineHeight: '28px',
                  opacity: saveDisabled ? 0.6 : 1,
                  cursor: saveDisabled ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!saveDisabled) {
                    e.currentTarget.style.background =
                      'var(--color-kudos-compose-primary-btn-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saveDisabled) {
                    e.currentTarget.style.background =
                      'var(--color-kudos-compose-primary-btn)'
                  }
                }}
              >
                <span>{t('link_dialog_save')}</span>
                {LinkIcon}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
