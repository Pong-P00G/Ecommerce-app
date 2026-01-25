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

// Create users (password hashing handled by DB trigger)
export const createUsers = async (userData) => {
    return await UserModels.createUsers(userData);
};

// Update User
export const updateUser = async (id, userData) => {
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
    
    // Password will be hashed by database trigger
    return await UserModels.createUsers({
        role_id: data.role_id || 2,
        username: data.username,
        first_name: data.first_name,
        mid_name: data.mid_name || null,
        last_name: data.last_name,
        email: data.email,
        password_hash: data.password 
    });
};

// Login user with email or username
export const login = async (identifier, password) => {
    if (!identifier || !password) {
        throw new Error('Email/Username and password are required');
    }
    
    // Verify user with identifier (email or username) and password
    const user = await UserModels.verifyUser(identifier, password);
    
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    return user;
};