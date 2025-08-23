const { pool } = require('../db');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

// GET user by id
const getUsersById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Create user
const createUsers = async (req, res) => {
    try {
        const { username, email, passwordHash, fullName, role } = req.body;
        const result = await pool.query
        ('INSERT INTO Users (username, fullName, email, passwordHash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [username, fullName, email, passwordHash, role]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE user
const updateUsers =  async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, passwordHash, fullName, role } = req.body;
        const result = await pool.query
        (`UPDATE Users SET username=$1, email=$2, passwordHash=$3, fullName=$4, role=$5  WHERE userID=$6  RETURNING *`,
            [username, email, passwordHash, fullName, role, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE user
const deleteUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Users WHERE userID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers
};