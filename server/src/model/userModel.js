import db from '../database/dbpool.js';

// Get all users
export const getAllUsers = async () => {
    const [rows] = await db.query(
        'SELECT * FROM users'
    );
    return rows;
};

// Get user by ID
export const getUserById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE user_id = ?',
        [id]
    );
    return rows[0];
};

// Get user by email
export const getUserByEmail = async (email) => {
    const [rows] = await db.query(`
        SELECT 
            u.user_id, u.username, u.first_name, u.mid_name, u.last_name, 
            CONCAT(u.first_name, ' ', IFNULL(u.mid_name, ''), ' ', u.last_name) AS full_name, u.email, u.password_hash, u.created_at, 
            r.role_name, r.role_id
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = ?
      `, [email]);
      return rows[0];
};

// Get user by username
export const getUserByUsername = async (username) => {
    const [rows] = await db.query(`
        SELECT 
          u.user_id, u.username, u.first_name, u.mid_name, u.last_name, 
          CONCAT(u.first_name, ' ', IFNULL(u.mid_name, ''), ' ', u.last_name) AS full_name, u.email, u.password_hash, u.created_at, 
          r.role_name, r.role_id
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.username = ?
      `, [username]);
      return rows[0];
};

// Get user by email or username (with full details including role)
export const getUserByEmailOrUsername = async (identifier) => {
    const [rows] = await db.query(`
        SELECT 
          u.user_id, u.username, u.first_name, u.mid_name, u.last_name, 
          CONCAT(u.first_name, ' ', IFNULL(u.mid_name, ''), ' ', u.last_name) AS full_name, u.email, u.password_hash, u.created_at, 
          r.role_name, r.role_id
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = ? OR u.username = ?
    `, [identifier, identifier]);
    return rows[0];
};

// Create user (password will be hashed by trigger)
export const createUsers = async (userData) => {
    const { 
        role_id = 2, 
        username, 
        first_name, 
        mid_name = null, 
        last_name, 
        email, 
        password_hash 
    } = userData;

    if (!username || !email || !password_hash || !first_name || !last_name) {
        throw new Error('Missing required fields: username, email, password, first_name, or last_name');
    }

    const [result] = await db.query(
        `INSERT INTO users (role_id, username, first_name, mid_name, last_name, email, password_hash) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [role_id, username, first_name, mid_name, last_name, email, password_hash]
    );

    // Return the created user
    return await getUserById(result.insertId);
};

// Update user
export const updateUsers = async (id, userData) => {
    const { username, email, password_hash, first_name, mid_name, last_name, role_id } = userData;

    let query;
    let values;

    if (password_hash) {
        // Password will be hashed by trigger
        query = `
            UPDATE users
            SET username = ?,
                email = ?,
                password_hash = ?,
                first_name = ?,
                mid_name = ?,
                last_name = ?,
                role_id = ?
            WHERE user_id = ?
        `;
        values = [username, email, password_hash, first_name, mid_name, last_name, role_id, id];
    } else {
        query = `
            UPDATE users
            SET username = ?,
                email = ?,
                first_name = ?,
                mid_name = ?,
                last_name = ?,
                role_id = ?
            WHERE user_id = ?
        `;
        values = [username, email, first_name, mid_name, last_name, role_id, id];
    }

    await db.query(query, values);
    return await getUserById(id);
};

// Delete user
export const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
    return result.affectedRows > 0;
};

// Check if email exists
export const emailExists = async (email) => {
    const [rows] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

// Check if username exists
export const usernameExists = async(username) => {
    const [rows] = await db.query('SELECT user_id FROM users WHERE username = ?', [username]);
    return rows.length > 0;
}