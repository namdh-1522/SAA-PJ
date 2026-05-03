import { type ReactNode } from 'react'

interface FormLabelProps {
  htmlFor?: string
  required?: boolean
  children: ReactNode
}

export default function FormLabel({ htmlFor, required = false, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="inline-flex items-center gap-[2px] font-bold"
      style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: 'var(--text-kudos-compose-label-size)',
        lineHeight: 'var(--text-kudos-compose-label-lh)',
        color: 'var(--color-kudos-compose-text)',
      }}
    >
      {children}
      {required && (
        <span
          aria-hidden="true"
          className="font-bold"
          style={{
            color: 'var(--color-kudos-compose-required)',
            fontSize: '16px',
            lineHeight: '20px',
          }}
        >
          *
        </span>
      )}
    </label>
  )
}
