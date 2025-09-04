import * as UserModels from '../model/userModel.js';
import bcrypt from 'bcryptjs';

// Get all users
export const getAllUsers = async () => {
    return await UserModels.getAllUsers();
};

// Get user by id
export const getUserById = async (id) => {
    return await UserModels.getUserById(id);
}

// Get user by email
export const getUserByEmail = async (email) => {
    return await UserModels.getUserByEmail(email);
}

// Create users
export const createUsers = async (userData) => {
    const { password, ...rest } = userData;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserData = {
        ...rest,
        passwordHash,
    };

    return await UserModels.createUsers(newUserData);
};

// Update User
export const updateUser = async (id, userData) => {
    if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.passwordHash = await bcrypt.hash(userData.password, salt);
        delete userData.password;
    }

    return await UserModels.updateUsers(id, userData);
};

// Delete User
export const deleteUser = async (id) => {
    return await UserModels.deleteUser(id);
};


// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);