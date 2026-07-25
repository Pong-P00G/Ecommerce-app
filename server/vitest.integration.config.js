// dotenv intentionally omitted — Node 21+ handles --env-file natively
// The startup script is: vitest run --config vitest.integration.config.js
// and should be invoked with: node --env-file=.env ... or the --env-file flag

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.integration.test.js'],
        setupFiles: ['./tests/setup.js'],
        testTimeout: 30000,
    },
});
