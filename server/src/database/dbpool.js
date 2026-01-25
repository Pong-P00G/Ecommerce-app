import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection()
    .then(connection => {
        console.log("✅ Connected to MariaDB successfully");
        connection.release();
    })
    .catch(err => {
        console.error("❌ MariaDB connection error:", err.message);
    });

export default db;