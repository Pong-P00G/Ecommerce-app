import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT || 5432,
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
    // connectionString: process.env.DATABASE_URL,
    // max: 20,
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
    console.log("Connected to the database");
})

pool.on("error", (err) => {
    console.error("PG pool error", err);
})

// pool.connect()
//     .then(async (client) => {
//         await client.query('SET search_path TO public'); // ensures public schema
//         console.log("Connected to postgres ");
//         client.release();
//     })
//     .catch(err => {
//         console.log('Connection error', err.stack);
//     });

export default pool;