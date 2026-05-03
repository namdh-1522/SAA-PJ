import { describe, expect, it } from 'vitest'
import { AWARDS } from '@/lib/awards'

const EXPECTED_SLUGS = [
  'top-talent',
  'top-project',
  'top-project-leader',
  'best-manager',
  'signature-2025-creator',
  'mvp',
] as const

describe('AWARDS — extended AwardCategory shape', () => {
  it('contains exactly the 6 expected slugs in canonical order', () => {
    expect(AWARDS.map((a) => a.slug)).toEqual([...EXPECTED_SLUGS])
  })

  it.each(EXPECTED_SLUGS)('award %s satisfies AwardSpec subset (Homepage <AwardCard> regression)', (slug) => {
    const award = AWARDS.find((a) => a.slug === slug)
    expect(award).toBeDefined()
    expect(typeof award!.id).toBe('string')
    expect(typeof award!.titleKey).toBe('string')
    expect(typeof award!.descriptionKey).toBe('string')
    expect(typeof award!.image).toBe('string')
    expect(typeof award!.slug).toBe('string')
    expect(award!.image).toMatch(/^\/assets\/home\/awards\//)
  })

  it.each(EXPECTED_SLUGS)('award %s exposes the new AwardCategory fields', (slug) => {
    const award = AWARDS.find((a) => a.slug === slug)!
    expect(typeof award.descriptionLongKey).toBe('string')
    expect(award.nameOverlayImage).toMatch(/^\/assets\/awards\/overlays\//)
    expect(award.quantity).toBeGreaterThan(0)
    expect(['individual', 'team', 'unit']).toContain(award.quantityUnit)
    expect(Array.isArray(award.values)).toBe(true)
    expect(award.values.length).toBeGreaterThanOrEqual(1)
  })

  it('Signature 2025 - Creator has two values (individual + team)', () => {
    const signature = AWARDS.find((a) => a.slug === 'signature-2025-creator')!
    expect(signature.values).toHaveLength(2)
    const recipients = signature.values.map((v) => v.recipientType).sort()
    expect(recipients).toEqual(['individual', 'team'])
  })

  it('all single-value awards have one entry in `values`', () => {
    const singleValueSlugs: ReadonlyArray<(typeof EXPECTED_SLUGS)[number]> = [
      'top-talent',
      'top-project',
      'top-project-leader',
      'best-manager',
      'mvp',
    ]
    for (const slug of singleValueSlugs) {
      const award = AWARDS.find((a) => a.slug === slug)!
      expect(award.values).toHaveLength(1)
    }
  })
})
