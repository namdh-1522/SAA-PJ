'use client'

import KudosLeaderboard from '@/components/kudos/panel/KudosLeaderboard'
import KudosStatsCard from '@/components/kudos/panel/KudosStatsCard'
import type { KudosUser } from '@/types/kudos'

interface KudosRightPanelProps {
  currentUser: KudosUser
}

export default function KudosRightPanel({ currentUser }: KudosRightPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <KudosStatsCard userId={currentUser.id} />
      <KudosLeaderboard />
    </div>
  )
}
