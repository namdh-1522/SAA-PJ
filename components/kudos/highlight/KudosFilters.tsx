'use client'

import { useQuery } from '@tanstack/react-query'
import KudosDeptDropdown from '@/components/kudos/highlight/KudosDeptDropdown'
import KudosHashtagDropdown from '@/components/kudos/highlight/KudosHashtagDropdown'
import { useKudosFilters } from '@/hooks/kudos/use-kudos-filters'
import { STALE_TIME_HASHTAGS, STALE_TIME_DEPARTMENTS } from '@/lib/kudos/constants'
import type { Hashtag, Department } from '@/types/kudos'

async function fetchHashtags(): Promise<Hashtag[]> {
  const res = await fetch('/api/hashtags')
  if (!res.ok) throw new Error('Failed to fetch hashtags')
  return res.json()
}

async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch('/api/departments')
  if (!res.ok) throw new Error('Failed to fetch departments')
  return res.json()
}

export default function KudosFilters() {
  const { hashtag, dept, setHashtag, setDept } = useKudosFilters()

  const { data: hashtags = [] } = useQuery<Hashtag[]>({
    queryKey: ['kudos-hashtags'],
    queryFn: fetchHashtags,
    staleTime: STALE_TIME_HASHTAGS,
  })

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['kudos-departments'],
    queryFn: fetchDepartments,
    staleTime: STALE_TIME_DEPARTMENTS,
  })

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {hashtags.length > 0 && (
        // B.1.1 Hashtag — Figma `JWpsISMAaM`. Custom popover (not native
        // <select>) so the active row can render the gold-glow text-shadow
        // shown in the design.
        <KudosHashtagDropdown
          hashtags={hashtags}
          value={hashtag}
          onChange={setHashtag}
        />
      )}

      {departments.length > 0 && (
        // B.1.2 Phòng ban — Figma `WXK5AYB_rG`. Custom popover (not native
        // <select>) so the active row can render the gold-glow text-shadow
        // shown in the design.
        <KudosDeptDropdown
          departments={departments}
          value={dept}
          onChange={setDept}
        />
      )}
    </div>
  )
}
