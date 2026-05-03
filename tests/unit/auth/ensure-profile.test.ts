/**
 * Unit tests for `ensureProfile` — populates `profiles` from Google OAuth
 * metadata and assigns `DEFAULT_DEPARTMENT_CODE` to first-time users.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { ensureProfile } from '@/lib/auth/ensure-profile'
import { DEFAULT_DEPARTMENT_CODE } from '@/lib/kudos/constants'

interface MockSupabase {
  client: SupabaseClient
  upsert: ReturnType<typeof vi.fn>
  selectMaybeSingle: ReturnType<typeof vi.fn>
}

function makeMockSupabase(existingProfile: Record<string, unknown> | null = null): MockSupabase {
  const upsert = vi.fn().mockResolvedValue({ error: null })
  const selectMaybeSingle = vi.fn().mockResolvedValue({ data: existingProfile, error: null })
  const client = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: selectMaybeSingle,
        })),
      })),
      upsert,
    })),
  } as unknown as SupabaseClient
  return { client, upsert, selectMaybeSingle }
}

const baseUser: Pick<User, 'id' | 'email' | 'user_metadata'> = {
  id: 'user-uuid-1',
  email: 'alice@sun-asterisk.com',
  user_metadata: {
    full_name: 'Alice Nguyen',
    avatar_url: 'https://lh3.googleusercontent.com/a/abc',
  },
}

describe('ensureProfile', () => {
  beforeEach(() => vi.clearAllMocks())

  it('inserts a new profile with full_name + avatar_url + DEFAULT_DEPARTMENT_CODE for first-time users', async () => {
    const { client, upsert } = makeMockSupabase(null)
    await ensureProfile(client, baseUser)
    expect(upsert).toHaveBeenCalledOnce()
    const payload = upsert.mock.calls[0][0]
    expect(payload).toMatchObject({
      id: 'user-uuid-1',
      full_name: 'Alice Nguyen',
      avatar_url: 'https://lh3.googleusercontent.com/a/abc',
      department_code: DEFAULT_DEPARTMENT_CODE,
    })
  })

  it('refreshes full_name + avatar_url for existing profiles WITHOUT clobbering department_code', async () => {
    const { client, upsert } = makeMockSupabase({ department_code: 'CECV2' })
    await ensureProfile(client, baseUser)
    expect(upsert).toHaveBeenCalledOnce()
    const payload = upsert.mock.calls[0][0]
    expect(payload).toMatchObject({
      id: 'user-uuid-1',
      full_name: 'Alice Nguyen',
      avatar_url: 'https://lh3.googleusercontent.com/a/abc',
    })
    // No department_code field — preserves admin-assigned dept
    expect(payload.department_code).toBeUndefined()
  })

  it('falls back to the email when no full_name is provided in metadata', async () => {
    const { client, upsert } = makeMockSupabase(null)
    await ensureProfile(client, {
      ...baseUser,
      user_metadata: { avatar_url: 'https://example.com/x.png' },
    })
    const payload = upsert.mock.calls[0][0]
    expect(payload.full_name).toBe('alice@sun-asterisk.com')
  })

  it('reads name from `name` if `full_name` is missing (alternate OAuth provider shape)', async () => {
    const { client, upsert } = makeMockSupabase(null)
    await ensureProfile(client, {
      ...baseUser,
      user_metadata: { name: 'Bob (legacy)', picture: 'https://example.com/p.png' },
    })
    const payload = upsert.mock.calls[0][0]
    expect(payload.full_name).toBe('Bob (legacy)')
    expect(payload.avatar_url).toBe('https://example.com/p.png')
  })

  it('writes avatar_url=null when no picture is on the metadata', async () => {
    const { client, upsert } = makeMockSupabase(null)
    await ensureProfile(client, {
      ...baseUser,
      user_metadata: { full_name: 'Carol' },
    })
    expect(upsert.mock.calls[0][0].avatar_url).toBeNull()
  })

  it('returns silently and skips the upsert when the SELECT errors', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    const client = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'relation profiles does not exist' },
            }),
          })),
        })),
        upsert,
      })),
    } as unknown as SupabaseClient
    await expect(ensureProfile(client, baseUser)).resolves.toBeUndefined()
    expect(upsert).not.toHaveBeenCalled()
  })

  it('is a no-op when the user has no id', async () => {
    const { client, upsert, selectMaybeSingle } = makeMockSupabase(null)
    await ensureProfile(client, { ...baseUser, id: '' })
    expect(selectMaybeSingle).not.toHaveBeenCalled()
    expect(upsert).not.toHaveBeenCalled()
  })
})
