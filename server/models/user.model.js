const pool = require('../db');


const UserModels = {
    getAllUsers: async() => await pool.query('SELECT * FROM Users'),
    getUsersById: async(id) => await pool.query('SELECT * FROM Users WHERE id = $1', [id]),
    createUsers: async(userData) => {
        const { username, email, passwordHash, fullName, role } = userData;
        return await pool.query(
            'INSERT INTO Users (username, fullName, email, passwordHash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, fullName, email, passwordHash, role]
        );
    },
    updateUsers: async(id, userData) => {
        const { username, email, passwordHash, fullName, role } = userData;
        return await pool.query(
            `UPDATE Users SET username=$1, email=$2, passwordHash=$3, fullName=$4, role=$5 WHERE userID=$6 RETURNING *`,
            [username, email, passwordHash, fullName, role, id]
        );
    },
    deleteUsers: async(id) => await pool.query('DELETE FROM Users WHERE userID = $1 RETURNING *', [id]),
}

module.exports = UserModels;