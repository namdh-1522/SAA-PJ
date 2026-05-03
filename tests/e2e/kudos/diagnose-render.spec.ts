/**
 * Diagnostic Playwright test that programmatically signs in via Supabase admin
 * and visits /kudos to capture the actual render-time errors and screenshot.
 */
import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const TEST_EMAIL = 'kudos-diagnostic@test.local'
const TEST_PASSWORD = 'diag-pass-12345'

test.use({ viewport: { width: 1440, height: 900 } })

test('diagnose /kudos render errors', async ({ page, context }) => {
  // 1. Provision a test user via service role
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Create user (idempotent)
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Kudos Diag' },
  })
  if (createErr && !createErr.message.includes('already')) {
    throw createErr
  }
  let userId = created?.user?.id
  if (!userId) {
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    userId = list?.users.find((u) => u.email === TEST_EMAIL)?.id
  }
  if (!userId) throw new Error('failed to provision user')

  // Ensure profile exists
  await admin.from('profiles').upsert({
    id: userId,
    full_name: 'Kudos Diag',
    department_code: null,
  })

  // Seed a few departments so the dept dropdown renders (Figma WXK5AYB_rG)
  await admin.from('departments').upsert(
    [
      { code: 'CECV2', name: 'CECV2', active: true },
      { code: 'CECV3', name: 'CECV3', active: true },
      { code: 'CECV4', name: 'CECV4', active: true },
      { code: 'OPD', name: 'OPD', active: true },
      { code: 'Infra', name: 'Infra', active: true },
    ],
    { onConflict: 'code' }
  )

  // Seed a sender + 3 highlight kudos so the carousel renders peek neighbours
  const senderEmail = 'kudos-diag-sender@test.local'
  const { data: sCreated } = await admin.auth.admin.createUser({
    email: senderEmail,
    password: 'sender-pass-12345',
    email_confirm: true,
    user_metadata: { full_name: 'Diag Sender' },
  })
  let senderId = sCreated?.user?.id
  if (!senderId) {
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    senderId = list?.users.find((u) => u.email === senderEmail)?.id
  }
  if (senderId) {
    await admin.from('profiles').upsert({
      id: senderId, full_name: 'Diag Sender', department_code: null,
    })
    // Wipe + re-seed so we always have 3 highlights to test the carousel
    await admin.from('hearts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await admin.from('kudos_highlight_flags').delete().neq('kudos_id', '00000000-0000-0000-0000-000000000000')
    await admin.from('kudos').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const contents = [
      'First highlight — beautiful work on the launch!',
      'Second highlight — your code review caught a critical bug.',
      'Third highlight — fantastic mentorship this quarter.',
    ]
    for (const content of contents) {
      const { data: k, error: kErr } = await admin
        .from('kudos')
        .insert({ sender_id: senderId, receiver_id: userId, content, title: 'IDOL GIỚI TRẺ' })
        .select('id')
        .single()
      if (kErr) console.log('kudos insert err:', kErr)
      if (k) {
        const { error: hfErr } = await admin.from('kudos_highlight_flags').upsert(
          { kudos_id: (k as { id: string }).id, featured: true },
          { onConflict: 'kudos_id' }
        )
        if (hfErr) console.log('hf upsert err:', hfErr)
      }
    }
    // Verify count
    const { count: hCount } = await admin
      .from('kudos_highlight_flags')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)
    console.log(`=== Seed featured flags count: ${hCount}`)
    const { count: viewCount, error: vErr } = await admin
      .from('kudos_highlights')
      .select('*', { count: 'exact', head: true })
    console.log(`=== Seed kudos_highlights view count: ${viewCount}, err: ${vErr?.message ?? 'none'}`)
  }

  // 2. Sign in to get a session
  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })
  if (signInErr) throw signInErr

  // 3. Inject Supabase session cookies
  const session = signIn.session!
  // Supabase ssr stores tokens in a cookie named like: sb-<project-ref>-auth-token
  const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0]
  const cookieName = `sb-${projectRef}-auth-token`
  const cookieValue = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: 'bearer',
    user: session.user,
  })
  await context.addCookies([
    {
      name: cookieName,
      value: encodeURIComponent(`base64-${Buffer.from(cookieValue).toString('base64')}`),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ])

  // 4. Capture all console messages and page errors
  const consoleMessages: string[] = []
  const pageErrors: string[] = []
  page.on('console', (msg) => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`)
  })
  page.on('pageerror', (err) => {
    pageErrors.push(`${err.name}: ${err.message}\n${err.stack ?? ''}`)
  })

  // 5. Visit /kudos and wait for hydration
  await page.goto('http://localhost:3000/kudos', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000) // Let queries settle

  // 6. Capture rendered HTML for the three sections
  const errorBanners = await page.getByText('Không thể tải dữ liệu').count()

  // 6b. Inspect the highlight carousel — verify peek neighbours render
  const carouselInfo = await page.evaluate(() => {
    const region = document.querySelector('[role="region"][aria-label*="Highlight carousel"]')
    if (!region) return { found: false }
    const articles = Array.from(region.querySelectorAll('article'))
    return {
      found: true,
      articleCount: articles.length,
      peeks: articles.map((a) => {
        const wrap = a.parentElement as HTMLElement | null
        const cs = wrap ? getComputedStyle(wrap) : null
        return {
          opacity: cs?.opacity,
          transform: cs?.transform,
          ariaHidden: wrap?.getAttribute('aria-hidden'),
        }
      }),
    }
  })

  // 7. Verify hero background image actually loaded
  const heroBgUrl = await page.evaluate(() => {
    const heroEl = document.querySelector('.kudos-hero-bg') as HTMLElement | null
    if (!heroEl) return null
    return getComputedStyle(heroEl).backgroundImage
  })

  // 7b. Verify the three headline typography matches design spec h1
  // (Montserrat 700 / 57px / 64px line-height / -0.25px letter-spacing)
  const headlineStyles = await page.evaluate(() => {
    const labels = ['HIGHLIGHT KUDOS', 'SPOTLIGHT BOARD', 'ALL KUDOS']
    return labels.map((label) => {
      const el = Array.from(document.querySelectorAll('h1, h2, h3'))
        .find((h) => h.textContent?.trim().toUpperCase() === label) as HTMLElement | undefined
      if (!el) return { label, found: false }
      const cs = getComputedStyle(el)
      return {
        label,
        found: true,
        tag: el.tagName,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        fontFamily: cs.fontFamily.split(',')[0].replace(/['"]/g, ''),
      }
    })
  })
  // Network check: was hero-bg.jpg fetched successfully?
  const heroBgRequests = await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .filter((r) => r.name.includes('hero-bg'))
      .map((r) => ({ url: r.name, transferSize: (r as PerformanceResourceTiming).transferSize }))
  )

  // 8. Print everything for inspection
  console.log('\n=== CONSOLE MESSAGES ===')
  for (const m of consoleMessages) console.log(m)
  console.log('\n=== PAGE ERRORS ===')
  for (const e of pageErrors) console.log(e)
  console.log(`\n=== "Không thể tải dữ liệu" banners visible: ${errorBanners}`)
  console.log(`=== Hero bg URL (computed): ${heroBgUrl}`)
  console.log(`=== Hero bg network requests: ${JSON.stringify(heroBgRequests)}`)
  console.log(`=== Headline typography:`)
  for (const h of headlineStyles) console.log(`    ${JSON.stringify(h)}`)
  console.log(`=== Carousel info: ${JSON.stringify(carouselInfo, null, 2)}`)
  console.log(`Final URL: ${page.url()}`)

  // Take screenshot for visual reference
  await page.screenshot({ path: '/tmp/kudos-diagnose.png', fullPage: true })
  await page.screenshot({ path: '/tmp/kudos-diagnose-fold.png', fullPage: false })

  // Advance to slide 2 so BOTH prev and next peeks are visible, then re-snap
  const nextBtn = page.getByRole('button', { name: /Slide tiếp theo|carousel_next|next/i }).first()
  if (await nextBtn.isVisible().catch(() => false)) {
    await nextBtn.click()
    await page.waitForTimeout(700) // let transition settle
    await page.screenshot({ path: '/tmp/kudos-carousel-mid.png', fullPage: false })
  }
  // Crop to the highlight carousel for clearer comparison with Figma
  const carouselEl = page.locator('[role="region"][aria-label*="Highlight carousel"]').first()
  if (await carouselEl.isVisible().catch(() => false)) {
    await carouselEl.screenshot({ path: '/tmp/kudos-carousel-only.png' })
  }

  // Open the dept dropdown (Figma WXK5AYB_rG) and snap it for visual review
  const deptTrigger = page.getByRole('combobox', { name: /Lọc theo phòng ban|filter_dept_label|department/i }).first()
  if (await deptTrigger.isVisible().catch(() => false)) {
    await deptTrigger.click()
    await page.waitForTimeout(200)
    await page.screenshot({ path: '/tmp/dept-dropdown-open.png', fullPage: false })
    // Crop to just the dropdown wrapper for design comparison
    const wrapper = await deptTrigger.evaluateHandle((el) => el.parentElement!)
    await (wrapper as never as { asElement: () => { screenshot: (o: { path: string }) => Promise<unknown> } | null }).asElement()?.screenshot({ path: '/tmp/dept-dropdown-only.png' })
  }

  expect(true).toBe(true) // diagnostic only — no assertions
})
