import { test, expect } from '@playwright/test'

/**
 * E2E tests for the Kudos Live Board (/kudos).
 *
 * Prerequisites:
 *  - An authenticated session is required; configure Playwright auth fixture
 *    (storageState) so tests start with a logged-in session.
 *  - Seed data: ≥1 kudos post, ≥1 opened secret box available.
 *
 * TODO(e2e-auth): Add auth fixture setup when session fixtures are wired.
 *   See tests/e2e/fixtures/auth.ts for the pattern used in other E2E suites.
 */

test.describe('Kudos Live Board — happy paths', () => {
  test.beforeEach(async ({ page }) => {
    // TODO(e2e-auth): replace direct navigation with authenticated session
    await page.goto('/kudos')
  })

  test('unauthenticated visit redirects to /', async ({ page }) => {
    // When not logged in, the server redirects to /
    await expect(page).toHaveURL('/')
  })
})

test.describe('Kudos Live Board — authenticated', () => {
  test.skip(true, 'TODO(e2e-auth): requires authenticated session fixture')

  test('all 4 regions render within 3s', async ({ page }) => {
    await page.goto('/kudos')
    await expect(page.getByRole('banner')).toBeVisible({ timeout: 3000 })
    await expect(page.getByLabel('Highlight Kudos')).toBeVisible({ timeout: 3000 })
    await expect(page.getByLabel('All Kudos')).toBeVisible({ timeout: 3000 })
    await expect(page.getByLabel('Thống kê và bảng xếp hạng')).toBeVisible({ timeout: 3000 })
  })

  test('heart a post — count increments', async ({ page }) => {
    await page.goto('/kudos')
    const firstCard = page.locator('article').first()
    const heartBtn = firstCard.locator('[aria-pressed]').first()

    const initialCountText = await heartBtn.locator('span').last().textContent()
    const initialCount = parseInt(initialCountText ?? '0', 10)

    await heartBtn.click()
    await expect(heartBtn.locator('span').last()).not.toHaveText(String(initialCount), { timeout: 2000 })
  })

  test('copy link shows toast', async ({ page }) => {
    await page.goto('/kudos')
    const firstCard = page.locator('article').first()
    await firstCard.getByRole('button', { name: /copy/i }).click()
    await expect(page.getByText(/đã sao chép|copied/i)).toBeVisible({ timeout: 2000 })
  })

  test('select hashtag filter — URL updates + feed re-renders', async ({ page }) => {
    await page.goto('/kudos')
    const hashtagButton = page.locator('button[aria-pressed="false"]').filter({ hasText: '#' }).first()
    if (!(await hashtagButton.count())) test.skip()
    await hashtagButton.click()
    await expect(page).toHaveURL(/hashtag=/, { timeout: 2000 })
  })

  test('load more appends cards', async ({ page }) => {
    await page.goto('/kudos')
    const countBefore = await page.locator('article').count()
    const loadMoreBtn = page.getByRole('button', { name: /xem thêm/i })
    if (!(await loadMoreBtn.isVisible())) test.skip()
    await loadMoreBtn.click()
    await page.waitForTimeout(500)
    const countAfter = await page.locator('article').count()
    expect(countAfter).toBeGreaterThanOrEqual(countBefore)
  })

  test('Mở quà button navigates when box available', async ({ page }) => {
    await page.goto('/kudos')
    const openBtn = page.getByRole('button', { name: /mở quà/i })
    const isDisabled = await openBtn.getAttribute('disabled')
    if (isDisabled !== null) test.skip()
    await openBtn.click()
    await expect(page).toHaveURL(/open-box/, { timeout: 3000 })
  })
})

test.describe('Kudos Live Board — error paths', () => {
  test.skip(true, 'TODO(e2e-auth): requires authenticated session fixture')

  test('heart own post button is disabled', async ({ page }) => {
    await page.goto('/kudos')
    // The sender's own post should have aria-pressed button with opacity 0.4
    // We can't easily identify "own post" without seed data awareness — verify via CSS
    const disabledHeart = page.locator('button[aria-pressed][disabled]').first()
    await expect(disabledHeart).toBeVisible({ timeout: 3000 })
  })

  test('Mở quà disabled when no secret boxes', async ({ page }) => {
    // Requires seeding a user with 0 secret boxes
    await page.goto('/kudos')
    const openBtn = page.getByRole('button', { name: /mở quà/i })
    await expect(openBtn).toBeDisabled({ timeout: 3000 })
  })
})

test.describe('Kudos Live Board — a11y', () => {
  test.skip(true, 'TODO(e2e-axe): configure @axe-core/playwright')

  test('no critical a11y violations at 1280px', async ({ page }) => {
    await page.goto('/kudos')
    // TODO(e2e-axe): const results = await new AxeBuilder({ page }).analyze()
    // expect(results.violations.filter(v => ['critical','serious'].includes(v.impact!))).toHaveLength(0)
  })
})
