import { test, expect } from '@playwright/test'

// Covers the app's true critical path end to end: an account must exist and
// be logged in before anything else is reachable, and Tasks is the first
// real feature a new user touches. A unique email per run keeps this
// independent of prior runs' data.
test('signup, then create, complete, and delete a task', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('Name').fill('E2E Test User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign up' }).click()

  await expect(page).toHaveURL('/')

  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible()

  const taskTitle = `Buy groceries ${Date.now()}`
  await page.getByLabel('Task title').fill(taskTitle)
  await page.getByRole('button', { name: 'Add' }).click()

  const taskRow = page.getByText(taskTitle).locator('..').locator('..')
  await expect(taskRow).toBeVisible()

  await taskRow.getByRole('button', { name: 'Mark as done' }).click()
  await expect(taskRow.getByText(taskTitle)).toHaveClass(/line-through/)

  await taskRow.getByRole('button', { name: 'Delete task' }).click()
  await expect(page.getByText(taskTitle)).toHaveCount(0)
})

test('logging out clears the session and blocks protected routes', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('Name').fill('E2E Logout User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign up' }).click()
  await expect(page).toHaveURL('/')

  await page.getByRole('button', { name: /log ?out/i }).click()
  await expect(page).toHaveURL('/login')

  await page.goto('/tasks')
  await expect(page).toHaveURL('/login')
})
