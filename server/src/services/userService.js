import bcrypt from 'bcrypt';
import * as UserModels from '../model/userModel.js';
import { notifyNewUser } from './dashboardService.js';

// Get all users
export const getAllUsers = async () => {
    return await UserModels.getAllUsers();
};

// Get user by id
export const getUserById = async (id) => {
    return await UserModels.getUserById(id);
};

// Get user by email
export const getUserByEmail = async (email) => {
    return await UserModels.getUserByEmail(email);
};

// Get user by username
export const getUserByUsername = async (username) => {
    return await UserModels.getUserByUsername(username);
};

// Get user by email or username
export const getUserByEmailOrUsername = async (identifier) => {
    return await UserModels.getUserByEmailOrUsername(identifier);
};

// Create users — hashes password in app layer
export const createUsers = async (userData) => {
    const plainPassword = userData.password || userData.password_hash;
    const hashedPassword = plainPassword ? await bcrypt.hash(plainPassword, 12) : null;

    return await UserModels.createUsers({
        role_id: userData.role_id,
        username: userData.username,
        first_name: userData.first_name,
        mid_name: userData.mid_name || null,
        last_name: userData.last_name,
        email: userData.email,
        password_hash: hashedPassword
    });
};

// Update User — hash password in app layer if changing
export const updateUser = async (id, userData) => {
    const data = { ...userData };
    if (data.password || data.password_hash) {
        const plainPassword = data.password || data.password_hash;
        data.password_hash = await bcrypt.hash(plainPassword, 12);
        delete data.password;
    }
    return await UserModels.updateUsers(id, data);
};

// Delete User
export const deleteUser = async (id) => {
    return await UserModels.deleteUser(id);
};

// Check if email exists
export const emailExists = async (email) => {
    return await UserModels.emailExists(email);
};

// Check if username exists
export const usernameExists = async (username) => {
    return await UserModels.usernameExists(username);
};

// Register new user — password is hashed in app layer
export const register = async (data) => {
    const existingEmail = await UserModels.emailExists(data.email);
    if (existingEmail) throw new Error('Email already exists');

    const existingUsername = await UserModels.usernameExists(data.username);
    if (existingUsername) throw new Error('Username already taken');

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await UserModels.createUsers({
        role_id: 3, // public registration is always customer
        username:      data.username,
        first_name:    data.first_name,
        mid_name:      data.mid_name || null,
        last_name:     data.last_name,
        email:         data.email,
        password_hash: hashedPassword
    });

    // Fire-and-forget: notify admins of new registration
    notifyNewUser(user.username, false).catch(() => {});

    return user;
};

// Login user with email or username
export const login = async (identifier, password) => {
    if (!identifier || !password) {
        throw new Error('Email/Username and password are required');
    }
    
    // Find user by identifier
    const user = await UserModels.getUserByEmailOrUsername(identifier);
    
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    
    return user;
};