#!/usr/bin/env node
// Seed sample data for the /kudos screen.
//
// Usage:
//   npm run seed:kudos
// Equivalent to:
//   node --env-file=.env.local scripts/seed-kudos.mjs
//
// Prerequisites — add to .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=<service-role-key from Supabase Dashboard → API>
//
// IMPORTANT: SUPABASE_SERVICE_ROLE_KEY bypasses RLS — never expose it to the
// browser. Keep it ONLY in .env.local (already gitignored) and in CI secrets.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    '❌ Missing env. Required: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.\n' +
      '   Run via:  npm run seed:kudos   (loads .env.local automatically)',
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Sample data ──────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { code: 'CEVC1', name: 'CEVC1' },
  { code: 'CEVC2', name: 'CEVC2' },
  { code: 'CEVC3', name: 'CEVC3' },
  { code: 'CEVC4', name: 'CEVC4' },
  { code: 'OPD',   name: 'OPD' },
  { code: 'INFRA', name: 'Infra' },
]

// Stable email = idempotent user creation. Default password is for dev only.
const SAMPLE_USERS = [
  { email: 'an.nguyen@sun-asterisk.dev',  full_name: 'Nguyễn An',  department_code: 'CEVC1', star_tier: 3 },
  { email: 'binh.tran@sun-asterisk.dev',  full_name: 'Trần Bình',  department_code: 'CEVC1', star_tier: 2 },
  { email: 'chi.le@sun-asterisk.dev',     full_name: 'Lê Chi',     department_code: 'CEVC2', star_tier: 2 },
  { email: 'duy.pham@sun-asterisk.dev',   full_name: 'Phạm Duy',   department_code: 'CEVC2', star_tier: 1 },
  { email: 'hoa.do@sun-asterisk.dev',     full_name: 'Đỗ Hoa',     department_code: 'CEVC3', star_tier: 1 },
  { email: 'khanh.vu@sun-asterisk.dev',   full_name: 'Vũ Khánh',   department_code: 'CEVC3', star_tier: null },
  { email: 'linh.bui@sun-asterisk.dev',   full_name: 'Bùi Linh',   department_code: 'CEVC4', star_tier: null },
  { email: 'minh.hoang@sun-asterisk.dev', full_name: 'Hoàng Minh', department_code: 'CEVC4', star_tier: 3 },
  { email: 'ngan.dang@sun-asterisk.dev',  full_name: 'Đặng Ngân',  department_code: 'OPD',   star_tier: 1 },
  { email: 'phong.ly@sun-asterisk.dev',   full_name: 'Lý Phong',   department_code: 'INFRA', star_tier: 2 },
]

const SEED_PASSWORD = 'Sunner@2026'

const HASHTAGS = [
  'thank-you', 'great-job', 'teamwork', 'innovation', 'leadership',
  'helpful', 'creative', 'fast-delivery', 'customer-focus', 'mentor',
  'problem-solver', 'saa-2025',
]

// Built kudos templates. {sender} / {receiver} pair indices reference SAMPLE_USERS.
const KUDOS_TEMPLATES = [
  {
    sender: 0, receiver: 1,
    content: 'Cảm ơn anh đã hỗ trợ pair-program suốt đêm để fix con bug khó nhằn ở payment service. Quá xuất sắc!',
    hashtags: ['thank-you', 'teamwork', 'problem-solver'],
    images: [],
  },
  {
    sender: 2, receiver: 0,
    content: 'Bộ design system mới của bạn cực kỳ clean — nhìn vào là biết product này có gu thật sự. Keep going!',
    hashtags: ['great-job', 'creative'],
    images: [],
  },
  {
    sender: 3, receiver: 7,
    content: 'Cảm ơn anh đã review kỹ proposal — feedback của anh giúp team gọn lại scope tới 30%. Mentor xịn!',
    hashtags: ['mentor', 'leadership', 'thank-you'],
    images: [],
  },
  {
    sender: 1, receiver: 2,
    content: 'The new onboarding illustrations are 🔥. Users said the product feels much more friendly now.',
    hashtags: ['creative', 'great-job', 'customer-focus'],
    images: ['https://picsum.photos/seed/kudos-1/800/450'],
  },
  {
    sender: 4, receiver: 6,
    content: 'Cảm ơn chị đã turnaround budget approval trong 2 ngày. Team marketing ship campaign đúng deadline.',
    hashtags: ['fast-delivery', 'thank-you'],
    images: [],
  },
  {
    sender: 5, receiver: 3,
    content: 'PM Duy lúc nào cũng listen carefully — họp với anh mệt nhưng output rất rõ ràng. Cảm ơn!',
    hashtags: ['leadership', 'helpful'],
    images: [],
  },
  {
    sender: 7, receiver: 8,
    content: 'Pixel-perfect cho trang Kudos! Mình check lại Figma rồi, không lệch 1px nào. Quá đỉnh.',
    hashtags: ['great-job', 'creative', 'saa-2025'],
    images: ['https://picsum.photos/seed/kudos-2/800/600'],
  },
  {
    sender: 9, receiver: 4,
    content: 'Hoa lên ý tưởng campaign Tết quá hay — leadership team đều thích. Triển khai luôn nhé!',
    hashtags: ['innovation', 'creative', 'leadership'],
    images: [],
  },
  {
    sender: 0, receiver: 9,
    content: 'Phong giúp unblock release blocker trong nửa tiếng — saved the day. Teamwork ♥',
    hashtags: ['teamwork', 'fast-delivery', 'problem-solver'],
    images: [],
  },
  {
    sender: 8, receiver: 5,
    content: 'Khánh organize SAA prep flow gọn gàng quá. Mọi người follow up dễ hơn nhiều. Cảm ơn!',
    hashtags: ['leadership', 'helpful', 'saa-2025'],
    images: [],
  },
  {
    sender: 6, receiver: 0,
    content: 'An giải đáp tận tình mọi câu hỏi tech của team Finance — học được nhiều thứ. Thanks An!',
    hashtags: ['mentor', 'helpful', 'thank-you'],
    images: [],
  },
  {
    sender: 2, receiver: 7,
    content: 'Hoàng review code rất kỹ, comment chi tiết. Review của anh là một mini-tutorial rồi 😂',
    hashtags: ['mentor', 'great-job'],
    images: [],
  },
  {
    sender: 1, receiver: 3,
    content: 'Buổi product sync hôm nay productive nhất từ đầu năm — nhờ Duy chuẩn bị agenda cực kỹ.',
    hashtags: ['leadership', 'great-job'],
    images: [],
  },
  {
    sender: 4, receiver: 2,
    content: 'New brand guidelines is chef-kiss. Cả team marketing đang dùng để làm asset.',
    hashtags: ['creative', 'innovation'],
    images: ['https://picsum.photos/seed/kudos-3/800/450'],
  },
  {
    sender: 7, receiver: 1,
    content: 'Bình ship feature kịp release window dù scope thay đổi 3 lần. Resilient!',
    hashtags: ['fast-delivery', 'problem-solver'],
    images: [],
  },
  {
    sender: 3, receiver: 0,
    content: 'An đề xuất kiến trúc mới cho realtime layer — performance cải thiện rõ rệt. Innovation ⭐',
    hashtags: ['innovation', 'great-job', 'saa-2025'],
    images: [],
  },
  {
    sender: 8, receiver: 9,
    content: 'Phong onboarding intern team tuần đầu — không khí làm việc vui hẳn lên. Cảm ơn!',
    hashtags: ['mentor', 'teamwork'],
    images: [],
  },
  {
    sender: 5, receiver: 4,
    content: 'Hoa rất kiên nhẫn với mọi người — luôn nhắc deadline mà không bao giờ stress. Skill xịn!',
    hashtags: ['helpful', 'leadership'],
    images: [],
  },
  {
    sender: 0, receiver: 2,
    content: 'Chi vẽ icon set mới đẹp xuất sắc — UI nhìn polished hẳn lên. Thanks!',
    hashtags: ['creative', 'thank-you'],
    images: ['https://picsum.photos/seed/kudos-4/800/600'],
  },
  {
    sender: 6, receiver: 7,
    content: 'Team Finance học hỏi được nhiều thứ từ buổi tech sharing của Hoàng. Mong có thêm nhiều buổi nữa!',
    hashtags: ['mentor', 'great-job', 'helpful'],
    images: [],
  },
  {
    sender: 1, receiver: 8,
    content: 'Ngân support design review nhanh chóng — chốt được 5 màn hình trong 1 buổi. Quá hiệu quả.',
    hashtags: ['fast-delivery', 'teamwork'],
    images: [],
  },
  {
    sender: 9, receiver: 6,
    content: 'Khánh organize SAA event timeline rất chi tiết. Đọc xong là biết phải làm gì. ⭐⭐⭐',
    hashtags: ['leadership', 'saa-2025', 'great-job'],
    images: [],
  },
  {
    sender: 2, receiver: 5,
    content: 'Khánh always responsive — HR ticket nào cũng được xử lý trong ngày. Customer-focus xịn!',
    hashtags: ['customer-focus', 'helpful'],
    images: [],
  },
  {
    sender: 3, receiver: 1,
    content: 'Tech debt clean-up sprint của Bình giảm tới 40% bug count tháng này. Quá đỉnh.',
    hashtags: ['problem-solver', 'innovation'],
    images: [],
  },
  {
    sender: 4, receiver: 0,
    content: 'An help marketing setup analytics dashboard — không có anh chắc team mò mẫm cả tuần.',
    hashtags: ['helpful', 'thank-you', 'fast-delivery'],
    images: [],
  },
]

// Mark these kudos indices as featured highlights.
const HIGHLIGHT_INDICES = [0, 3, 6, 9, 15]

const SPECIAL_DAYS = [
  { event_date: '2026-12-26', heart_weight: 2, label: 'Sun* Annual Awards 2025 Day' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avatarUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

function pickRandom(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(i, 1)[0])
  }
  return out
}

async function listAllAuthUsers() {
  const all = []
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    all.push(...data.users)
    if (data.users.length < 1000) break
    page += 1
  }
  return all
}

async function ensureUser(spec, existingByEmail) {
  const existing = existingByEmail.get(spec.email)
  if (existing) {
    console.log(`   ↳ user exists  ${spec.email} (${existing.id.slice(0, 8)})`)
    return existing.id
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email: spec.email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: spec.full_name, department: spec.department_code },
  })
  if (error) throw error
  console.log(`   ↳ created      ${spec.email} (${data.user.id.slice(0, 8)})`)
  return data.user.id
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding /kudos sample data')
  console.log(`   target: ${SUPABASE_URL}\n`)

  // 1. Departments — upsert
  console.log('▸ Upserting departments…')
  {
    const { error } = await supabase
      .from('departments')
      .upsert(DEPARTMENTS.map((d) => ({ ...d, active: true })), { onConflict: 'code' })
    if (error) throw error
    console.log(`   ${DEPARTMENTS.length} departments ready`)
  }

  // 2. Users — idempotent via Auth admin API
  console.log('\n▸ Ensuring auth users…')
  const existing = await listAllAuthUsers()
  const byEmail = new Map(existing.map((u) => [u.email, u]))
  const userIds = []
  for (const spec of SAMPLE_USERS) {
    const id = await ensureUser(spec, byEmail)
    userIds.push(id)
  }

  // 3. Profiles — upsert by id (matches auth.users)
  console.log('\n▸ Upserting profiles…')
  {
    const rows = SAMPLE_USERS.map((spec, i) => ({
      id: userIds[i],
      full_name: spec.full_name,
      avatar_url: avatarUrl(spec.full_name),
      department_code: spec.department_code,
      star_tier: spec.star_tier,
    }))
    const { error } = await supabase.from('profiles').upsert(rows, { onConflict: 'id' })
    if (error) throw error
    console.log(`   ${rows.length} profiles ready`)
  }

  // 4. Hashtags — upsert by name
  console.log('\n▸ Upserting hashtags…')
  const hashtagIdByName = new Map()
  {
    const { data, error } = await supabase
      .from('hashtags')
      .upsert(HASHTAGS.map((name) => ({ name })), { onConflict: 'name' })
      .select('id, name')
    if (error) throw error
    for (const row of data ?? []) hashtagIdByName.set(row.name, row.id)
    console.log(`   ${hashtagIdByName.size} hashtags ready`)
  }

  // 5. Wipe transactional kudos data so reseed produces a known fixture set.
  console.log('\n▸ Wiping previous kudos / hearts / highlights / secret_boxes / special_days…')
  for (const tbl of [
    'kudos_hashtags',
    'hearts',
    'kudos_highlight_flags',
    'kudos',
    'secret_boxes',
    'special_days',
  ]) {
    const { error } = await supabase.from(tbl).delete().not('id', 'is', null).limit(100000)
    if (error && !/not.*exist|column .* does not exist/i.test(error.message)) {
      // kudos_hashtags has no `id` column — fall back to range delete
      if (tbl === 'kudos_hashtags') {
        const { error: e2 } = await supabase.from('kudos_hashtags').delete().neq('kudos_id', '00000000-0000-0000-0000-000000000000')
        if (e2) throw e2
      } else {
        throw error
      }
    }
  }

  // 6. Insert kudos
  console.log('\n▸ Inserting kudos…')
  const kudosRows = KUDOS_TEMPLATES.map((tpl, i) => ({
    sender_id: userIds[tpl.sender],
    receiver_id: userIds[tpl.receiver],
    content: tpl.content,
    image_urls: tpl.images,
    // Stagger created_at across last 14 days for nicer feed ordering.
    created_at: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
  }))
  const { data: kudosInserted, error: kudosErr } = await supabase
    .from('kudos')
    .insert(kudosRows)
    .select('id')
  if (kudosErr) throw kudosErr
  console.log(`   ${kudosInserted.length} kudos inserted`)

  const kudosIds = kudosInserted.map((k) => k.id)

  // 7. kudos_hashtags links
  console.log('\n▸ Linking hashtags…')
  const linkRows = []
  KUDOS_TEMPLATES.forEach((tpl, i) => {
    for (const tag of tpl.hashtags) {
      const tagId = hashtagIdByName.get(tag)
      if (tagId) linkRows.push({ kudos_id: kudosIds[i], hashtag_id: tagId })
    }
  })
  const { error: linkErr } = await supabase.from('kudos_hashtags').insert(linkRows)
  if (linkErr) throw linkErr
  console.log(`   ${linkRows.length} hashtag links inserted`)

  // 8. Hearts — random 0..15 likers per kudos, pulled from userIds (excluding sender).
  console.log('\n▸ Inserting hearts…')
  const heartRows = []
  KUDOS_TEMPLATES.forEach((tpl, i) => {
    const senderId = userIds[tpl.sender]
    const eligible = userIds.filter((id) => id !== senderId)
    const count = Math.floor(Math.random() * 16) // 0..15
    for (const likerId of pickRandom(eligible, count)) {
      heartRows.push({ kudos_id: kudosIds[i], user_id: likerId, weight: 1 })
    }
  })
  if (heartRows.length > 0) {
    const { error } = await supabase.from('hearts').insert(heartRows)
    if (error) throw error
  }
  console.log(`   ${heartRows.length} hearts inserted`)

  // 9. Highlight flags
  console.log('\n▸ Marking highlights…')
  const highlightRows = HIGHLIGHT_INDICES.map((i) => ({
    kudos_id: kudosIds[i],
    featured: true,
  }))
  const { error: hlErr } = await supabase
    .from('kudos_highlight_flags')
    .upsert(highlightRows, { onConflict: 'kudos_id' })
  if (hlErr) throw hlErr
  console.log(`   ${highlightRows.length} highlights flagged`)

  // 10. Secret boxes — 3 per user, mix of opened/closed
  console.log('\n▸ Inserting secret boxes…')
  const boxRows = []
  for (const id of userIds) {
    boxRows.push(
      { owner_id: id, opened: false },
      { owner_id: id, opened: false },
      { owner_id: id, opened: true, opened_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    )
  }
  const { error: boxErr } = await supabase.from('secret_boxes').insert(boxRows)
  if (boxErr) throw boxErr
  console.log(`   ${boxRows.length} secret boxes inserted`)

  // 11. Special days
  console.log('\n▸ Inserting special days…')
  const { error: sdErr } = await supabase.from('special_days').insert(SPECIAL_DAYS)
  if (sdErr) throw sdErr
  console.log(`   ${SPECIAL_DAYS.length} special days inserted`)

  console.log('\n✅ Seed complete.')
  console.log(`   Sample login (any of):`)
  for (const u of SAMPLE_USERS) console.log(`     - ${u.email}  /  ${SEED_PASSWORD}`)
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message ?? err)
  if (err.details) console.error('   details:', err.details)
  if (err.hint) console.error('   hint:', err.hint)
  process.exit(1)
})
