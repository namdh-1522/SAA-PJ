interface LoadingSpinnerProps {
  /** Outer diameter in px. Defaults to 32. */
  size?: number
  /** Border thickness in px. Defaults to size/8 (≈4px @ size 32). */
  thickness?: number
  /** Tailwind / utility class merged onto the spinner. Use to override
   *  color via `text-…` (the spinner uses `currentColor`). */
  className?: string
  /** Optional centred caption shown under the spinner. */
  label?: string
}

/** Generic accessible loading spinner. Inherits `currentColor`, so wrap in
 *  a coloured parent (e.g. `<div className="text-[var(--color-cta-bg)]">`).
 *  Used by route-level `loading.tsx` files for screens that fetch multiple
 *  APIs in parallel. */
export default function LoadingSpinner({
  size = 32,
  thickness,
  className = '',
  label,
}: LoadingSpinnerProps) {
  const border = thickness ?? Math.max(2, Math.round(size / 8))
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} role="status">
      <span
        className="inline-block rounded-full border-current border-t-transparent animate-spin"
        style={{
          width: size,
          height: size,
          borderWidth: border,
        }}
        aria-hidden="true"
      />
      {label ? (
        <span className="text-sm font-medium" aria-live="polite">
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading…</span>
      )}
    </div>
  )
}
