import { db } from './src/database/dbpool.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
    console.error('Usage: node resetPassword.js <username> <new_password>');
    process.exit(1);
}

const reset = async () => {
    try {
        const hash = await bcrypt.hash(newPassword, 10);
        const [result] = await db.query(
            'UPDATE users SET password_hash = ? WHERE username = ?', 
            [hash, username]
        );
        
        if (result.affectedRows > 0) {
            console.log(`✅ Password for '${username}' has been updated successfully.`);
        } else {
            console.log(`❌ User '${username}' not found.`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
};

reset();
