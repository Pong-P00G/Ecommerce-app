import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    try {
        let token;
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            role_id: decoded.role_id
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Check is admin
export const isAdmin = (req, res, next) => {
    // Check if user exists (should be set by protect middleware)
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no user found'
        });
    }

    // Check if user has admin role (role_id = 1 or 2)
    if (req.user.role_id !== 1 && req.user.role_id !== 2) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

// Check is user
export const isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no user found'
        });
    }

    // Check if user has User/Customer role (role_id = 3)
    if (req.user.role_id !== 3) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. User role required.'
        });
    }

    next();
};

export default protect;