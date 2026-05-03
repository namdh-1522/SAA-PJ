import type { SVGProps } from 'react'

/** MM_MEDIA_ChevronLeft — design-style Sun* Kudos Live board B.2 / B.5 */
export default function ChevronLeftIcon({
  width = 24,
  height = 24,
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M14 7L9 12L14 17"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
