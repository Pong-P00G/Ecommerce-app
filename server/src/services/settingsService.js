import * as SettingsModel from '../model/settingsModel.js';

const httpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

/**
 * Return all store settings.
 */
export const getAllSettings = async () => {
    const rows = await SettingsModel.getAllSettings();
    // Convert array of { key, value } to a flat object
    const result = {};
    for (const row of rows) {
        result[row.key] = row.value;
    }
    return result;
};

/**
 * Update multiple settings at once. Admin only.
 * Accepts an object of { key: value } pairs.
 */
export const updateSettings = async (settings, roleId) => {
    if (roleId !== 1 && roleId !== 2) {
        throw httpError(403, 'Admin privileges required');
    }

    if (!settings || typeof settings !== 'object' || Object.keys(settings).length === 0) {
        throw httpError(400, 'No settings provided');
    }

    // Validate known settings
    const knownKeys = [
        'tax_rate', 'default_currency', 'currency_symbol',
        'free_shipping_threshold', 'default_shipping_origin',
        'order_tax_label',
    ];

    for (const key of Object.keys(settings)) {
        if (!knownKeys.includes(key)) {
            throw httpError(400, `Unknown setting: "${key}"`);
        }
    }

    // Validate specific fields
    if (settings.tax_rate != null) {
        const rate = Number(settings.tax_rate);
        if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
            throw httpError(400, 'tax_rate must be between 0 and 100');
        }
    }

    if (settings.free_shipping_threshold != null) {
        const val = Number(settings.free_shipping_threshold);
        if (!Number.isFinite(val) || val < 0) {
            throw httpError(400, 'free_shipping_threshold must be a non-negative number');
        }
    }

    const results = await SettingsModel.bulkUpsertSettings(settings);

    // Return the updated flat object
    const updated = await getAllSettings();
    return updated;
};
