import { db } from './src/database/dbpool.js';
import dotenv from 'dotenv';

dotenv.config();

const checkSchema = async () => {
    try {
        const [orders] = await db.query('DESCRIBE orders');
        console.log('\n--- ORDERS TABLE ---');
        orders.forEach(col => console.log(`${col.Field} (${col.Type})`));

        const [orderItems] = await db.query('DESCRIBE order_items');
        console.log('\n--- ORDER ITEMS TABLE ---');
        orderItems.forEach(col => console.log(`${col.Field} (${col.Type})`));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
};

checkSchema();
