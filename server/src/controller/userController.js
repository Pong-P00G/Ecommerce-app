import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    try {
        const newUser = await userService.register(req.body);
        const { password_hash, ...userWithoutPassword } = newUser;

        // Generate token for auto-login after registration
        const token = jwt.sign(
            { id: userWithoutPassword.user_id, role_id: userWithoutPassword.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            user: userWithoutPassword,
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

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create new user(s)
export const createUsers = async (req, res) => {
    try {
        const newUser = await userService.createUsers(req.body);
        const { password_hash, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const updated = await userService.updateUser(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const deleted = await userService.deleteUser(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};