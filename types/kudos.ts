export interface KudosUser {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly avatarUrl: string | null
  readonly department: string | null
  readonly starTier: 1 | 2 | 3 | null
}

export interface Hashtag {
  readonly id: string
  readonly name: string
  readonly usageCount: number
}

export interface Department {
  readonly id: string
  readonly name: string
  readonly code: string
}

export interface Heart {
  readonly id: string
  readonly kudosId: string
  readonly userId: string
  readonly weight: 1 | 2
  readonly createdAt: string
}

export interface Kudos {
  readonly id: string
  readonly senderId: string
  readonly sender: KudosUser
  readonly receiverId: string
  readonly receiver: KudosUser
  // Danh hiệu — short uppercase headline rendered above content. Required by
  // the kudos table (NOT NULL CHECK len > 0); see migration `20260429_kudos_compose`.
  readonly title: string
  readonly content: string
  readonly imageUrls: readonly string[]
  readonly hashtags: readonly Hashtag[]
  readonly heartCount: number
  readonly hasHearted: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

export interface KudosHighlight extends Kudos {
  readonly featured: boolean
}

export interface SecretBox {
  readonly id: string
  readonly ownerId: string
  readonly opened: boolean
  readonly openedAt: string | null
  readonly createdAt: string
}

export interface TickerEvent {
  readonly type: 'kudos.new' | 'kudos.liked' | 'secretBox.opened'
  readonly ts: string
  readonly payload: {
    readonly kudosId: string
    readonly senderName?: string
    readonly receiverName?: string
    readonly content?: string
    readonly heartCount?: number
  }
}

export interface KudosStats {
  readonly kudosReceived: number
  readonly kudosSent: number
  readonly hearts: number
  readonly secretBoxOpened: number
  readonly secretBoxClosed: number
}

export interface LeaderboardEntry {
  readonly rank: number
  readonly user: KudosUser
  readonly kudosReceived: number
}

export interface KudosFilters {
  readonly hashtag: string | null
  readonly dept: string | null
}

export type KudosQueryKey =
  | readonly ['kudos-feed', KudosFilters, number]
  | readonly ['kudos-highlights', KudosFilters]
  | readonly ['kudos-total']
  | readonly ['kudos-stats', string]
  | readonly ['kudos-leaderboard']
  | readonly ['kudos-hashtags']
  | readonly ['kudos-departments']
  | readonly ['kudos-sunner-search', string]

export interface KudosFeedPage {
  readonly data: readonly Kudos[]
  readonly nextPage: number | null
  readonly total: number
}

export interface HeartToggleResult {
  readonly weight: 1 | 2
  readonly totalHearts: number
  readonly hasHearted: boolean
}

// ─── Compose (Viết Kudo) ─────────────────────────────────────────────────────

export interface KudoCreateInput {
  readonly receiverId: string
  readonly title: string
  readonly content: string // MVP: plain string (HTML or text); rich-text JSON storage is follow-up
  readonly hashtags: readonly string[]
  readonly imageUrls: readonly string[]
  readonly isAnonymous: boolean
  /** Optional display name shown in place of the sender when `isAnonymous=true`.
   *  Empty string ⇒ fall back to a generic "Ẩn danh" label. Ignored when not
   *  anonymous. */
  readonly anonymousNickname?: string
}

export interface KudoCreateResult {
  readonly id: string
  readonly createdAt: string
}

export type ImageUploadStatus =
  | { readonly status: 'idle' }
  | { readonly status: 'uploading'; readonly progress: number }
  | { readonly status: 'success'; readonly url: string; readonly path: string }
  | { readonly status: 'error'; readonly message: string }

export interface StagedImage {
  readonly id: string // local id (uuid) — used as React key and for cancellation
  readonly file: File
  readonly state: ImageUploadStatus
}

export interface KudoComposeFormState {
  readonly receiverId: string
  readonly title: string
  readonly content: string
  readonly hashtags: readonly string[]
  readonly imageUrls: readonly string[]
  readonly isAnonymous: boolean
  /** Optional alias displayed instead of the sender's real name. Only sent
   *  to the API when `isAnonymous` is true. */
  readonly anonymousNickname: string
}
