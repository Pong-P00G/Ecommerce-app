-- ============================================================
-- Migration: Add Cash on Delivery payment method
-- ============================================================

INSERT INTO paymentmethod (methodname, description, isactive)
VALUES ('Cash on Delivery', 'Pay with cash when your order arrives at your doorstep. No online payment required.', TRUE)
ON CONFLICT (methodname) DO NOTHING;
