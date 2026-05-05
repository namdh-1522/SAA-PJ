import LoadingSpinner from '@/components/ui/loading-spinner'

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] overflow-x-hidden">
      <div className="fixed top-0 w-full h-20 z-[var(--z-header)] bg-[var(--color-bg-header)]" />
      <div className="h-[547px] animate-pulse bg-[var(--color-bg-dark-alt)]" />
      <main className="px-4 md:px-12 xl:px-36 pt-16 pb-24 flex flex-col gap-[120px]">
        <div className="flex flex-col gap-4 w-full">
          <div className="h-8 w-64 mx-auto rounded animate-pulse bg-[var(--color-bg-dark-alt)]" />
          <div className="h-px w-full bg-[var(--color-divider)]" />
          <div className="h-16 w-96 mx-auto rounded animate-pulse bg-[var(--color-bg-dark-alt)]" />
        </div>
        <div className="flex flex-col gap-20">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl animate-pulse bg-[var(--color-bg-dark-alt)]" />
          ))}
        </div>
      </main>
      <div
        className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
        style={{ color: 'var(--color-cta-bg)' }}
      >
        <LoadingSpinner size={56} />
      </div>
    </div>
  )
}
