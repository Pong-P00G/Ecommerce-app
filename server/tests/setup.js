// ── Server test setup ─────────────────────────────────────────────────────────
// This runs before each test file to set up the test environment.

import { beforeAll, afterAll } from 'vitest';

// Silence console logs during tests unless a test fails
// Comment out the line below to see all logs
// console.log = () => {};
// console.error = () => {};

beforeAll(() => {
    // Any global setup can go here
});

afterAll(() => {
    // Any global cleanup can go here
});
