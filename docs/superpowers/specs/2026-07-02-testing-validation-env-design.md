# Design: Testing, Validation & Environment Cleanup

**Sub-project 1 of the Phases 2 & 3 roadmap implementation.**

---

## Goal

Establish a safe foundation for the remaining roadmap work by:
1. Adding a working backend test harness with real integration tests.
2. Refactoring validation into a single, reusable middleware with standardized error responses.
3. Cleaning up environment-variable usage so the app fails fast on misconfiguration and never leaks secrets/stack traces in production.

---

## Scope

### In scope
- Backend test setup (`vitest`, `supertest`) in `server/`.
- Test database helper that resets `aliee_shop_test` before each run.
- Seed fixtures for users, categories, products, and stock.
- Smoke integration tests for `/api/auth` and `/api/products`.
- A new reusable `validate(schema, source)` middleware.
- Migration of existing Joi validation from `validationMiddleWare.js` and `productValidation.js` to the new utility.
- Standardized error response shape: `{ success: false, message, code?, errors?[] }`.
- Request-ID middleware for traceable 500 logs.
- Environment validation module (`env.js`) run at startup.
- Audit and removal of hardcoded URLs/ports in `main.js` and `vue-project/src/api/api.js`.
- Production-safe global error handler (no stack traces when `NODE_ENV !== 'development'`).
- Lightweight frontend smoke tests: one Pinia store test (`auth.js`) and one component test (`Login.vue`).

### Out of scope
- Full coverage of all routes/services (covered in later sub-projects).
- Cart/order/payment tests (those services are still stabilizing).
- CI/CD pipeline changes.
- Docker or infrastructure changes.

---

## Current State

- `server/package.json` has `"test": "echo \"Error: no test specified\" && exit 1"`.
- `server/src/middleware/validationMiddleWare.js` contains `validateRegister`, `validateLogin`, `validateUpdate` for auth.
- `server/src/middleware/productValidation.js` contains product/category/variant/stock/discount validators; some return inline responses, some stash errors in `req.validationErrors` for a separate `validate()` middleware.
- `server/src/main.js` uses `dotenv.config()` and reads from `process.env`, but has no startup validation.
- `server/.env.example` exists and is mostly complete.
- `vue-project/src/api/api.js` already uses `import.meta.env.VITE_API_BASE_URL` correctly, with only the `timeout` value hardcoded.
- `vue-project/package.json` already has Vitest and `@testing-library/vue` installed.

---

## Design

### 1. Backend Testing Foundation

#### New files
- `server/vitest.config.js` — sets `test.environment` to `node`, loads `tests/setup.js` as global setup.
- `server/tests/setup.js` — loads `.env.test`, creates a dedicated `pg` client to `aliee_shop_test`, runs `seed/reset.sql`, then closes.
- `server/tests/helpers/db.js` — exports `query(sql, params)` and `transaction(fn)` helpers that use the shared db pool.
- `server/tests/fixtures/user.fixture.js`, `category.fixture.js`, `product.fixture.js` — pure helper functions that insert rows and return IDs.
- `server/tests/integration/auth.routes.test.js` — register/login/validation smoke tests.
- `server/tests/integration/product.routes.test.js` — create/list product smoke tests.
- `server/tests/unit/validate.middleware.test.js` — unit tests for the new `validate()` utility.

#### Test database
- `aliee_shop_test` is created manually once (`CREATE DATABASE aliee_shop_test`).
- Each test run executes `seed/reset.sql` which drops and recreates tables using the existing `allie shop.sql` schema.
- Tests share a single `pg.Pool` that is closed after all tests via `afterAll`.

#### Running tests
```bash
cd server
npm test
```
Executes `vitest run`.

### 2. Validation Refactor

#### New utility
`server/src/middleware/validate.js`:
```js
export const validate = (schema, source = 'body') =>
  (req, res, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }
    next();
  };
```

#### Migrated validators
- `server/src/middleware/authValidation.js` — exports `registerSchema`, `loginSchema`, `updateSchema` plus route-ready middleware: `validateRegister`, `validateLogin`, `validateUpdate`.
- `server/src/middleware/productValidation.js` — keeps schemas (`productSchema`, `categorySchema`, `variantSchema`, `stockSchema`, `discountSchema`, `paginationSchema`, `bulkProductSchema`) but replaces inline validation with `validate(schema, source)`.
- `server/src/middleware/validationMiddleWare.js` is deleted; its exports move to `authValidation.js`.

#### Route updates
- Auth routes import from `authValidation.js`.
- Product routes import from `productValidation.js`.
- No behavioral change for valid requests; only error response shape unifies.

### 3. Error Handling Standardization

#### Request ID
- `server/src/middleware/requestId.js` attaches `req.id = crypto.randomUUID()` and adds it to the response header `X-Request-Id`.
- Global error handler logs `req.id` with the error.

#### Response shape
| Status | Shape |
|--------|-------|
| 400 validation | `{ success: false, message: "Validation failed", errors: [...] }` |
| 404 route | `{ success: false, message: "Route not found" }` |
| 500 dev | `{ success: false, message, code?, stack? }` |
| 500 prod | `{ success: false, message: "Internal server error", code? }` |

#### Implementation
- Update `main.js` 404 and global error handlers.
- Add `NODE_ENV` check before exposing `err.stack`.

### 4. Environment & Secrets Cleanup

#### New module
`server/src/config/env.js`:
```js
import { config } from 'dotenv';
config();

const required = ['JWT_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  db: { /* ... */ },
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001'
};
```

#### Changes
- `main.js` imports `env.js` at the very top (replaces `dotenv.config()` call).
- Remove any remaining hardcoded `localhost:5001` or `localhost:3001` fallback values from non-config code.
- `vue-project/src/api/api.js`: move `timeout: 10000` to `VITE_API_TIMEOUT` or keep it as a named constant; no other hardcoded URLs remain.

#### `.env` files
- Update `server/.env.example` to include `FRONTEND_URL` and `NODE_ENV`.
- Add `server/.env.test.example` documenting `DB_DATABASE=aliee_shop_test`.

### 5. Frontend Smoke Tests

#### New files
- `vue-project/src/stores/__tests__/auth.store.test.js` — tests `useAuthStore` login/logout state changes with mocked `authApi`.
- `vue-project/src/views/auth/__tests__/Login.view.test.js` — renders `Login.vue`, fills the form, and asserts submit.

#### Test setup
- `vue-project/vitest.config.js` already exists; ensure `environment: 'jsdom'`.
- Add `@pinia/testing` or use `createPinia()` in setup if not already available.

---

## Data Flow

```
Client Request
    │
    ▼
Request ID middleware
    │
    ▼
CORS / JSON parsing
    │
    ▼
validate(schema, source) ──► 400 if invalid
    │
    ▼
Route handler
    │
    ▼
Response or next(error)
    │
    ▼
Global error handler ──► 500 with/without stack based on NODE_ENV
```

---

## Testing Strategy

- **Backend integration tests** hit real Express app + real Postgres test DB.
- **Backend unit tests** exercise `validate()` middleware with mock `req/res/next`.
- **Frontend tests** use jsdom + Testing Library + mocked API layer.
- Race conditions: not in scope for this sub-project.

---

## Acceptance Criteria

1. `cd server && npm test` exits 0 with at least 10 passing tests.
2. `cd vue-project && npm test -- --run` exits 0 with at least 2 passing tests.
3. All auth and product route validation errors return the unified `{ success: false, message, errors }` shape.
4. `server/src/main.js` imports environment config from `server/src/config/env.js` and fails fast if `JWT_SECRET` or DB credentials are missing.
5. Stack traces are absent from 500 responses when `NODE_ENV=production`.
6. No hardcoded backend URL/port remains in `main.js` or `vue-project/src/api/api.js`.
7. Existing routes continue to behave correctly for valid requests (verified by integration tests).

---

## Dependencies

### Backend additions
- `vitest` (dev)
- `supertest` (dev)
- `@faker-js/faker` (dev) — optional, for fixture data

### No new runtime dependencies
- Uses existing `joi`, `pg`, `express`, `dotenv`.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Resetting test DB wipes data | Use a separate `aliee_shop_test` database only. |
| Validation refactor breaks existing routes | Keep existing schemas; only change response shape and middleware wiring. Run integration tests before/after. |
| Missing env vars in deployment | Startup validation throws immediately with a clear message. |

---

## Next Step

After this spec is approved, invoke `writing-plans` to produce a detailed implementation plan with file-level tasks, test code, and commands.
