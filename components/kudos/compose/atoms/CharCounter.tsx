interface CharCounterProps {
  current: number
  max: number
}

export default function CharCounter({ current, max }: CharCounterProps) {
  const atLimit = current >= max
  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className="font-medium"
      style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: '14px',
        fontWeight: 500,
        color: atLimit
          ? 'var(--color-kudos-compose-required)'
          : 'var(--color-kudos-compose-text-secondary)',
      }}
    >
      {current}/{max}
    </span>
  )
}
