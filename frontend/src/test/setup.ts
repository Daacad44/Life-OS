import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest runs without `globals`, so Testing Library's automatic cleanup is not
// registered — component trees (and their portals) would otherwise leak into
// the next test in the file.
afterEach(cleanup)
