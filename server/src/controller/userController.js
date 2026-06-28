import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    try {
        const newUser = await userService.register(req.body);
        
        // Generate token for auto-login after registration
        const token = jwt.sign(
            { id: newUser.user_id, role_id: newUser.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({ 
            user: newUser, 
            token,
            message: 'Registration successful' 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login User - supports both email and username
export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        if (!identifier || !password) {
            return res.status(400).json({ 
                message: 'Email/Username and password are required' 
            });
        }
        
        // Login with identifier (can be email or username)
        const user = await userService.login(identifier, password);
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Remove password from response
        const { password_hash, ...userWithoutPassword } = user;
        
        res.json({ 
            token, 
            user: userWithoutPassword,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Check username availability
export const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || username.length < 4) {
            return res.status(400).json({
                available: false,
                message: 'Username must be at least 4 characters'
            });
        }

        const existingUser = await userService.getUserByUsername(username);

        res.json({
            available: !existingUser,
            message: existingUser ? 'Username already taken' : 'Username available'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check email availability
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                available: false,
                message: 'Email is required'
            });
        }

        const exists = await userService.emailExists(email);

        res.json({
            available: !exists,
            message: exists ? 'Email already registered' : 'Email available'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};