import * as newsletterModel from '../model/newsletterModel.js';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const subscriber = await newsletterModel.subscribe(email);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the newsletter!',
            data: subscriber
        });
    } catch (error) {
        console.error('Newsletter subscribe error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again later.'
        });
    }
};
