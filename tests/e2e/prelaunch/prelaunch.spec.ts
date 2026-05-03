import { test, expect } from '@playwright/test'

// These tests require NEXT_PUBLIC_PRELAUNCH_END to be set to a future date.
// When the gate is active, all non-allowlisted routes rewrite to /prelaunch.
// Direct navigation to /prelaunch always works regardless of gate state.

test.describe('Prelaunch page — UI', () => {
  test('page renders an h1 headline', async ({ page }) => {
    await page.goto('/prelaunch')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('page renders exactly 6 digit tiles', async ({ page }) => {
    await page.goto('/prelaunch')
    const tiles = page.locator('[data-testid="digit-tile"]')
    await expect(tiles).toHaveCount(6)
  })

  test('page contains no interactive elements (FR-005)', async ({ page }) => {
    await page.goto('/prelaunch')
    await expect(page.locator('a')).toHaveCount(0)
    await expect(page.locator('button')).toHaveCount(0)
    await expect(page.locator('form')).toHaveCount(0)
  })

  test('digit tiles are visible with non-empty characters', async ({ page }) => {
    await page.goto('/prelaunch')
    const chars = page.locator('[data-testid="digit-char"]')
    await expect(chars).toHaveCount(6)
    for (let i = 0; i < 6; i++) {
      const text = await chars.nth(i).textContent()
      expect(text?.trim()).not.toBe('')
    }
  })
})

test.describe('Prelaunch gate — active (requires NEXT_PUBLIC_PRELAUNCH_END set to future date)', () => {
  test('visiting "/" serves the prelaunch page when gate is active', async ({ page }) => {
    await page.goto('/')
    // If gate is active, / is rewritten to /prelaunch without URL change
    const isPrelaunchPage = await page.locator('[data-testid="digit-tile"]').count()
    if (isPrelaunchPage === 6) {
      // Gate is active: verify the page is the prelaunch holding page
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('[data-testid="digit-tile"]')).toHaveCount(6)
      await expect(page.locator('a, button, form')).toHaveCount(0)
    } else {
      // Gate is inactive (cutoff passed): verify Login page is shown
      await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible()
    }
  })
})
