import pool from '../db.js';

// Get all users
export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM public.users');
    return result.rows;
}

// Get user by ID
export const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE userid = $1', [id]);
    return result.rows[0];
}

// Get user by email
export const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

// Create user using insert_user function (handles hashing in Postgres)
export const createUsers = async (userData) => {
    const { username, email, passwordHash, fullname, role } = userData;

    // Call PostgreSQL function insert_user
    await pool.query(
        'SELECT insert_user($1, $2, $3, $4, $5)',
        [username, passwordHash, email, fullname, role || 'user']
    );

    // Return the inserted user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

// Update user
export const updateUsers = async (id, userData) => {
    const { username, email, passwordHash, fullname, role } = userData;

    let query;
    let values;

    if (passwordHash) {
        query = `
            UPDATE users
            SET username=$1,
                email=$2,
                passwordHash=crypt($3, gen_salt('bf',12)),
                fullname=$4,
                role=$5
            WHERE userid=$6
            RETURNING *
        `;
        values = [username, email, passwordHash, fullname, role, id];
    } else {
        query = `
            UPDATE users
            SET username=$1,
                email=$2,
                fullname=$3,
                role=$4
            WHERE userid=$5
            RETURNING *
        `;
        values = [username, email, fullname, role, id];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Delete user
export const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE userid = $1 RETURNING *', [id]);
    return result.rows[0];
}

// Verify user password
export const verifyUser = async (email, username ,password) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email=$1 OR username=$2 AND passwordhash = crypt($3, passwordhash)',
        [email,username, password]
    );
    return result.rows[0] || null;
}
