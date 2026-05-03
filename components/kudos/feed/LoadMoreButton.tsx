import { useTranslations } from 'next-intl'

interface LoadMoreButtonProps {
  onClick: () => void
  isLoading: boolean
  hasMore: boolean
  error: boolean
}

export default function LoadMoreButton({ onClick, isLoading, hasMore, error }: LoadMoreButtonProps) {
  const t = useTranslations('kudos.feed')

  if (!hasMore && !error) return null

  return (
    <div className="flex justify-center py-[24px]">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-[8px] px-[32px] py-[14px] font-bold text-[16px] leading-[24px] tracking-[0.5px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        style={{
          background: 'rgba(255, 234, 158, 0.10)',
          border: '1px solid var(--color-cta-outline-border)',
          borderRadius: 'var(--radius-kudos-pill-lg)',
          color: 'var(--color-cta-bg)',
        }}
      >
        {isLoading ? (
          <>
            <span
              className="w-[16px] h-[16px] rounded-full border-2 border-current border-t-transparent animate-spin"
              aria-hidden="true"
            />
            {t('load_more_loading')}
          </>
        ) : error ? (
          t('load_more_retry')
        ) : (
          t('load_more')
        )}
      </button>
    </div>
  )
}
