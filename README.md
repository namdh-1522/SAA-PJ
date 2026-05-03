# SAA / Kudos (Phase 1)

Ứng dụng [Next.js](https://nextjs.org) 16 + [Supabase](https://supabase.com), đa ngôn ngữ (`next-intl`).

## Yêu cầu hệ thống

- **Node.js** 20.x trở lên (khớp với `engines` nếu có trong `package.json`)
- **npm** (hoặc `pnpm` / `yarn` nếu bạn chủ động đổi lockfile)
- **Docker Desktop** (hoặc engine tương đương) — chỉ khi chạy Supabase **local** qua CLI

## Cài đặt trên máy mới

### 1. Clone và cài dependency

```bash
git clone <repo-url>
cd my-app
npm ci
# hoặc lần đầu: npm install
```

### 2. Biến môi trường

```bash
cp .env.example .env.local
```

Chỉnh các giá trị trong `.env.local` theo project Supabase của bạn (URL, anon key, `SUPABASE_SERVICE_ROLE_KEY` nếu cần seed script).  
Chi tiết từng biến nằm trong `.env.example`.

**Không commit** `.env.local` — file này đã được gitignore.

### 3. Cơ sở dữ liệu — Supabase local (khuyến nghị khi dev)

Cài [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started), rồi:

```bash
npm run supabase:start
```

Chờ stack chạy xong, sau đó **áp toàn bộ migration** (tạo schema + dữ liệu seed trong file migration, ví dụ department mặc định):

```bash
npm run supabase:reset
```

Lệnh `supabase:reset` tương đương `supabase db reset`: reset DB local và chạy lại thư mục `supabase/migrations/` theo thứ tự.

Lấy URL và anon key của stack local (để điền `.env.local`) từ output của `supabase start` hoặc `supabase status`.

Dừng stack khi không dùng:

```bash
npm run supabase:stop
```

### 4. Cơ sở dữ liệu — Supabase Cloud

Trong thư mục project:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

(`db push` áp migration lên project đã link; cần quyền và CLI đã đăng nhập.)

Cập nhật `.env.local` bằng URL/keys từ [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

### 5. Seed thêm dữ liệu mẫu Kudos (tùy chọn)

Script `scripts/seed-kudos.mjs` cần **`NEXT_PUBLIC_SUPABASE_URL`** và **`SUPABASE_SERVICE_ROLE_KEY`** trong `.env.local`.

```bash
npm run seed:kudos
```

### 6. Chạy app

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Scripts hữu ích

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Build & production |
| `npm run lint` | ESLint |
| `npm test` | Vitest (không gồm integration) |
| `npm run test:integration` | Vitest integration (cần Supabase local + `.env.test`) |
| `npm run test:all` | Toàn bộ Vitest |
| `npm run supabase:start` / `stop` / `reset` | Vòng đời DB local |

E2E (Playwright):

```bash
npx playwright install
npx playwright test
```

## Tài liệu nội bộ

- Quy ước agent / workflow: `AGENTS.md`, `CLAUDE.md`
- Spec & guidelines: thư mục `.momorph/`

## Deploy

Có thể triển khai trên [Vercel](https://vercel.com) hoặn nền tảng Node tương thích Next.js; cấu hình biến môi trường giống production trong dashboard của host.
