-- ============================================================
-- Store Settings table — key-value store for global config
-- ============================================================

CREATE TABLE IF NOT EXISTS store_settings (
    setting_key   VARCHAR(100) PRIMARY KEY,
    setting_value TEXT         NOT NULL,
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Seed default settings
INSERT INTO store_settings (setting_key, setting_value) VALUES
    ('tax_rate',                '8'),
    ('default_currency',        'USD'),
    ('currency_symbol',         '$'),
    ('free_shipping_threshold', '50'),
    ('default_shipping_origin', 'Phnom Penh, Cambodia'),
    ('order_tax_label',         'Tax ({rate}%)')
ON CONFLICT (setting_key) DO NOTHING;

-- Verify
SELECT * FROM store_settings ORDER BY setting_key;
