const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGNAME,
    port: process.env.PGPORT || 5001,
});

pool.connect()
    .then((client) => {
        console.log('Connected to PostgreSQL');
        client.release();
    })
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;
