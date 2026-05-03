interface ChevronDownIconProps {
  className?: string
  width?: number
  height?: number
}

export default function ChevronDownIcon({ className, width = 24, height = 24 }: ChevronDownIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
    </svg>
  )
}
