import * as settingsService from '../services/settingsService.js';

// GET /api/settings
export const getSettings = async (req, res) => {
    try {
        const settings = await settingsService.getAllSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// PUT /api/settings  (admin only — enforced by middleware)
export const updateSettings = async (req, res) => {
    try {
        const updated = await settingsService.updateSettings(req.body, req.user.role_id);
        res.json({
            success: true,
            message: 'Settings updated',
            data: updated
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};
