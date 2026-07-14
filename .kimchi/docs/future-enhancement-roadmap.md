# Future Enhancement & Scaling Roadmap — Aliee Shop

> **Purpose:** Provide a structured, phased plan for improving the Aliee Shop full-stack e-commerce application beyond the current schema-alignment fixes. This roadmap covers reliability, performance, security, user experience, and operational maturity.

---

## 1. Executive Summary

The project now has a backend that largely matches the PostgreSQL schema and exposes core e-commerce APIs (products, cart, orders, payments). The next steps move from "functional" to "production-ready": adding testing, hardening security, improving frontend UX, introducing caching and search, and preparing for deployable infrastructure.

This roadmap is organized by **time horizon** and **technical domain**. Each item includes a goal, rationale, and concrete next action.

---

## 2. Immediate Priorities (0–3 months)

### 2.1 Automated Testing
**Goal:** No new feature ships without tests.

- **Backend (Node/Express)**
  - Replace `server/package.json` test script with a real runner.
  - Add `vitest` or `node --test` unit tests for services and models.
  - Add integration tests for every route using `supertest` + test database.
  - Add DB seed fixtures for repeatable tests.
- **Frontend (Vue/Vitest)**
  - Add component tests for critical UI (product cards, cart, checkout, auth forms).
  - Add Pinia store tests for `auth`, `shop`, `product`, `ui`.
  - Add end-to-end tests with Playwright covering: login → add to cart → checkout → pay.
- **Action:** Set up `vitest` in both `server/` and `vue-project/`, write 10–15 smoke tests, then mandate tests in PRs.

### 2.2 Input Validation & Error Handling
**Goal:** Backend never crashes on bad input and returns meaningful errors.

- Standardize all controller errors to `{ success: false, message, code? }`.
- Add a global Joi validation wrapper so every route validates params, query, and body.
- Add centralized 500 logging with request IDs.
- **Action:** Refactor `validationMiddleWare.js` and `productValidation.js` into a single validation utility.

### 2.3 Environment & Secrets
**Goal:** Configuration is safe and portable.

- Move `JWT_SECRET`, DB credentials, and upload limits into `.env` only.
- Add `.env.example` and documentation.
- Use `process.env.NODE_ENV` to disable stack traces in production error responses.
- **Action:** Audit all hardcoded URLs/ports in `main.js` and frontend `api.js`.

### 2.4 Frontend State Cleanup
**Goal:** Cart and wishlist stay consistent with backend.

- Sync cart with backend on login/logout and on every add/update.
- Replace local-only wishlist with DB-backed wishlist table (or user preferences).
- Add optimistic UI updates with rollback on failure.
- **Action:** Create a `wishlist.js` store and update `shop.js` cart actions to call `/api/cart`.

---

## 3. Short-Term Enhancements (3–6 months)

### 3.1 Search & Catalog
**Goal:** Users can find products quickly.

- Add full-text search on `productname` and `description` using PostgreSQL `tsvector`.
- Add faceted filters: category, price range, rating, attributes.
- Add product rating/review table and endpoints.
- **Action:** Create `reviews` table, add GIN indexes, and expose `/api/products/search?q=&category=&min_price=&max_price=`.

### 3.2 Inventory & Stock Reliability
**Goal:** Stock numbers are always accurate under concurrency.

- Use row-level locking (`SELECT FOR UPDATE`) in order creation and stock decrement.
- Implement stock reservations (reserve stock during checkout, expire after N minutes).
- Add low-stock email/admin notifications.
- **Action:** Refactor `orderService.createOrderFromCart` to use `SELECT FOR UPDATE` on `stock` rows.

### 3.3 Checkout Flow
**Goal:** Complete purchase UX end-to-end.

- Build checkout page with shipping address form.
- Add `shippingAddress` table linked to users/orders.
- Integrate a real payment gateway (Stripe, PayPal, or local provider).
- Add order confirmation email.
- **Action:** Add `addresses` table, create checkout view, and add Stripe payment intent endpoint.

### 3.4 Admin Dashboard Improvements
**Goal:** Admins can manage the store efficiently.

- Product bulk import/export (CSV/Excel).
- Order management UI (list, update status, refund).
- Sales analytics charts (daily revenue, top products).
- **Action:** Add CSV parser endpoint and frontend dashboard charts.

---

## 4. Medium-Term Scaling (6–12 months)

### 4.1 Caching Layer
**Goal:** Reduce DB load and improve response times.

- Add Redis for:
  - Session/token blacklisting.
  - Product catalog caching (TTL 5–15 min).
  - Cart state (optional, keeps cart fast).
- Use `Cache-Control` headers for static assets and product lists.
- **Action:** Set up Redis, add `ioredis`, cache `GET /api/products`, `GET /api/products/categories`.

### 4.2 Database Scaling
**Goal:** Database can handle growth.

- Add read replicas for reporting and analytics queries.
- Partition large tables (`orders`, `orderItems`, `payments`, `stockLog`) by date.
- Archive old data and keep hot tables small.
- **Action:** Identify slow queries with `pg_stat_statements`, add missing indexes, and plan partitioning.

### 4.3 File Uploads & CDN
**Goal:** Product images are fast and reliable.

- Move from local `cdn/` folder to cloud object storage (AWS S3, Cloudflare R2, MinIO).
- Add image resizing/thumbnails on upload (Sharp or ImageMagick).
- Serve images through a CDN.
- **Action:** Replace `multer.diskStorage` with S3 upload and add thumbnail generation.

### 4.4 Async Background Jobs
**Goal:** Heavy work happens off the request thread.

- Add a job queue (BullMQ + Redis) for:
  - Order confirmation emails.
  - Invoice generation.
  - Stock reports.
  - Image processing.
- **Action:** Add `BullMQ`, create `workers/` directory, and move email sending to a worker.

### 4.5 API Versioning & Documentation
**Goal:** API is stable and discoverable.

- Version public API (`/api/v1/...`).
- Add OpenAPI/Swagger docs generated from code.
- Add API rate limiting per user/IP.
- **Action:** Add `express-rate-limit`, set up `swagger-jsdoc`, and document cart/orders/payments endpoints.

---

## 5. Long-Term Vision (12+ months)

### 5.1 Microservices / Service Boundaries
**Goal:** Scale independent domains.

- Split monolith into services when traffic justifies it:
  - Catalog service (products, categories, search).
  - Order service (orders, cart, payments orchestration).
  - User/Auth service.
  - Notification service.
- Use message queues for inter-service events.
- **Action:** Not immediate; evaluate when daily orders exceed 10k or team size grows.

### 5.2 Multi-Vendor Marketplace
**Goal:** Support multiple sellers.

- Add `sellers`/`vendors` table.
- Link products to sellers; split orders by seller.
- Add seller dashboard and payout tracking.
- **Action:** Schema design for vendors, commissions, and seller payouts.

### 5.3 Mobile Apps
**Goal:** Reach users on mobile.

- Convert Vue frontend to PWA with offline cart browsing.
- Evaluate Capacitor or Flutter for native apps.
- **Action:** Add PWA manifest and service worker in `vue-project/`.

### 5.4 AI / Personalization
**Goal:** Increase conversion.

- Product recommendations based on browsing/purchase history.
- Search autocomplete and typo tolerance.
- Dynamic pricing / discount suggestions.
- **Action:** Add `user_behaviour` events table, integrate Elasticsearch/OpenSearch, prototype recommendation engine.

---

## 6. Security & Compliance

| Area | Goal | Action |
|------|------|--------|
| Authentication | Stronger auth | Add refresh tokens, token rotation, logout blacklisting |
| Authorization | RBAC enforcement | Middleware checks role on every admin route; add role management UI |
| Data protection | GDPR/CCPA readiness | Add user data export/delete endpoints; consent logging |
| Payments | PCI/security | Never log full card data; use gateway tokens |
| Uploads | Prevent abuse | Restrict file types/size; scan uploads; use signed URLs |
| Dependencies | Stay patched | Enable Dependabot; run `npm audit` in CI |
| HTTPS | Encrypt traffic | Enforce TLS in production; secure cookies |

---

## 7. Frontend Enhancements

- **Performance:** Lazy-load routes, optimize images, use Vite bundle analysis.
- **UX:** Add skeleton loaders, toast notifications for async actions, infinite scroll for product lists.
- **Accessibility:** Audit with axe-core; add ARIA labels and keyboard navigation.
- **Internationalization:** Add `vue-i18n` for multi-language support.
- **Design System:** Extract reusable components (Button, Input, Modal, Card) with Storybook.

---

## 8. Infrastructure & DevOps

- **Containerization:** Add `Dockerfile` for backend and frontend; `docker-compose.yml` for local dev (Postgres + Redis + app).
- **CI/CD:** GitHub Actions workflow to lint, test, and build on every PR.
- **Deployment:** Deploy backend to Render/Railway/Fly.io, frontend to Vercel/Netlify.
- **Monitoring:** Add structured logging (Winston/Pino), error tracking (Sentry), metrics (Prometheus + Grafana).
- **Backups:** Automated Postgres backups and tested restore procedure.

---

## 9. Recommended Priority Order

1. **Testing foundation** (immediate)
2. **Validation & error handling** (immediate)
3. **Checkout + shipping + real payment** (short-term)
4. **Search + reviews** (short-term)
5. **Redis caching + rate limiting** (medium-term)
6. **Cloud uploads + CDN** (medium-term)
7. **Background jobs + emails** (medium-term)
8. **Monitoring + CI/CD** (medium-term)
9. **Microservices / multi-vendor / AI** (long-term, evaluated by growth)

---

## 10. Next Concrete Step

Start with **Phase 1 (Testing foundation)** because it unlocks safe delivery of everything else:

```bash
# Backend
cd server
npm install --save-dev vitest supertest @faker-js/faker
# Add test scripts and seed fixtures

# Frontend
cd vue-project
npm install --save-dev @vue/test-utils@next @testing-library/vue
# Add component and store tests
```

Once tests are in place, move to checkout/shipping integration and Redis caching.
