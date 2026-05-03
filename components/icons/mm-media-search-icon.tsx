import type { SVGProps } from 'react'

/** MM_MEDIA_Search — Kudos hero / spotlight (Figma SAA 2025 Live board). */
export default function MmMediaSearchIcon({
  width = 32,
  height = 32,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15 15 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
