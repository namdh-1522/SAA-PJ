import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load .env, .env.[mode], .env.[mode].local without filtering by prefix.
  // Integration tests need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
  // which are NOT VITE_-prefixed.
  const envFromFile = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, envFromFile)

  return {
    plugins: [react()],
    test: {
      // Default environment for component / hook unit tests.
      environment: 'happy-dom',
      // Integration tests run server-side route handlers — they need the Node
      // runtime, not a DOM polyfill (otherwise `Request`/`Response` collide).
      environmentMatchGlobs: [
        ['tests/integration/**', 'node'],
      ],
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      exclude: ['tests/e2e/**', 'node_modules/**'],
      // Integration tests share a real DB; running them in parallel would race
      // on table truncation. Disable file-level parallelism so integration
      // files execute sequentially (unit files in tests/unit are still fast
      // and isolated, so the overall suite stays quick).
      fileParallelism: false,
      // Mark integration tests as long-running.
      testTimeout: 15_000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  }
})
