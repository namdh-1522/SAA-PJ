import { useTranslations } from 'next-intl'

export interface CountdownTileProps {
  value: number | '--'
  labelKey: string
}

function pad(value: number | '--'): string {
  if (value === '--') return '--'
  return String(value).padStart(2, '0')
}

const DIGIT_FONT_SIZE = 'clamp(36px, 4.5vw, 49.152px)'

/** Single digit on a dark gradient card. The ghost "8" is rendered via the
 *  `.countdown-digit::before` pseudo-element so it stays visual-only and does
 *  not show up in `textContent` (which the unit tests assert against). */
function DigitCard({ char }: { char: string }) {
  return (
    <div
      className="relative flex items-center justify-center w-[40px] md:w-[48px] lg:w-[51.2px] h-[62px] md:h-[76px] lg:h-[81.92px] overflow-hidden"
      style={{
        borderRadius: '6px',
        background:
          'linear-gradient(180deg, #5A5A5A 10%, #3A3A3A 35%, #222 70%, #111 60%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 234, 158, 0.4), inset 0 -1px 1px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.5)',
      }}
    >
      <span
        className="countdown-digit tabular-nums"
        style={{
          fontFamily: 'var(--font-digital)',
          fontSize: DIGIT_FONT_SIZE,
          lineHeight: 1,
          color: 'rgba(255, 248, 220, 0.95)',
        }}
      >
        {char}
      </span>
    </div>
  )
}

export default function CountdownTile({ value, labelKey }: CountdownTileProps) {
  const t = useTranslations()
  // Figma `Frame 485`: 116.4×81.92 = 2 digit cards with a 14px gap between
  // them ((116.4 − 14) / 2 = 51.2 per card). Each digit lives on its own
  // silver-gradient card (replaces the previous single dark box).
  const chars = pad(value).split('')
  return (
    <div className="flex flex-col items-center gap-[14px]">
      <div
        data-testid="countdown-value"
        className="flex items-center justify-center gap-[10px] md:gap-[12px] lg:gap-[14px]"
      >
        {chars.map((char, i) => (
          <DigitCard key={i} char={char} />
        ))}
      </div>
      <span
        className="text-[var(--color-text-primary)] font-bold uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: 'clamp(16px, 1.8vw, 24px)',
          lineHeight: 'clamp(24px, 2.2vw, 32px)',
          letterSpacing: '0',
        }}
      >
        {t(labelKey)}
      </span>
    </div>
  )
}
