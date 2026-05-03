import { describe, it, expect } from 'vitest'
import {
  KudosFeedQuerySchema,
  KudosLikeBodySchema,
  KudosTotalResponseSchema,
  SunnerSearchQuerySchema,
  FiltersQuerySchema,
  KudosHighlightsQuerySchema,
  KudosStatsResponseSchema,
  KudosCreateBodySchema,
  MediaUploadResponseSchema,
} from '@/lib/kudos/schemas'

describe('KudosFeedQuerySchema', () => {
  it('accepts valid params', () => {
    expect(KudosFeedQuerySchema.parse({ page: '2', hashtag: 'teamwork', dept: 'CECV2' })).toEqual({
      page: 2,
      hashtag: 'teamwork',
      dept: 'CECV2',
    })
  })

  it('defaults page to 1 when not provided', () => {
    expect(KudosFeedQuerySchema.parse({}).page).toBe(1)
  })

  it('rejects page < 1', () => {
    expect(() => KudosFeedQuerySchema.parse({ page: '0' })).toThrow()
  })

  it('strips unknown fields', () => {
    const result = KudosFeedQuerySchema.parse({ page: '1', unknown: 'field' })
    expect('unknown' in result).toBe(false)
  })
})

describe('KudosLikeBodySchema', () => {
  it('accepts valid kudosId', () => {
    const id = 'some-uuid-1234'
    expect(KudosLikeBodySchema.parse({ kudosId: id })).toEqual({ kudosId: id })
  })

  it('rejects empty kudosId', () => {
    expect(() => KudosLikeBodySchema.parse({ kudosId: '' })).toThrow()
  })

  it('rejects missing kudosId', () => {
    expect(() => KudosLikeBodySchema.parse({})).toThrow()
  })
})

describe('KudosTotalResponseSchema', () => {
  it('accepts valid total', () => {
    expect(KudosTotalResponseSchema.parse({ total: 388 })).toEqual({ total: 388 })
  })

  it('rejects negative total', () => {
    expect(() => KudosTotalResponseSchema.parse({ total: -1 })).toThrow()
  })
})

describe('SunnerSearchQuerySchema', () => {
  it('accepts valid short query', () => {
    expect(SunnerSearchQuerySchema.parse({ q: 'Nguyen' })).toEqual({ q: 'Nguyen' })
  })

  it('rejects query over 100 chars', () => {
    expect(() => SunnerSearchQuerySchema.parse({ q: 'a'.repeat(101) })).toThrow()
  })

  it('defaults q to empty string', () => {
    expect(SunnerSearchQuerySchema.parse({}).q).toBe('')
  })
})

describe('FiltersQuerySchema', () => {
  it('accepts hashtag + dept', () => {
    expect(FiltersQuerySchema.parse({ hashtag: 'teamwork', dept: 'CECV2' })).toEqual({
      hashtag: 'teamwork',
      dept: 'CECV2',
    })
  })

  it('makes both fields optional', () => {
    expect(FiltersQuerySchema.parse({})).toEqual({ hashtag: null, dept: null })
  })
})

describe('KudosHighlightsQuerySchema', () => {
  it('passes through with filters', () => {
    expect(KudosHighlightsQuerySchema.parse({ hashtag: 'leadership' })).toEqual({
      hashtag: 'leadership',
      dept: null,
    })
  })
})

describe('KudosStatsResponseSchema', () => {
  it('validates a full stats object', () => {
    const valid = {
      kudosReceived: 25,
      kudosSent: 25,
      hearts: 1000,
      secretBoxOpened: 3,
      secretBoxClosed: 2,
    }
    expect(KudosStatsResponseSchema.parse(valid)).toEqual(valid)
  })

  it('rejects negative values', () => {
    expect(() =>
      KudosStatsResponseSchema.parse({ kudosReceived: -1, kudosSent: 0, hearts: 0, secretBoxOpened: 0, secretBoxClosed: 0 })
    ).toThrow()
  })
})

// ─── Compose: Viết Kudo (frame ihQ26W78P2) ──────────────────────────────────
describe('KudosCreateBodySchema', () => {
  const validBody = {
    receiverId: '11111111-1111-1111-1111-111111111111',
    title: 'Người truyền động lực cho tôi',
    content: 'Cảm ơn bạn đã hỗ trợ tôi trong dự án vừa rồi!',
    hashtags: ['teamwork'],
    imageUrls: [],
    isAnonymous: false,
  }

  it('accepts a fully-populated valid body', () => {
    expect(KudosCreateBodySchema.parse(validBody)).toMatchObject(validBody)
  })

  it('defaults imageUrls to [] when omitted', () => {
    const { imageUrls: _omit, ...withoutImages } = validBody
    void _omit
    expect(KudosCreateBodySchema.parse(withoutImages).imageUrls).toEqual([])
  })

  it('defaults isAnonymous to false when omitted', () => {
    const { isAnonymous: _omit, ...withoutFlag } = validBody
    void _omit
    expect(KudosCreateBodySchema.parse(withoutFlag).isAnonymous).toBe(false)
  })

  it('rejects when receiverId is not a uuid', () => {
    expect(() =>
      KudosCreateBodySchema.parse({ ...validBody, receiverId: 'not-a-uuid' })
    ).toThrow()
  })

  it('rejects when title is empty after trim', () => {
    const result = KudosCreateBodySchema.safeParse({ ...validBody, title: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'title_required')).toBe(true)
    }
  })

  it('rejects when title exceeds 100 chars', () => {
    const result = KudosCreateBodySchema.safeParse({ ...validBody, title: 'a'.repeat(101) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'title_too_long')).toBe(true)
    }
  })

  it('accepts title at exactly 100 chars', () => {
    expect(KudosCreateBodySchema.parse({ ...validBody, title: 'a'.repeat(100) })).toMatchObject({
      title: 'a'.repeat(100),
    })
  })

  it('rejects when content is empty after trim', () => {
    const result = KudosCreateBodySchema.safeParse({ ...validBody, content: '\n  \t  ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'content_required')).toBe(true)
    }
  })

  it('rejects when content exceeds 2000 chars', () => {
    const result = KudosCreateBodySchema.safeParse({ ...validBody, content: 'a'.repeat(2001) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'content_too_long')).toBe(true)
    }
  })

  it('accepts an empty hashtags array (hashtags are optional)', () => {
    const result = KudosCreateBodySchema.safeParse({ ...validBody, hashtags: [] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.hashtags).toEqual([])
    }
  })

  it('accepts an omitted hashtags property (defaults to [])', () => {
    const { hashtags: _hashtags, ...withoutHashtags } = validBody
    void _hashtags
    const result = KudosCreateBodySchema.safeParse(withoutHashtags)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.hashtags).toEqual([])
    }
  })

  it('rejects when hashtags exceed 5', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      hashtags: ['a', 'b', 'c', 'd', 'e', 'f'],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'hashtag_max')).toBe(true)
    }
  })

  it('accepts exactly 5 hashtags', () => {
    expect(
      KudosCreateBodySchema.parse({
        ...validBody,
        hashtags: ['a', 'b', 'c', 'd', 'e'],
      }).hashtags
    ).toHaveLength(5)
  })

  it('rejects when imageUrls exceed 5', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      imageUrls: Array.from({ length: 6 }, (_, i) => `https://example.com/img${i}.jpg`),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'image_max')).toBe(true)
    }
  })

  it('rejects when an imageUrl is not a valid URL', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      imageUrls: ['not-a-url'],
    })
    expect(result.success).toBe(false)
  })

  // ─── Anonymous + nickname (the bug surfaced in this fix) ──────────────────
  it('accepts an anonymous submit with a nickname', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      isAnonymous: true,
      anonymousNickname: 'Mystery Sun',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.anonymousNickname).toBe('Mystery Sun')
    }
  })

  it('rejects an anonymous submit with an empty nickname (anon_nickname_required)', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      isAnonymous: true,
      anonymousNickname: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'anon_nickname_required')).toBe(true)
    }
  })

  it('rejects an anonymous submit when nickname is whitespace-only', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      isAnonymous: true,
      anonymousNickname: '   ',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'anon_nickname_required')).toBe(true)
    }
  })

  it('accepts a non-anonymous submit even when anonymousNickname is empty', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      isAnonymous: false,
      anonymousNickname: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects when anonymousNickname exceeds 50 chars', () => {
    const result = KudosCreateBodySchema.safeParse({
      ...validBody,
      isAnonymous: true,
      anonymousNickname: 'a'.repeat(51),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'anon_nickname_too_long')).toBe(true)
    }
  })
})

describe('MediaUploadResponseSchema', () => {
  it('accepts a valid response', () => {
    const valid = { url: 'https://example.com/path/img.jpg', path: 'user/img.jpg' }
    expect(MediaUploadResponseSchema.parse(valid)).toEqual(valid)
  })

  it('rejects when url is not a URL', () => {
    expect(() =>
      MediaUploadResponseSchema.parse({ url: 'not-a-url', path: 'user/img.jpg' })
    ).toThrow()
  })

  it('rejects when path is empty', () => {
    expect(() =>
      MediaUploadResponseSchema.parse({ url: 'https://example.com/img.jpg', path: '' })
    ).toThrow()
  })
})
