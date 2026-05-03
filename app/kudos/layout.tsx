import { Suspense } from 'react'
import KudosSkeleton from '@/components/kudos/shared/KudosSkeleton'

export default function KudosLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<KudosSkeleton />}>
      {children}
    </Suspense>
  )
}
