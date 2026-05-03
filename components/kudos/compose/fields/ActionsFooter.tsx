'use client'

import { useTranslations } from 'next-intl'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'
import { useKudoCompose } from '@/components/kudos/compose/hooks/useKudoCompose'

export default function ActionsFooter() {
  const t = useTranslations('kudos.compose')
  const { close } = useKudoComposeContext()
  const { submit, isSubmitting, submitError } = useKudoCompose()

  // Figma `5c7PkAibyD`: Gửi is ALWAYS clickable except while submitting —
  // clicking with required fields missing surfaces the top-level banner. The
  // previous `disabled={!isValid}` swallowed the click so the user never saw
  // the validation feedback.
  const submitDisabled = isSubmitting

  // Translation key per error code. `missing_required_fields` is the Figma
  // banner ("Bạn cần điền đủ Người nhận, Lời nhắn gửi và Hashtag để gửi
  // Kudos!"); other strings fall through to the generic submit-failed copy.
  const errorKey =
    submitError === 'missing_required_fields'
      ? ('errors.missing_required_fields' as const)
      : ('errors.submit_failed' as const)

  return (
    <div className="flex flex-col gap-[12px] w-full">
      {submitError && (
        <p
          role="alert"
          className="text-[14px] leading-[20px] font-bold"
          style={{ color: 'var(--color-kudos-compose-required)' }}
        >
          {t(errorKey)}
        </p>
      )}
      <div className="flex flex-row items-center gap-[24px] w-full">
        <button
          type="button"
          onClick={close}
          className="flex items-center justify-center gap-[8px] font-bold cursor-pointer transition-colors"
          style={{
            padding: '16px 40px',
            background: 'var(--color-kudos-compose-secondary-btn-bg)',
            border: '1px solid var(--color-kudos-compose-border)',
            borderRadius: 'var(--radius-kudos-compose-cancel-btn)',
            color: 'var(--color-kudos-compose-text)',
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-kudos-compose-body-size)',
            lineHeight: 'var(--text-kudos-compose-body-lh)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-kudos-compose-secondary-btn-bg-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-kudos-compose-secondary-btn-bg)'
          }}
        >
          {t('actions.cancel')}
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={submitDisabled}
          className="flex-1 flex items-center justify-center gap-[8px] font-bold transition-colors"
          style={{
            height: '60px',
            padding: '16px',
            background: submitDisabled
              ? 'rgba(255, 234, 158, 0.4)'
              : 'var(--color-kudos-compose-primary-btn)',
            border: 'none',
            borderRadius: 'var(--radius-kudos-compose-input)',
            color: 'var(--color-kudos-compose-text)',
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-kudos-compose-body-size)',
            lineHeight: 'var(--text-kudos-compose-body-lh)',
            opacity: submitDisabled ? 0.6 : 1,
            cursor: submitDisabled ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!submitDisabled) {
              e.currentTarget.style.background = 'var(--color-kudos-compose-primary-btn-hover)'
            }
          }}
          onMouseLeave={(e) => {
            if (!submitDisabled) {
              e.currentTarget.style.background = 'var(--color-kudos-compose-primary-btn)'
            }
          }}
        >
          {isSubmitting ? t('loading.submitting') : t('actions.submit')}
        </button>
      </div>
    </div>
  )
}
