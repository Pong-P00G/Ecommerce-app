import { db } from './src/database/dbpool.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeRoles = async () => {
    try {
        console.log('🔍 Checking and initializing roles...\n');
        
        // Check if roles table exists and has data
        const [existingRoles] = await db.query('SELECT * FROM roles');
        
        if (existingRoles.length === 0) {
            console.log('📝 Roles table is empty. Adding default roles...');
            
            // Insert default roles
            await db.query(`
                INSERT INTO roles (role_id, role_name, description) VALUES 
                (1, 'Admin', 'Administrator with full access'),
                (2, 'Customer', 'Regular customer user');
            `);
            
            console.log('✅ Default roles created successfully!');
            console.log('   - Role 1: Admin');
            console.log('   - Role 2: Customer\n');
        } else {
            console.log('✅ Roles already exist:');
            existingRoles.forEach(role => {
                console.log(`   - Role ${role.role_id}: ${role.role_name}`);
            });
            console.log();
        }
        
        // Verify the roles
        const [roles] = await db.query('SELECT role_id, role_name FROM roles ORDER BY role_id');
        console.log('📊 Current roles in database:');
        roles.forEach(role => {
            console.log(`   - role_id: ${role.role_id}, role_name: ${role.role_name}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
};

initializeRoles();
