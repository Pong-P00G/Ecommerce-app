import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const users = await userService.getUserById();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Users
export const createUsers = async (req, res) => {
    try {
        const user = await userService.createUsers(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userService.updateUser(id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await userService.verifyUser(email, username, password);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.userid, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        const admin = user.role === 'admin';
        res.json({ token, user, admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};