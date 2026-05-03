'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import PencilKudosIcon from '@/components/icons/pencil-kudos-icon'
import SaaLogoIcon from '@/components/icons/saa-logo-icon'

export default function WidgetButton() {
  const t = useTranslations('home.widget')
  const [showTooltip, setShowTooltip] = useState(false)

  function handleClick() {
    console.warn('[WidgetButton] menu destinations TBD')
    setShowTooltip((prev) => !prev)
  }

  return (
    <div className="fixed right-4 md:right-6 bottom-6 md:bottom-24 z-[var(--z-widget)] flex flex-col items-end gap-2">
      {showTooltip && (
        <div
          role="status"
          className="px-3 py-2 rounded-md bg-[var(--color-bg-header)] text-[var(--color-text-primary)] text-sm shadow-[var(--shadow-widget)]"
        >
          {t('stub_tooltip')}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        aria-label={t('aria_label')}
        className="fixed right-4 md:right-6 bottom-6 md:bottom-24 z-[var(--z-widget)] inline-flex items-center gap-2 w-[106px] h-16 px-4 bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg-hover)] active:bg-[var(--color-cta-bg-active)] text-[var(--color-cta-text)] rounded-[var(--radius-widget)] shadow-[var(--shadow-widget)] transition-all duration-150 hover:scale-[1.03] focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-cta-bg)] focus-visible:outline-offset-2 cursor-pointer"
      >
        <PencilKudosIcon width={24} height={24} />
        <span className="font-bold text-lg leading-none">/</span>
        <SaaLogoIcon width={24} height={24} />
      </button>
    </div>
  )
}
