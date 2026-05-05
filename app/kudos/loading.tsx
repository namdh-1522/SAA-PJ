import KudosSkeleton from '@/components/kudos/shared/KudosSkeleton'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function KudosLoading() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg-dark)' }}>
      <KudosSkeleton />
      {/* Centred spinner overlay — gives users a clear "loading" affordance
          while the 8 parallel /api/kudos/* queries warm up. The skeleton
          stays visible underneath as a layout placeholder. */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
        style={{ color: 'var(--color-cta-bg)' }}
      >
        <LoadingSpinner size={56} label="Đang tải dữ liệu Kudos…" />
      </div>
    </div>
  )
}
