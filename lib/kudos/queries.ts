import { type SupabaseClient } from '@supabase/supabase-js'
import { HIGHLIGHT_LIMIT, PAGE_SIZE, SPOTLIGHT_RECENT_KUDOS } from '@/lib/kudos/constants'
import { sanitizeKudosContent } from '@/lib/kudos/sanitize-content'
import type {
  Kudos,
  KudosFeedPage,
  KudosHighlight,
  KudosStats,
  KudosUser,
  LeaderboardEntry,
  Hashtag,
  Department,
  SecretBox,
  KudoCreateInput,
  KudoCreateResult,
} from '@/types/kudos'

/** Shape returned by `/api/kudos/spotlight-sunners` — sunner search rows + the
 *  count of kudos received within the spotlight window. The cloud uses the
 *  count for proportional font sizing and to pick the top recipient. */
export type SpotlightSunnerRow = Pick<KudosUser, 'id' | 'name' | 'avatarUrl' | 'department'> & {
  kudosReceived: number
}

// ─── View row shape (snake_case, flat) ───────────────────────────────────────
type KudosViewRow = {
  id: string
  sender_id: string
  receiver_id: string
  title: string
  content: string
  image_urls: string[] | null
  created_at: string
  updated_at: string
  heart_count: number | null
  hashtag_names: string[] | null
  sender_name: string | null
  sender_avatar_url: string | null
  sender_dept_code: string | null
  receiver_name: string | null
  receiver_avatar_url: string | null
  receiver_dept_code: string | null
  // Optional alias displayed when `is_anonymous=true`. The view already merges
  // it into `sender_name` (column above) for anonymous viewers, so we only
  // need it on the row shape for type safety / forwards-compat consumers.
  anonymous_nickname?: string | null
  is_anonymous?: boolean | null
}

// ─── Transformers ────────────────────────────────────────────────────────────
// View `kudos_with_stats` returns flat snake_case columns; the frontend Kudos
// type expects camelCase + nested KudosUser objects. Map here once, in one
// place, so every API endpoint serves a consistent shape.
function mapViewRowToKudos(row: KudosViewRow, heartedSet: ReadonlySet<string>): Kudos {
  return {
    id: row.id,
    senderId: row.sender_id,
    sender: {
      id: row.sender_id,
      name: row.sender_name ?? '',
      email: '',
      avatarUrl: row.sender_avatar_url,
      department: row.sender_dept_code,
      starTier: null,
    },
    receiverId: row.receiver_id,
    receiver: {
      id: row.receiver_id,
      name: row.receiver_name ?? '',
      email: '',
      avatarUrl: row.receiver_avatar_url,
      department: row.receiver_dept_code,
      starTier: null,
    },
    title: row.title ?? '',
    content: row.content,
    imageUrls: row.image_urls ?? [],
    // The view exposes only hashtag *names* (denormalised). We reuse the name
    // as id since hashtag chips identify by name in the UI; if we later need
    // the canonical id, swap the `kudos_with_stats` view to also return ids.
    hashtags: (row.hashtag_names ?? []).map((name): Hashtag => ({
      id: name,
      name,
      usageCount: 0,
    })),
    heartCount: row.heart_count ?? 0,
    hasHearted: heartedSet.has(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Bulk lookup of which kudos in `kudosIds` the given user has already hearted.
// Returning a Set keeps the per-row hasHearted check O(1).
async function fetchHeartedSet(
  supabase: SupabaseClient,
  userId: string,
  kudosIds: readonly string[]
): Promise<Set<string>> {
  if (kudosIds.length === 0) return new Set()
  const { data, error } = await supabase
    .from('hearts')
    .select('kudos_id')
    .eq('user_id', userId)
    .in('kudos_id', kudosIds)
  if (error) throw error
  return new Set((data ?? []).map((r) => (r as { kudos_id: string }).kudos_id))
}

// ─── Feed ────────────────────────────────────────────────────────────────────
type KudosFeedParams = {
  page?: number
  hashtag?: string | null
  dept?: string | null
}

export async function fetchKudosFeed(
  supabase: SupabaseClient,
  userId: string,
  { page = 1, hashtag, dept }: KudosFeedParams = {}
): Promise<KudosFeedPage> {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('kudos_with_stats')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (hashtag) {
    query = query.contains('hashtag_names', [hashtag])
  }
  if (dept) {
    query = query.eq('receiver_dept_code', dept)
  }

  const { data, count, error } = await query
  if (error) throw error

  const rows = (data ?? []) as unknown as KudosViewRow[]
  const heartedSet = await fetchHeartedSet(supabase, userId, rows.map((r) => r.id))

  return {
    data: rows.map((row) => mapViewRowToKudos(row, heartedSet)),
    nextPage: count && from + PAGE_SIZE < count ? page + 1 : null,
    total: count ?? 0,
  }
}

export async function fetchKudosById(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<Kudos | null> {
  const { data, error } = await supabase
    .from('kudos_with_stats')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null

  const row = data as unknown as KudosViewRow
  const heartedSet = await fetchHeartedSet(supabase, userId, [row.id])
  return mapViewRowToKudos(row, heartedSet)
}

export async function fetchHighlights(
  supabase: SupabaseClient,
  userId: string,
  { hashtag, dept }: { hashtag?: string | null; dept?: string | null } = {}
): Promise<KudosHighlight[]> {
  // B_Highlight surfaces the top kudos by hearts (most-loved), capped at HIGHLIGHT_LIMIT.
  // `created_at` is a deterministic tiebreaker so the same heart_count produces stable order.
  let query = supabase
    .from('kudos_with_stats')
    .select('*')
    .order('heart_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(HIGHLIGHT_LIMIT)

  if (hashtag) query = query.contains('hashtag_names', [hashtag])
  if (dept) query = query.eq('receiver_dept_code', dept)

  const { data, error } = await query
  if (error) throw error

  const rows = (data ?? []) as unknown as KudosViewRow[]
  const heartedSet = await fetchHeartedSet(supabase, userId, rows.map((r) => r.id))

  return rows.map((row) => ({
    ...mapViewRowToKudos(row, heartedSet),
    featured: false,
  }))
}

type SpotlightKudosRow = {
  receiver_id: string
  receiver_name: string | null
  receiver_avatar_url: string | null
  receiver_dept_code: string | null
}

/** Unique receivers from recent kudos for the Spotlight word-cloud when search is empty.
 *
 *  Senders are intentionally excluded — the board celebrates people being
 *  recognised, not the people doing the recognising. Recent-activity ticker
 *  (separate component) is the place where senders show up.
 *
 *  Honours the same `hashtag` / `dept` filters as the highlights and feed
 *  queries so toggling a filter at the page level narrows the cloud too.
 *  `dept` matches `receiver_dept_code` (consistent with `fetchHighlights` /
 *  `fetchKudosFeed`). */
export async function fetchSpotlightSunners(
  supabase: SupabaseClient,
  { hashtag, dept }: { hashtag?: string | null; dept?: string | null } = {}
): Promise<SpotlightSunnerRow[]> {
  let query = supabase
    .from('kudos_with_stats')
    .select('receiver_id, receiver_name, receiver_avatar_url, receiver_dept_code')
    .order('created_at', { ascending: false })
    .limit(SPOTLIGHT_RECENT_KUDOS)

  if (hashtag) query = query.contains('hashtag_names', [hashtag])
  if (dept) query = query.eq('receiver_dept_code', dept)

  const { data, error } = await query
  if (error) throw error

  const rows = (data ?? []) as unknown as SpotlightKudosRow[]
  const byId = new Map<string, SpotlightSunnerRow>()

  for (const r of rows) {
    if (!r.receiver_id) continue
    const existing = byId.get(r.receiver_id)
    if (existing) {
      byId.set(r.receiver_id, { ...existing, kudosReceived: existing.kudosReceived + 1 })
    } else {
      byId.set(r.receiver_id, {
        id: r.receiver_id,
        name: r.receiver_name ?? '',
        avatarUrl: r.receiver_avatar_url,
        department: r.receiver_dept_code,
        kudosReceived: 1,
      })
    }
  }

  return [...byId.values()]
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export async function fetchKudosTotal(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('kudos')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export async function fetchUserStats(
  supabase: SupabaseClient,
  userId: string
): Promise<KudosStats> {
  const { data, error } = await supabase
    .from('user_kudos_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  // Users with zero activity may not have a row in the view (LEFT JOIN of
  // auth.users always returns a row, but we still defend defensively).
  return {
    kudosReceived: data?.kudos_received ?? 0,
    kudosSent: data?.kudos_sent ?? 0,
    hearts: data?.hearts ?? 0,
    secretBoxOpened: data?.secret_box_opened ?? 0,
    secretBoxClosed: data?.secret_box_closed ?? 0,
  }
}

export async function fetchTopSunners(
  supabase: SupabaseClient,
  limit = 10
): Promise<LeaderboardEntry[]> {
  // user_kudos_stats is a VIEW — PostgREST cannot embed `profiles(...)` because
  // views have no foreign keys. Fetch the leaderboard rankings first, then
  // resolve display info from `profiles` in a second round-trip.
  const { data: stats, error: statsErr } = await supabase
    .from('user_kudos_stats')
    .select('user_id, kudos_received')
    .order('kudos_received', { ascending: false })
    .limit(limit)
  if (statsErr) throw statsErr

  const rows = (stats ?? []) as Array<{ user_id: string; kudos_received: number | null }>
  if (rows.length === 0) return []

  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, department_code, star_tier')
    .in('id', rows.map((r) => r.user_id))
  if (profErr) throw profErr

  type ProfileRow = {
    id: string
    full_name: string | null
    avatar_url: string | null
    department_code: string | null
    star_tier: 1 | 2 | 3 | null
  }
  const profileMap = new Map<string, ProfileRow>(
    ((profiles ?? []) as ProfileRow[]).map((p) => [p.id, p])
  )

  return rows.map((row, i) => {
    const p = profileMap.get(row.user_id)
    return {
      rank: i + 1,
      user: {
        id: row.user_id,
        name: p?.full_name ?? '',
        email: '',
        avatarUrl: p?.avatar_url ?? null,
        department: p?.department_code ?? null,
        starTier: p?.star_tier ?? null,
      },
      kudosReceived: row.kudos_received ?? 0,
    }
  })
}

// ─── Reference data ──────────────────────────────────────────────────────────
export async function fetchHashtags(supabase: SupabaseClient): Promise<Hashtag[]> {
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, name, usage_count')
    .order('usage_count', { ascending: false })
    .limit(20)
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    usageCount: r.usage_count ?? 0,
  }))
}

export async function fetchDepartments(supabase: SupabaseClient): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('id, name, code')
    .order('name')
  if (error) throw error
  return (data ?? []) as Department[]
}

export async function fetchNextSecretBox(
  supabase: SupabaseClient,
  userId: string
): Promise<SecretBox | null> {
  const { data, error } = await supabase
    .from('secret_boxes')
    .select('*')
    .eq('owner_id', userId)
    .eq('opened', false)
    .order('created_at')
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as SecretBox | null
}

// ─── Compose: create a new Kudo ──────────────────────────────────────────────
// Used by `POST /api/kudos`. RLS on `kudos` enforces sender_id = auth.uid().
// Hashtags are looked up by name (case-insensitive); unknown names are filtered out
// silently — the form should only allow selecting from `/api/hashtags` results.
export async function createKudo(
  supabase: SupabaseClient,
  senderId: string,
  input: KudoCreateInput
): Promise<KudoCreateResult> {
  // 1) Insert kudos row.
  //    `content` is sanitised against the kudos HTML allow-list (`b/i/s/u/strong/em/strike/br/p/div/span`,
  //    no attributes) so any markup that survives storage is safe to render via
  //    `dangerouslySetInnerHTML` on the feed cards.
  const { data: kudosRow, error: insertError } = await supabase
    .from('kudos')
    .insert({
      sender_id: senderId,
      receiver_id: input.receiverId,
      title: input.title,
      content: sanitizeKudosContent(input.content),
      image_urls: input.imageUrls,
      is_anonymous: input.isAnonymous,
      // Anonymous alias is only persisted when the sender opted in. When
      // unchecked we explicitly write '' so an old (then-unchecked) value can
      // never leak the next time the same draft cycles through.
      anonymous_nickname: input.isAnonymous
        ? (input.anonymousNickname ?? '').trim()
        : '',
    })
    .select('id, created_at')
    .single()

  if (insertError) throw insertError
  const kudosId = (kudosRow as { id: string; created_at: string }).id
  const createdAt = (kudosRow as { id: string; created_at: string }).created_at

  // 2) Resolve hashtag names → ids and insert join rows.
  //    Hashtags are OPTIONAL — when none are supplied, skip the resolve/insert
  //    pass entirely and return the kudos as-is.
  if (input.hashtags.length > 0) {
    const { data: tagRows, error: tagError } = await supabase
      .from('hashtags')
      .select('id, name')
      .in('name', input.hashtags as string[])
    if (tagError) {
      await supabase.from('kudos').delete().eq('id', kudosId)
      throw tagError
    }

    const tagIds = ((tagRows ?? []) as Array<{ id: string; name: string }>).map((r) => r.id)
    if (tagIds.length > 0) {
      const { error: linkError } = await supabase
        .from('kudos_hashtags')
        .insert(tagIds.map((hashtag_id) => ({ kudos_id: kudosId, hashtag_id })))
      if (linkError) {
        // Best-effort rollback. RLS allows the sender to DELETE their own kudos via the
        // user-owned policy created in 20260429000002, but if that fails we still surface
        // the original error so the caller knows what happened.
        await supabase.from('kudos').delete().eq('id', kudosId)
        throw linkError
      }
    }
    // Note: unrecognised hashtag names are silently dropped (the kudos still
    // ships). This avoids surfacing 500s when the client picks tags that have
    // not yet been promoted from `useCount > 0` server-side.
  }

  return { id: kudosId, createdAt }
}
