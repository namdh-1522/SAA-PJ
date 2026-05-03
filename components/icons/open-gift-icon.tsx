import type { SVGProps } from 'react'

export default function OpenGiftIcon({
  width = 24,
  height = 24,
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
      <rect x="2" y="7" width="20" height="3" rx="1" fill="#FFEA9E" />
      <rect x="4" y="10" width="16" height="11" rx="1" fill="#FFEA9E" />
      <path
        d="M12 7v14M2 10h20"
        stroke="#00101A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 7c0 0-2-4 0-4s2 4 0 4z"
        fill="#FFEA9E"
        stroke="#00101A"
        strokeWidth="1"
      />
      <path
        d="M12 7c0 0 2-4 0-4s-2 4 0 4z"
        fill="#FFEA9E"
        stroke="#00101A"
        strokeWidth="1"
      />
    </svg>
  )
}
