import DigitTile from './digit-tile'

interface Props {
  value: number | '--'
  label: string
}

function pad(value: number | '--'): [string, string] {
  if (value === '--') return ['-', '-']
  if (value > 99) {
    console.warn('CountdownUnit value exceeds 99, clamping to 99')
    return ['9', '9']
  }
  const s = String(Math.floor(value)).padStart(2, '0')
  return [s[0], s[1]]
}

export default function CountdownUnit({ value, label }: Props) {
  const [tens, ones] = pad(value)

  return (
    <div className="flex flex-col items-start justify-center gap-3 md:gap-4 lg:gap-[var(--spacing-prelaunch-unit-stack-gap)] w-auto lg:w-[175px]">
      <div className="flex flex-row gap-2 md:gap-[14px] lg:gap-[var(--spacing-prelaunch-digits-gap)]">
        <DigitTile char={tens} />
        <DigitTile char={ones} />
      </div>
      <span
        className="text-white font-bold"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: 'clamp(20px, 4vw, 36px)',
          lineHeight: 'clamp(28px, 5vw, 48px)',
          letterSpacing: '0',
        }}
      >
        {label}
      </span>
    </div>
  )
}
