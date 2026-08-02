import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '..')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // reuseExistingServer means these are no-ops against the dev servers this
  // project already runs manually — they only spin up their own when nothing
  // is listening yet (e.g. a fresh checkout or CI).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: 'npm run dev:backend',
          cwd: repoRoot,
          url: 'http://localhost:4000/health',
          reuseExistingServer: true,
          timeout: 30_000,
        },
        {
          command: 'npm run dev --workspace=frontend',
          cwd: repoRoot,
          url: 'http://localhost:5173',
          reuseExistingServer: true,
          timeout: 30_000,
        },
      ],
})
