-- ============================================================
-- Add COD fee column to paymentmethod table
-- ============================================================

-- Add fee column (nullable, defaults to 0.00)
ALTER TABLE paymentmethod
    ADD COLUMN IF NOT EXISTS fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00;

-- Set the Cash on Delivery fee to $2.50
UPDATE paymentmethod
SET fee = 2.50
WHERE methodname = 'Cash on Delivery' AND (fee IS NULL OR fee = 0.00);

-- Verify
SELECT methodsid, methodname, description, fee, isactive
FROM paymentmethod
ORDER BY methodsid;
