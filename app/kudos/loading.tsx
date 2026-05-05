import KudosSkeleton from '@/components/kudos/shared/KudosSkeleton'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function KudosLoading() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg-dark)' }}>
      <KudosSkeleton />
      {/* Backdrop — semi-transparent dark + blur over the skeleton so the
          empty card frames don't read as "real but broken". Sits below the
          spinner (z-[99]) but above the skeleton. */}
      <div
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background: 'rgba(0, 16, 26, 0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        aria-hidden="true"
      />
      {/* Centred spinner overlay — gives users a clear "loading" affordance
          while the 8 parallel /api/kudos/* queries warm up. */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
        style={{ color: 'var(--color-cta-bg)' }}
      >
        <LoadingSpinner size={56} label="Đang tải dữ liệu Kudos…" />
      </div>
    </div>
  )
}
