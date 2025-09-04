import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT || 5432,
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.connect()
    .then(async (client) => {
        await client.query('SET search_path TO public'); // ensures public schema
        console.log("Connected to postgres ");
        client.release();
    })
    .catch(err => {
        console.log('Connection error', err.stack);
    });

export default pool;