interface Props {
  char?: string
}

export default function DigitTile({ char }: Props) {
  const display = char ?? '-'

  return (
    <div
      data-testid="digit-tile"
      aria-hidden="true"
      className="relative w-[52px] h-[84px] md:w-16 md:h-[102px] lg:w-[76.8px] lg:h-[122.88px] rounded-[var(--radius-tile-prelaunch)]"
    >
      <div
        data-testid="digit-tile-glass"
        className="absolute inset-0 rounded-[var(--radius-tile-prelaunch)] border-[0.75px] border-[var(--color-tile-border)] bg-gradient-to-b from-[var(--color-tile-fill-top)] to-[var(--color-tile-fill-bottom)] opacity-50 backdrop-blur-[24.96px]"
      />
      <span
        data-testid="digit-char"
        className="absolute inset-0 flex items-center justify-center font-bold text-white"
        style={{
          fontFamily: 'var(--font-digital), monospace',
          fontSize: 'clamp(36px, 9vw, 73.728px)',
          letterSpacing: '0',
        }}
      >
        {display}
      </span>
    </div>
  )
}
