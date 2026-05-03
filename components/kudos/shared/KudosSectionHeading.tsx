interface KudosSectionHeadingProps {
  caption: string
  title: string
  compact?: boolean
}

/** B.1 / C.1 headers — Figma `--text-stat-md` caption + `--text-h1` section title (#FFEA9E). */
export default function KudosSectionHeading({ caption, title, compact }: KudosSectionHeadingProps) {
  const titleSize = compact
    ? 'text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1]'
    : 'text-[36px] sm:text-[48px] md:text-[57px] md:leading-[64px] leading-[1.05] font-bold tracking-[-0.25px]'

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p
        className="text-[20px] font-bold leading-[32px] sm:text-[24px]"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {caption}
      </p>
      <h2
        className={`${titleSize} uppercase`}
        style={{ color: 'var(--color-cta-bg)' }}
      >
        {title}
      </h2>
    </div>
  )
}
