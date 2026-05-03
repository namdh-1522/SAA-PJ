export const PAGE_SIZE = 5

export const STALE_TIME_FEED = 30_000       // 30s — feed refreshes often
export const STALE_TIME_HIGHLIGHTS = 5 * 60_000  // 5 min
export const STALE_TIME_STATS = 2 * 60_000  // 2 min
export const STALE_TIME_HASHTAGS = 5 * 60_000
export const STALE_TIME_DEPARTMENTS = 10 * 60_000
export const STALE_TIME_LEADERBOARD = 2 * 60_000

export const DEBOUNCE_MS = 300
export const CAROUSEL_INTERVAL_MS = 5_000
export const AVATAR_HOVER_DELAY_MS = 300
export const COPY_LINK_RESET_MS = 2_000
export const REALTIME_CHANNEL = 'kudos-live'
export const REALTIME_DEDUP_WINDOW_MS = 1_000

export const CONTENT_MAX_LINES = 5
export const HIGHLIGHT_CONTENT_MAX_LINES = 3
export const HIGHLIGHT_LIMIT = 5
export const MAX_HASHTAGS_DISPLAY = 5
export const MAX_IMAGES_DISPLAY = 5
export const TICKER_MAX_ENTRIES = 5
export const LEADERBOARD_LIMIT = 10
export const SUNNER_SEARCH_MAX_LENGTH = 100
/** Recent kudos scanned to build default Spotlight word-cloud (unique senders + receivers). */
export const SPOTLIGHT_RECENT_KUDOS = 40

/** Default department for newly-provisioned users. Google OAuth doesn't expose
 *  Sun*'s internal `department_code`, so until an admin assigns the real one
 *  every fresh profile lands here. Constant rather than env so it ships with
 *  the seed migration that guarantees the row exists in `departments`. */
export const DEFAULT_DEPARTMENT_CODE = 'CEVC1'
