# Backend/Schema Fixes — Master Implementation Plan

> **Goal:** Fix all mismatches between the Express backend (`server/src/`) and the `allie shop.sql` schema, including critical runtime bugs, schema-level mismatches, and missing e-commerce modules (cart, orders, payments).

> **Approach:** Work in independent, testable phases. Each phase produces passing tests and a working slice of the API before moving to the next. Use the existing layered structure: `routes → controllers → services → models`.

> **Tech Stack:** Node.js, Express 5, PostgreSQL (`pg`), Joi, bcrypt, JWT, Multer.

---

## Phase 1 — Critical Runtime Bugs
**Goal:** Eliminate immediate crashes/failures.

**Files to modify:**
- `server/src/controller/userController.js` — add `getAllUsers`, `getUserById`, `createUsers`, `updateUser`, `deleteUser`
- `server/src/routes/userRoutes.js` — fix `PUT /:id` route and remove duplicate `/check-username`
- `server/src/routes/productRoutes.js` — change `authMiddleware.js` → `authMiddleWare.js`
- `server/src/routes/imageRoutes.js` — change `authMiddleware.js` → `authMiddleWare.js`

**Acceptance criteria:**
- `npm run dev` starts without `Module not found`.
- `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id` respond correctly.

---

## Phase 2 — Schema Validation, Enum, and Role Fixes
**Goal:** Align validation, enums, and role checks with the schema.

**Files to modify:**
- `server/src/middleware/productValidation.js` — restrict `product_status` to `active/inactive/archived`; remove `out_of_stock`/`draft`
- `server/src/middleware/authMiddleWare.js` — `isAdmin` allows `role_id === 1 || 2`; `isUser` allows `role_id === 3`
- `server/src/services/productService.js` — remove `variant_name` usage; create variant with only `product_id` + `sku`
- `server/src/middleware/productValidation.js` — remove `variant_name` from variant schemas
- `server/src/controller/productController.js` / `server/src/model/products/productModel.js` — ensure variants use only schema columns

**Acceptance criteria:**
- Creating a product with `status: 'draft'` returns 400.
- Admin with `role_id === 2` can access admin routes.
- Creating/updating a variant no longer references `variant_name`.

---

## Phase 3 — Product Images, Variants, and Stock
**Goal:** Fully support the image/stock/variant schema.

**Files to modify/create:**
- `server/src/model/products/productModel.js` — add `alt_text`, `sort_order` to image insert/update/select
- `server/src/services/productService.js` — pass `alt_text`, `sort_order` through
- `server/src/controller/productController.js` — accept `alt_text`, `sort_order`
- `server/src/middleware/productValidation.js` — add image fields
- `server/src/model/products/productModel.js` — generalize variant attributes beyond Color/Size
- `server/src/services/productService.js` — accept attribute array and upsert into `variantAttribute` / `variantAttributeValue` / `variantOptionValue`
- `server/src/model/products/productModel.js` — support product-level stock (`variantId = NULL`)
- `server/src/model/products/stockLogModel.js` **(create)** — insert stock movements
- `server/src/services/productService.js` — write to `stockLog` on every stock change

**Acceptance criteria:**
- Images can include `alt_text` and `sort_order`.
- Variants can have arbitrary attributes (e.g., Storage).
- Stock can be set for a product without a variant.
- Every stock update inserts a row into `stockLog`.

---

## Phase 4 — Cart Module
**Goal:** Implement `cart` and `cartItems` tables.

**Files to create:**
- `server/src/model/cartModel.js`
- `server/src/services/cartService.js`
- `server/src/controller/cartController.js`
- `server/src/routes/cartRoutes.js`

**API endpoints:**
- `GET /api/cart` — get current user's cart
- `POST /api/cart/items` — add/update item
- `PUT /api/cart/items/:cartItemId` — update quantity
- `DELETE /api/cart/items/:cartItemId` — remove item
- `DELETE /api/cart` — clear cart

**Acceptance criteria:**
- Authenticated user has one cart.
- Items are unique by `(cartId, productsId, variantId)`.
- Adding same product+variant updates quantity.

---

## Phase 5 — Orders Module
**Goal:** Implement `orders` and `orderItems` tables.

**Files to create:**
- `server/src/model/orderModel.js`
- `server/src/services/orderService.js`
- `server/src/controller/orderController.js`
- `server/src/routes/orderRoutes.js`

**API endpoints:**
- `POST /api/orders` — create order from cart
- `GET /api/orders` — list user's orders (admin sees all)
- `GET /api/orders/:id` — get order detail
- `PUT /api/orders/:id/status` — update order status (admin)

**Acceptance criteria:**
- Order creation decrements stock, clears cart, calculates total.
- `orderItems` stores `unitPrice` at time of order.
- Admin can update status through allowed enum values.

---

## Phase 6 — Payments Module
**Goal:** Implement `paymentMethod` and `payments` tables.

**Files to create:**
- `server/src/model/paymentModel.js`
- `server/src/services/paymentService.js`
- `server/src/controller/paymentController.js`
- `server/src/routes/paymentRoutes.js`

**API endpoints:**
- `GET /api/payments/methods` — list active payment methods
- `POST /api/payments/methods` — create payment method (admin)
- `POST /api/orders/:id/pay` — record a payment
- `GET /api/orders/:id/payments` — get payments for order

**Acceptance criteria:**
- Payments reference `ordersId`, `methodsId`, optional `discountsId`.
- Payment status follows enum `pending/paid/failed/refunded`.

---

## Phase 7 — Integration, Routes Wiring, and Final Review
**Goal:** Wire new modules into the app and verify everything.

**Files to modify:**
- `server/src/main.js` — mount `/api/cart`, `/api/orders`, `/api/payments`; fix `/api/products` typo
- `server/src/main.js` — ensure correct route order (404 handler last)
- Add/adjust tests in `server/` if a test runner is configured

**Final acceptance criteria:**
- `npm run dev` starts cleanly.
- All new routes respond correctly.
- No unmounted routes or broken imports.
- Reviewer verifies schema alignment.

---

## Cross-Cutting Concerns

- **Case sensitivity:** All imports on Linux must match file names exactly (`authMiddleWare.js`).
- **Error handling:** Continue existing pattern of `try/catch` returning `{ success: false, message: ... }`.
- **DB transactions:** Use `db.query('BEGIN') ... COMMIT/ROLLBACK` for multi-step operations (create order, create complete product).
- **Tests:** Each phase includes at least smoke tests for the new endpoints; prefer Vitest if already configured in `server/`, otherwise use a simple `node --test` suite.
