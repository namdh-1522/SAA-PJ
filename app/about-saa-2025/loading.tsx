import LoadingSpinner from '@/components/ui/loading-spinner'

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] overflow-x-hidden">
      <div className="fixed top-0 w-full h-20 z-[var(--z-header)] bg-[var(--color-bg-header)]" />
      <main className="pt-20 px-4 md:px-12 xl:px-36 flex flex-col gap-[120px] pb-24">
        <div className="min-h-[720px] md:min-h-[900px] rounded-xl animate-pulse bg-[var(--color-bg-dark-alt)]" />
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
