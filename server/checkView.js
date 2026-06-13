import { db } from './src/database/dbpool.js';
import dotenv from 'dotenv';

dotenv.config();

const checkView = async () => {
    try {
        const [rows] = await db.query('DESCRIBE product_list');
        console.log('--- PRODUCT_LIST VIEW COLUMNS ---');
        rows.forEach(r => console.log(r.Field));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
};

checkView();
