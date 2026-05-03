'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'
import FormLabel from '@/components/kudos/compose/atoms/FormLabel'
import CharCounter from '@/components/kudos/compose/atoms/CharCounter'

const MAX_TITLE = 100

export default function DanhHieuField() {
  const id = useId()
  const t = useTranslations('kudos.compose')
  const { form, setField, errors } = useKudoComposeContext()
  const error = errors.title

  return (
    <div className="flex flex-col gap-[8px] w-full">
      <div className="flex flex-row items-center gap-[16px]">
        <div className="w-[139px] flex-shrink-0">
          <FormLabel htmlFor={id} required>
            {t('fields.title_label')}
          </FormLabel>
        </div>
        <input
          id={id}
          type="text"
          maxLength={MAX_TITLE}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={`${id}-hint ${error ? `${id}-error` : ''}`.trim()}
          value={form.title}
          placeholder={t('fields.title_placeholder')}
          onChange={(e) => setField('title', e.target.value.slice(0, MAX_TITLE))}
          className="font-bold outline-none transition-colors"
          style={{
            width: '514px',
            maxWidth: '100%',
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
      </div>
      <div
        id={`${id}-hint`}
        className="flex flex-row items-center justify-between gap-[16px] pl-[155px]"
      >
        <span
          className="font-bold flex-1"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-kudos-compose-body-size)',
            lineHeight: 'var(--text-kudos-compose-body-lh)',
            color: 'var(--color-kudos-compose-text-secondary)',
          }}
        >
          {error ? (
            <span id={`${id}-error`} style={{ color: 'var(--color-kudos-compose-required)' }}>
              {t(`errors.${error}` as 'errors.title_required')}
            </span>
          ) : (
            t('fields.title_hint')
          )}
        </span>
        <CharCounter current={form.title.length} max={MAX_TITLE} />
      </div>
    </div>
  )
}
