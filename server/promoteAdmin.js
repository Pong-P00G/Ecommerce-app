import { db } from './src/database/dbpool.js';
import dotenv from 'dotenv';

dotenv.config();

const username = process.argv[2];

if (!username) {
    console.error('Please provide a username: node promoteAdmin.js <username>');
    process.exit(1);
}

const promote = async () => {
    try {
        const [result] = await db.query('UPDATE users SET role_id = 1 WHERE username = ?', [username]);
        if (result.affectedRows > 0) {
            console.log(`✅ User '${username}' promoted to Admin (role_id = 1)`);
        } else {
            console.log(`❌ User '${username}' not found. Make sure you registered via the website first.`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
};

promote();
