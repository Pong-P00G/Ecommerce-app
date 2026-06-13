import { db } from './src/database/dbpool.js';
import dotenv from 'dotenv';

dotenv.config();

const checkTables = async () => {
    try {
        const [rows] = await db.query('SHOW TABLES');
        console.log('Tables in database:');
        rows.forEach(row => {
            console.log(Object.values(row)[0]);
        });
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
};

checkTables();
