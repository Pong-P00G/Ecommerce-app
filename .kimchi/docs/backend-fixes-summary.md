# Backend/Schema Fixes — Implementation Summary

> Companion to `backend-schema-fixes-master-plan.md`. Tracks every file
> created or modified across Phases 1–7 and the final static review
> results.

---

## Files Created

### Phase 4 — Cart Module
- `server/src/model/cartModel.js`
- `server/src/services/cartService.js`
- `server/src/controller/cartController.js`
- `server/src/routes/cartRoutes.js`

### Phase 5 — Orders Module
- `server/src/model/orderModel.js`
- `server/src/services/orderService.js`
- `server/src/controller/orderController.js`
- `server/src/routes/orderRoutes.js`

### Phase 6 — Payments Module
- `server/src/model/paymentModel.js`
- `server/src/services/paymentService.js`
- `server/src/controller/paymentController.js`
- `server/src/routes/paymentRoutes.js`

### Phase 7 — Integration
- `.kimchi/docs/backend-fixes-summary.md` (this file)

---

## Files Modified

### Phase 1 — Critical Runtime Bugs
- `server/src/controller/userController.js` — added `getAllUsers`, `getUserById`,
  `createUsers`, `updateUser`, `deleteUser`
- `server/src/routes/userRoutes.js` — fixed `PUT /:id` route; removed duplicate
  `/check-username`
- `server/src/routes/productRoutes.js` — corrected import
  `authMiddleware.js` → `authMiddleWare.js`
- `server/src/routes/imageRoutes.js` — corrected import
  `authMiddleware.js` → `authMiddleWare.js`

### Phase 2 — Schema Validation, Enum, and Role Fixes
- `server/src/middleware/productValidation.js` — restricted `product_status` to
  `active/inactive/archived`; removed `out_of_stock`/`draft`; removed
  `variant_name` from variant schemas
- `server/src/middleware/authMiddleWare.js` — `isAdmin` allows
  `role_id === 1 || 2`; `isUser` allows `role_id === 3`
- `server/src/services/productService.js` — removed `variant_name` usage;
  variant creation uses only `product_id` + `sku`

### Phase 3 — Product Images, Variants, and Stock
- `server/src/model/products/productModel.js` — added `alt_text`, `sort_order`
  to image insert/update/select; generalized variant attributes;
  supported product-level stock (`variantId = NULL`)
- `server/src/services/productService.js` — pass `alt_text`, `sort_order`
  through; accept attribute array and upsert into `variantAttribute` /
  `variantAttributeValue` / `variantOptionValue`; write to `stockLog`
- `server/src/controller/productController.js` — accept `alt_text`,
  `sort_order`
- `server/src/middleware/productValidation.js` — added image fields
- `server/src/model/products/stockLogModel.js` — **(created)** inserts stock
  movements

### Phase 7 — Integration
- `server/src/main.js`
  - Added imports for `cartRoutes`, `orderRoutes`, `paymentRoutes`
  - Mounted `/api/cart`, `/api/orders`, `/api/payments`
  - Fixed root endpoint typo: `product: '/api/product'` →
    `product: '/api/products'`
  - Confirmed route ordering: 404 handler after all routes, global error
    handler last

---

## New API Endpoints

### Cart (`/api/cart`)
| Method | Path                          | Auth   | Description           |
| ------ | ----------------------------- | ------ | --------------------- |
| GET    | `/api/cart`                   | user   | Get current cart      |
| POST   | `/api/cart/items`             | user   | Add or update item    |
| PUT    | `/api/cart/items/:cartItemId` | user   | Update item quantity  |
| DELETE | `/api/cart/items/:cartItemId` | user   | Remove item           |
| DELETE | `/api/cart`                   | user   | Clear cart            |

### Orders (`/api/orders`)
| Method | Path                       | Auth        | Description                  |
| ------ | -------------------------- | ----------- | ---------------------------- |
| POST   | `/api/orders`              | user        | Create order from cart       |
| GET    | `/api/orders`              | user/admin  | List orders (admin sees all) |
| GET    | `/api/orders/:id`          | user/admin  | Get order detail             |
| PUT    | `/api/orders/:id/status`   | admin       | Update order status          |

### Payments (`/api/payments`)
| Method | Path                                  | Auth        | Description                |
| ------ | ------------------------------------- | ----------- | -------------------------- |
| GET    | `/api/payments/methods`               | user        | List active payment methods|
| POST   | `/api/payments/methods`               | admin       | Create payment method      |
| POST   | `/api/payments/orders/:id/pay`        | user        | Record a payment           |
| GET    | `/api/payments/orders/:id/payments`   | user/admin  | Get payments for order     |

> Note: The payments module mounts the order-scoped routes under
> `/api/payments/orders/:id/...` rather than the literal `/api/orders/:id/...`
> mentioned in the master plan. Functionally identical; documented here for
> accuracy.

---

## Final Static Review (Phase 7)

Performed against `server/src/` after all wiring was applied.

| Check                                                          | Result |
| -------------------------------------------------------------- | ------ |
| Any remaining `authMiddleware.js` (lowercase `w`) imports       | **None** — all references use `authMiddleWare.js` |
| Any remaining `variant_name` references                         | **None** — removed across validation/service/model |
| `draft` / `out_of_stock` in `middleware/productValidation.js`  | **None** — enum restricted to `active/inactive/archived` |
| Admin check limited to `role_id !== 1` only                    | **None** — middleware uses `!== 1 && !== 2`; `orderController.js` uses `=== 1 || === 2` |
| Route order in `server/src/main.js`                            | **Correct** — 404 handler after all mounts; global error handler last |
| Default exports on new route modules                           | **All confirmed** — `cartRoutes.js`, `orderRoutes.js`, `paymentRoutes.js` all `export default router` |

---

## Known Limitations

1. **Runtime verification not executed.** Node.js is unavailable in this
   environment, so `npm run dev`, linting, and test runs could not be
   performed. Verification was limited to:
   - File-level inspection of edits
   - Cross-file grep audit for the criteria listed above
   - Static confirmation of import paths and default exports
2. **No automated test suite was added in this environment.** Each
   phase's master plan calls for smoke tests, but a Node test runner
   could not be executed here. Manual smoke testing is required once the
   project is run on a host with Node.js installed.
3. **No database connectivity check.** Schema alignment was verified by
   code review against `allie shop.sql`, not by a live `psql` round-trip.
4. **Payment route paths deviate slightly from the master plan** (see
   note above under *New API Endpoints → Payments*). Either is valid;
   the implementation chooses `/api/payments/orders/:id/...` so that all
   payment endpoints share a single mount point.
