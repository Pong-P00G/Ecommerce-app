import bcrypt from 'bcrypt';
import * as UserModels from '../model/userModel.js';

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

// Create users
export const createUsers = async (userData) => {
    return await UserModels.createUsers(userData);
};

// Update User
export const updateUser = async (id, userData) => {
    // If updating password, hash it first
    if (userData.password_hash) {
        userData.password_hash = await bcrypt.hash(userData.password_hash, 10);
    }
    return await UserModels.updateUsers(id, userData);
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

// Register new user
export const register = async (data) => {
    // Check if email already exists
    const existingEmail = await UserModels.emailExists(data.email);
    if (existingEmail) {
        throw new Error('Email already exists');
    }
    
    // Check if username already exists
    const existingUsername = await UserModels.usernameExists(data.username);
    if (existingUsername) {
        throw new Error('Username already taken');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return await UserModels.createUsers({
        role_id: data.role_id || 2,
        username: data.username,
        first_name: data.first_name,
        mid_name: data.mid_name || null,
        last_name: data.last_name,
        email: data.email,
        password_hash: hashedPassword 
    });
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