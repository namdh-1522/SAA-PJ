interface UkFlagIconProps {
  className?: string
  width?: number
  height?: number
}

// United Kingdom Union Jack — rendered into the same 24×24 box used by other
// flag icons, with the visible 20×15 flag centred (matching vn-flag-icon.tsx).
// Frame hUyaaugye2 (Language Dropdown) — spec FR-012.
export default function UkFlagIcon({
  className,
  width = 20,
  height = 15,
}: UkFlagIconProps) {
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
      <g clipPath="url(#uk-flag-clip)">
        {/* Blue field */}
        <rect x="2" y="5" width="20" height="15" fill="#012169" />
        {/* White diagonals (Saint Andrew's Saltire fimbriation) */}
        <path
          d="M2 5 L22 20 M22 5 L2 20"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        {/* Red diagonals (Saint Patrick's Saltire) — sit on top of the white,
            slightly thinner so the white "fimbriation" remains visible */}
        <g clipPath="url(#uk-flag-clip)">
          <path
            d="M2 5 L22 20 M22 5 L2 20"
            stroke="#C8102E"
            strokeWidth="1.2"
          />
        </g>
        {/* White cross of Saint George (vertical + horizontal fimbriation) */}
        <path
          d="M12 5 V20 M2 12.5 H22"
          stroke="#FFFFFF"
          strokeWidth="5"
        />
        {/* Red cross of Saint George (overlay) */}
        <path
          d="M12 5 V20 M2 12.5 H22"
          stroke="#C8102E"
          strokeWidth="3"
        />
      </g>
      <defs>
        <clipPath id="uk-flag-clip">
          <rect x="2" y="5" width="20" height="15" />
        </clipPath>
      </defs>
    </svg>
  )
}
