import KudosSkeleton from '@/components/kudos/shared/KudosSkeleton'

export default function KudosLoading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-dark)' }}>
      <KudosSkeleton />
    </div>
  )
}
