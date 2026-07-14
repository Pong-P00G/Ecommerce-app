// ── Global test setup ─────────────────────────────────────────────────────────
// Runs before every test suite to ensure a clean state.

import { vi } from 'vitest';

beforeEach(() => {
  // Clear all mocks between tests
  vi.clearAllMocks();
});

afterEach(() => {
  // Clean up localStorage after each test
  localStorage.clear();
});
