-- ============================================================
--  E-Commerce Database Schema
--  PostgreSQL 18 | Created: 2026
-- ============================================================

-- ============================================================
-- 1. ROLES (parent — no FK)
-- ============================================================
CREATE TABLE roles (
    rolesId     INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rolename    VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(250),
    createdAt   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. USERS (references roles)
-- ============================================================
CREATE TABLE users (
    usersId      INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rolesId      INTEGER      NOT NULL,
    username     VARCHAR(255) NOT NULL UNIQUE,
    email        VARCHAR(250) NOT NULL UNIQUE,
    firstname    VARCHAR(100) NOT NULL,
    midname      VARCHAR(100),
    lastname     VARCHAR(100) NOT NULL,
    -- PostgreSQL 18: virtual generated column (computed at read time)
    fullname     VARCHAR(300) GENERATED ALWAYS AS (
                    firstname || ' ' || COALESCE(midname || ' ', '') || lastname) STORED,
    passwordHash VARCHAR(250) NOT NULL,
    isActive     BOOLEAN      DEFAULT TRUE,
    createdAt    TIMESTAMPTZ  DEFAULT NOW(),
    updatedAt    TIMESTAMPTZ  DEFAULT NOW(),

    FOREIGN KEY (rolesId) REFERENCES roles(rolesId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- 3. CATEGORY (self-referencing for parent/child categories)
-- ============================================================
CREATE TABLE category (
    categoriesId INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parentId     INTEGER,                        -- NULL = top-level category
    categoryname VARCHAR(50) NOT NULL UNIQUE,
    createdAt    TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (parentId) REFERENCES category(categoriesId)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ============================================================
-- 4. PRODUCTS (references category)
-- ============================================================
CREATE TABLE products (
    productsId   INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoriesId INTEGER       NOT NULL,
    productname  VARCHAR(300)  NOT NULL,
    baseprice    DECIMAL(10,2) NOT NULL CHECK (baseprice >= 0),
    description  TEXT,
    status       VARCHAR(50)   NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'inactive', 'archived')),
    createdAt    TIMESTAMPTZ   DEFAULT NOW(),
    updatedAt    TIMESTAMPTZ   DEFAULT NOW(),

    FOREIGN KEY (categoriesId) REFERENCES category(categoriesId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- 5. PRODUCT IMAGES (references products)
-- ============================================================
CREATE TABLE productImages (
    imageId     INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    productsId  INTEGER      NOT NULL,
    imageUrl    TEXT         NOT NULL,
    altText     VARCHAR(255),
    isThumbnail BOOLEAN      DEFAULT FALSE,
    sortOrder   INTEGER      DEFAULT 0,
    createdAt   TIMESTAMPTZ  DEFAULT NOW(),

    FOREIGN KEY (productsId) REFERENCES products(productsId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- 6. VARIANT ATTRIBUTES  e.g. "Color", "Size", "Storage"
-- ============================================================
CREATE TABLE variantAttribute (
    attributeId   INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    attributeName VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- 7. VARIANT ATTRIBUTE VALUES  e.g. "Black", "128GB", "XL"
-- ============================================================
CREATE TABLE variantAttributeValue (
    valueId     INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    attributeId INTEGER      NOT NULL,
    value       VARCHAR(100) NOT NULL,

    FOREIGN KEY (attributeId) REFERENCES variantAttribute(attributeId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (attributeId, value)
);

-- ============================================================
-- 8. VARIANTS (references products)
-- ============================================================
CREATE TABLE variants (
    variantId  INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    productsId INTEGER      NOT NULL,
    sku        VARCHAR(100) NOT NULL UNIQUE,
    createdAt  TIMESTAMPTZ  DEFAULT NOW(),

    FOREIGN KEY (productsId) REFERENCES products(productsId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- 9. VARIANT OPTION VALUES — links variant to attribute values
--    e.g. variantId=1 → Black + 128GB
-- ============================================================
CREATE TABLE variantOptionValue (
    variantId INTEGER NOT NULL,
    valueId   INTEGER NOT NULL,

    PRIMARY KEY (variantId, valueId),

    FOREIGN KEY (variantId) REFERENCES variants(variantId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (valueId) REFERENCES variantAttributeValue(valueId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- 10. STOCK — one row per product+variant combination
-- ============================================================
CREATE TABLE stock (
    stockId    INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    productsId INTEGER       NOT NULL,
    variantId  INTEGER,                          -- NULL = product with no variants
    quantity   INTEGER       NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    minStock   INTEGER       DEFAULT 5,
    updatedAt  TIMESTAMPTZ   DEFAULT NOW(),

    FOREIGN KEY (productsId) REFERENCES products(productsId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (variantId) REFERENCES variants(variantId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (productsId, variantId)
);

-- ============================================================
-- 11. STOCK LOG — full history of every stock movement
-- ============================================================
CREATE TABLE stockLog (
    logId      INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    stockId    INTEGER      NOT NULL,
    usersId    INTEGER,
    changeType VARCHAR(50)  NOT NULL
                            CHECK (changeType IN ('IN', 'OUT', 'ADJUST', 'RETURN', 'DAMAGED')),
    quantity   INTEGER      NOT NULL,
    reason     VARCHAR(300),
    createdAt  TIMESTAMPTZ  DEFAULT NOW(),

    FOREIGN KEY (stockId) REFERENCES stock(stockId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (usersId) REFERENCES users(usersId)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ============================================================
-- 12. DISCOUNTS (references products and variants)
-- ============================================================
CREATE TABLE discounts (
    discountsId INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    productsId  INTEGER,
    variantId   INTEGER,
    amounts     DECIMAL(10,2) NOT NULL CHECK (amounts > 0),
    startDate   TIMESTAMPTZ   NOT NULL,
    endDate     TIMESTAMPTZ   NOT NULL,
    CHECK (endDate > startDate),

    FOREIGN KEY (productsId) REFERENCES products(productsId)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    FOREIGN KEY (variantId) REFERENCES variants(variantId)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

-- ============================================================
-- 13. CART — one per user
-- ============================================================
CREATE TABLE cart (
    cartId    INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usersId   INTEGER     NOT NULL UNIQUE,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (usersId) REFERENCES users(usersId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- 14. CART ITEMS
-- ============================================================
CREATE TABLE cartItems (
    cartItemId INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cartId     INTEGER       NOT NULL,
    productsId INTEGER       NOT NULL,
    variantId  INTEGER,
    quantity   INTEGER       NOT NULL DEFAULT 1 CHECK (quantity > 0),
    addedAt    TIMESTAMPTZ   DEFAULT NOW(),

    FOREIGN KEY (cartId) REFERENCES cart(cartId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (productsId) REFERENCES products(productsId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (variantId) REFERENCES variants(variantId)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    UNIQUE (cartId, productsId, variantId)      -- prevent duplicate cart entries
);

-- ============================================================
-- 15. ORDERS (references users)
-- ============================================================
CREATE TABLE orders (
    ordersId    INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usersId     INTEGER       NOT NULL,
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    totalAmount DECIMAL(10,2) DEFAULT 0 CHECK (totalAmount >= 0),
    createdAt   TIMESTAMPTZ   DEFAULT NOW(),
    updatedAt   TIMESTAMPTZ   DEFAULT NOW(),

    FOREIGN KEY (usersId) REFERENCES users(usersId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- 16. ORDER ITEMS
-- ============================================================
CREATE TABLE orderItems (
    orderItemId INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ordersId    INTEGER       NOT NULL,
    productsId  INTEGER       NOT NULL,
    variantId   INTEGER,
    quantity    INTEGER       NOT NULL CHECK (quantity > 0),
    unitPrice   DECIMAL(10,2) NOT NULL CHECK (unitPrice >= 0),
    -- PostgreSQL 18: generated column for subtotal
    subtotal    DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unitPrice) STORED,
    createdAt   TIMESTAMPTZ   DEFAULT NOW(),

    FOREIGN KEY (ordersId) REFERENCES orders(ordersId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (productsId) REFERENCES products(productsId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (variantId) REFERENCES variants(variantId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- 17. PAYMENT METHOD
-- ============================================================
CREATE TABLE paymentMethod (
    methodsId   INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    methodName  VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(300),
    isActive    BOOLEAN      DEFAULT TRUE
);

-- ============================================================
-- 18. PAYMENTS (references orders, paymentMethod, discounts)
-- ============================================================
CREATE TABLE payments (
    paymentsId  INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ordersId    INTEGER       NOT NULL,
    methodsId   INTEGER       NOT NULL,
    discountsId INTEGER,
    amount      DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    paidAt      TIMESTAMPTZ   DEFAULT NOW(),

    FOREIGN KEY (ordersId) REFERENCES orders(ordersId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (methodsId) REFERENCES paymentMethod(methodsId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (discountsId) REFERENCES discounts(discountsId)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- ============================================================
--  INDEXES for query performance
-- ============================================================
CREATE INDEX idx_users_email       ON users(email);
CREATE INDEX idx_users_rolesId     ON users(rolesId);
CREATE INDEX idx_products_category ON products(categoriesId);
CREATE INDEX idx_variants_product  ON variants(productsId);
CREATE INDEX idx_stock_product     ON stock(productsId);
CREATE INDEX idx_stock_variant     ON stock(variantId);
CREATE INDEX idx_orders_user       ON orders(usersId);
CREATE INDEX idx_orderItems_order  ON orderItems(ordersId);
CREATE INDEX idx_cartItems_cart    ON cartItems(cartId);
CREATE INDEX idx_payments_order    ON payments(ordersId);
CREATE INDEX idx_discounts_product ON discounts(productsId);



-- ============================================================
--  VIEWS & FUNCTIONS
--  PostgreSQL 18 | E-Commerce Schema
-- ============================================================

-- ============================================================
--  REQUIREMENT: Enable pgcrypto for password hashing
--  Run once per database:
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
--  FUNCTION 1: hash_password
--  Hashes a plain-text password using bcrypt (pgcrypto)
--  Usage: SELECT hash_password('asdea0123');
-- ============================================================
CREATE OR REPLACE FUNCTION hash_password(plain_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    -- crypt() with gen_salt('bf') = bcrypt, cost factor 12
    RETURN crypt(plain_password, gen_salt('bf', 12));
END;
$$;


-- ============================================================
--  FUNCTION 2: verify_password
--  Verifies a plain password against a stored hash
--  Usage: SELECT verify_password('asdea0123', passwordHash) FROM users WHERE email = '...';
--  Returns: TRUE or FALSE
-- ============================================================
CREATE OR REPLACE FUNCTION verify_password(plain_password TEXT, stored_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN stored_hash = crypt(plain_password, stored_hash);
END;
$$;


-- ============================================================
--  TRIGGER FUNCTION: before_insert_user
--  Intercepts INSERT on users table
--  Automatically hashes passwordHash before storing
-- ============================================================
CREATE OR REPLACE FUNCTION before_insert_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Hash the plain password before insert
    IF NEW.passwordHash IS NOT NULL THEN
        NEW.passwordHash := crypt(NEW.passwordHash, gen_salt('bf', 12));
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
--  TRIGGER: attach before_insert_user to users table
-- ============================================================
CREATE OR REPLACE TRIGGER trg_before_insert_user
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION before_insert_user();


-- ============================================================
--  TRIGGER FUNCTION: before_update_user_password
--  If passwordHash is changed on UPDATE, re-hash it
-- ============================================================
CREATE OR REPLACE FUNCTION before_update_user_password()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only re-hash if the password field actually changed
    IF NEW.passwordHash IS DISTINCT FROM OLD.passwordHash THEN
        NEW.passwordHash := crypt(NEW.passwordHash, gen_salt('bf', 12));
    END IF;

    -- Auto-update updatedAt timestamp
    NEW.updatedAt := NOW();

    RETURN NEW;
END;
$$;

-- ============================================================
--  TRIGGER: attach before_update_user_password to users table
-- ============================================================
CREATE OR REPLACE TRIGGER trg_before_update_user
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION before_update_user_password();


-- ============================================================
--  DEMO: How it works
-- ============================================================

INSERT INTO roles (rolename, description)
VALUES
    ('superadmin', 'Highest privileges — full system access, manage admins and settings'),
    ('admin',      'Manage products, orders, stock, users, and reports'),
    ('user',       'Customer — browse products, place orders, manage own profile');

-- INSERT with plain password → trigger hashes it automatically
INSERT INTO users (rolesId, username, email, firstname, midname, lastname, passwordHash)
VALUES (1, 'SuperAdmin', 'superadmin@super.com', 'super', 'admin', 'user', 'superadmin@123');

-- Check — passwordHash is now a bcrypt hash, NOT plain text
SELECT usersId, username, email, passwordHash FROM users WHERE username = 'SuperAdmin';
-- Result: $2a$12$abcdefghijklmnopqrstuuXYZ...  (bcrypt hash)

-- Verify login — returns TRUE if password matches
SELECT verify_password('superadmin@123', passwordHash)
FROM users
WHERE email = 'superadmin@super.com';
-- Result: TRUE ✅

-- Wrong password → returns FALSE
SELECT verify_password('superadmin@123', passwordHash)
FROM users
WHERE email = 'superadmin@super.com';
-- Result: FALSE ❌


-- ============================================================
--  VIEW 1: view_users
--  Shows users with role name — hides passwordHash
-- ============================================================
CREATE OR REPLACE VIEW view_users AS
SELECT
    u.usersId,
    u.username,
    u.email,
    u.fullname,
    u.firstname,
    u.midname,
    u.lastname,
    r.rolename,
    u.isActive,
    u.createdAt
FROM users u
JOIN roles r ON u.rolesId = r.rolesId;


-- ============================================================
--  VIEW 2: view_products
--  Products with category name, thumbnail image, and stock
-- ============================================================
CREATE OR REPLACE VIEW view_products AS
SELECT
    p.productsId,
    p.productname,
    p.baseprice,
    p.description,
    p.status,
    c.categoryname,
    pi.imageUrl      AS thumbnail,
    COALESCE(SUM(s.quantity), 0) AS totalStock,
    p.createdAt
FROM products p
JOIN category c         ON p.categoriesId = c.categoriesId
LEFT JOIN productImages pi
        ON p.productsId = pi.productsId AND pi.isThumbnail = TRUE
LEFT JOIN stock s       ON p.productsId = s.productsId
GROUP BY
    p.productsId, p.productname, p.baseprice,
    p.description, p.status,
    c.categoryname, pi.imageUrl, p.createdAt;


-- ============================================================
--  VIEW 3: view_stock_low
--  Products/variants where quantity is below minStock threshold
-- ============================================================
CREATE OR REPLACE VIEW view_stock_low AS
SELECT
    s.stockId,
    p.productname,
    v.sku,
    s.quantity,
    s.minStock,
    (s.minStock - s.quantity) AS shortage
FROM stock s
JOIN products p         ON s.productsId = p.productsId
LEFT JOIN variants v    ON s.variantId = v.variantId
WHERE s.quantity < s.minStock
ORDER BY shortage DESC;


-- ============================================================
--  VIEW 4: view_orders
--  Orders with user info and payment status
-- ============================================================
CREATE OR REPLACE VIEW view_orders AS
SELECT
    o.ordersId,
    u.username,
    u.email,
    o.status          AS orderStatus,
    o.totalAmount,
    pay.status        AS paymentStatus,
    pm.methodName     AS paymentMethod,
    o.createdAt
FROM orders o
JOIN users u            ON o.usersId = u.usersId
LEFT JOIN payments pay  ON o.ordersId = pay.ordersId
LEFT JOIN paymentMethod pm ON pay.methodsId = pm.methodsId;


-- ============================================================
--  VIEW 5: view_order_detail
--  Full order breakdown with products and variants
-- ============================================================
CREATE OR REPLACE VIEW view_order_detail AS
SELECT
    oi.orderItemId,
    o.ordersId,
    u.username,
    p.productname,
    v.sku,
    oi.quantity,
    oi.unitPrice,
    oi.subtotal,
    o.status,
    o.createdAt
FROM orderItems oi
JOIN orders o           ON oi.ordersId = o.ordersId
JOIN users u            ON o.usersId = u.usersId
JOIN products p         ON oi.productsId = p.productsId
LEFT JOIN variants v    ON oi.variantId = v.variantId;


-- ============================================================
--  VIEW 6: view_cart
--  Active cart items with live product price
-- ============================================================
CREATE OR REPLACE VIEW view_cart AS
SELECT
    ci.cartItemId,
    c.usersId,
    u.username,
    p.productname,
    v.sku,
    p.baseprice        AS currentPrice,
    ci.quantity,
    ROUND(p.baseprice * ci.quantity, 2) AS lineTotal,
    ci.addedAt
FROM cartItems ci
JOIN cart c             ON ci.cartId = c.cartId
JOIN users u            ON c.usersId = u.usersId
JOIN products p         ON ci.productsId = p.productsId
LEFT JOIN variants v    ON ci.variantId = v.variantId;

