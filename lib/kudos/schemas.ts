import { z } from 'zod'
import { stripHtmlTags } from '@/lib/kudos/sanitize-content'

export const KudosFeedQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((v) => (v !== undefined ? parseInt(v, 10) : 1))
      .pipe(z.number().int().min(1)),
    hashtag: z.string().optional().nullable().default(null),
    dept: z.string().optional().nullable().default(null),
  })
  .strip()

export const KudosLikeBodySchema = z.object({
  kudosId: z.string().min(1),
})

export const KudosTotalResponseSchema = z.object({
  total: z.number().int().min(0),
})

export const SunnerSearchQuerySchema = z.object({
  q: z.string().max(100).default(''),
})

export const FiltersQuerySchema = z.object({
  hashtag: z.string().optional().nullable().default(null),
  dept: z.string().optional().nullable().default(null),
})

export const KudosHighlightsQuerySchema = FiltersQuerySchema

export const KudosStatsResponseSchema = z.object({
  kudosReceived: z.number().int().min(0),
  kudosSent: z.number().int().min(0),
  hearts: z.number().int().min(0),
  secretBoxOpened: z.number().int().min(0),
  secretBoxClosed: z.number().int().min(0),
})

// ─── Compose (Viết Kudo, frame ihQ26W78P2) ───────────────────────────────────
// MVP: content is a plain string (HTML or plain text from Tiptap.getHTML()/getText()),
// constrained to 2000 chars to match the existing `kudos.content` column.
// Rich-text JSON storage is a follow-up tied to US4 (full toolbar rendering on feed).
export const KudosCreateBodySchema = z.object({
  receiverId: z.string().uuid(),
  title: z
    .string()
    .trim()
    .min(1, 'title_required')
    .max(100, 'title_too_long'),
  // Accept HTML up to a generous cap to prevent DOS, then validate the
  // *visible text* length against the same 2000-char limit users see in the
  // editor. `<b></b>` counts as 0 typed chars, not 7.
  content: z
    .string()
    .max(20_000, 'content_too_long')
    .refine((v) => stripHtmlTags(v).trim().length >= 1, { message: 'content_required' })
    .refine((v) => stripHtmlTags(v).length <= 2000, { message: 'content_too_long' }),
  hashtags: z
    .array(z.string().min(1).max(64))
    .max(5, 'hashtag_max')
    .default([]),
  imageUrls: z.array(z.string().url()).max(5, 'image_max').default([]),
  isAnonymous: z.boolean().default(false),
  // Free-text alias rendered instead of the real sender name when anonymous.
  // Length cap = 50 chars to stay legible inside the avatar caption. The
  // requirement that anonymous senders MUST pick an alias is enforced via the
  // `.superRefine` below so the empty-string default still validates when the
  // sender isn't anonymous.
  anonymousNickname: z.string().max(50, 'anon_nickname_too_long').default(''),
}).superRefine((data, ctx) => {
  // PNG `5c7PkAibyD`: when "Gửi ẩn danh" is on, the nickname row appears
  // marked with a required asterisk. Mirror that in validation so anonymous
  // submits without a nickname surface a field-level error rather than
  // silently shipping an empty alias.
  if (data.isAnonymous && data.anonymousNickname.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['anonymousNickname'],
      message: 'anon_nickname_required',
    })
  }
})

export const MediaUploadResponseSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
})

export type KudosFeedQuery = z.infer<typeof KudosFeedQuerySchema>
export type KudosLikeBody = z.infer<typeof KudosLikeBodySchema>
export type KudosTotalResponse = z.infer<typeof KudosTotalResponseSchema>
export type SunnerSearchQuery = z.infer<typeof SunnerSearchQuerySchema>
export type FiltersQuery = z.infer<typeof FiltersQuerySchema>
export type KudosStatsResponse = z.infer<typeof KudosStatsResponseSchema>
export type KudosCreateBody = z.infer<typeof KudosCreateBodySchema>
export type MediaUploadResponse = z.infer<typeof MediaUploadResponseSchema>
