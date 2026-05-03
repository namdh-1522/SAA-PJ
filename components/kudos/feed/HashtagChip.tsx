interface HashtagChipProps {
  tag: string
  onClick?: (tag: string) => void
  className?: string
}

export default function HashtagChip({ tag, onClick, className = '' }: HashtagChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(tag)}
      className={`inline-flex items-center px-[12px] py-[4px] text-[16px] font-bold leading-[24px] tracking-[0.5px] cursor-pointer transition-colors ${className}`}
      style={{
        background: 'rgba(255, 234, 158, 0.10)',
        border: '1px solid var(--color-cta-outline-border)',
        borderRadius: 'var(--radius-kudos-pill-md)',
        color: 'var(--color-cta-bg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 234, 158, 0.20)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 234, 158, 0.10)'
      }}
    >
      #{tag}
    </button>
  )
}
