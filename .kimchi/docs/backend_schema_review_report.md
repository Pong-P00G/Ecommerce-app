# Backend ↔ Schema Review: `allie shop.sql`

## 1. Executive Summary

| Aspect | Verdict |
|--------|---------|
| **Database connection & naming** | Mostly matches |
| **Implemented domain coverage** | Products, categories, variants, stock, discounts, users, auth, dashboard stats, image upload |
| **Missing domain coverage** | Cart, orders, order items, payments, payment methods, stock log, roles management |
| **Critical runtime bugs** | 3 issues that will crash or fail on Linux |
| **Schema-level mismatches** | Status enum, missing variant discounts, no product-level stock, hardcoded Color/Size variants, etc. |

## 2. What Matches Well

- Products, categories, variants, stock, discounts, users – table/column names mapped consistently.
- Backend correctly queries `view_products` and `view_stock_low`.
- User password hashing relies on DB trigger `trg_before_insert_user` / `trg_before_update_user`.
- JWT-based auth protection is in place.
- Multer image upload stores files under `cdn/images/products` and serves via `/cdn`.

## 3. Critical Runtime Bugs

### 3.1 Missing user CRUD controller exports
`controller/userController.js` exports only `registerUser`, `loginUser`, `checkUsername`, `checkEmail`.
`routes/userRoutes.js` calls `userController.getAllUsers`, `getUserById`, `createUsers`, `updateUser`, `deleteUser` which do not exist.

**Result:** `GET /api/users`, `POST /api/users`, `PUT /api/users`, `DELETE /api/users/:id` will throw `TypeError`.

### 3.2 Case-sensitive import mismatch
`routes/productRoutes.js` and `routes/imageRoutes.js` import:
```js
'../middleware/authMiddleware.js'
```
Actual file:
```js
middleware/authMiddleWare.js   // capital W
```
**Result:** `Module not found` on Linux/Unix.

### 3.3 `PUT /api/users` missing id parameter
```js
router.put('/', protect, validateUpdate, userController.updateUser)
```
`updateUser` requires an `id`, but none is provided.

## 4. Schema Mismatches by Table

| Schema Table | Backend Status | Mismatch Detail |
|--------------|----------------|-----------------|
| `roles` | Partial | Referenced but no management endpoints |
| `users` | Partial | `isActive` read-only; `updatedAt` only updates on password change |
| `category` | Partial | `parentId` ignored in create/update |
| `products` | Partial | Validation allows `draft`, `out_of_stock`; schema only allows `active/inactive/archived` |
| `productImages` | Partial | `altText` and `sortOrder` not inserted |
| `variantAttribute` / `variantAttributeValue` | Partial | Only hardcoded `Color` and `Size` supported |
| `variants` | Partial | `variant_name` validated but column does not exist in schema and is discarded |
| `stock` | Partial | Cannot handle `variantId = NULL` (product-level stock) |
| `stockLog` | Missing | No implementation |
| `discounts` | Partial | `variantId`-level discounts not supported |
| `cart` / `cartItems` | Missing | No implementation |
| `orders` / `orderItems` | Missing | No implementation |
| `paymentMethod` / `payments` | Missing | No implementation |

## 5. Logic / Convention Issues

- **Admin role check too narrow:** `isAdmin` allows only `role_id === 1`, but schema has `2 = admin` too.
- **User role check wrong:** `isUser` checks `role_id === 2`, but customer role is `3`.
- **Password verification inconsistency:** Schema provides `verify_password()`; backend uses `bcrypt` npm package.
- **`updatedAt` not maintained:** `products` and `users` updates do not refresh `updatedAt`.
- **`main.js` typo:** `product: '/api/product'` should be `/api/products`.

## 6. Recommendations (Priority Order)

1. **Fix runtime crashes** – implement user CRUD controller or remove broken routes; fix `authMiddleware.js` import case.
2. **Align status enum** – allow only `active`, `inactive`, `archived`.
3. **Fix admin role check** – allow `role_id === 1 || role_id === 2`.
4. **Implement missing e-commerce modules** – cart, orders, order items, payments, stock log.
5. **Clean schema mismatches** – remove `variant_name`, support `altText`/`sortOrder`, support arbitrary variant attributes, support product-level stock, write to `stockLog`.
6. **Unify password strategy** – use schema functions consistently or remove DB trigger.
