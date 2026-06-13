#!/usr/bin/env node

/**
 * Alternative Role Initialization via native mysql CLI
 * This script uses the native mysql command instead of node-mysql2
 * to bypass GSSAPI authentication issues
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

const initializeRolesViaCLI = async () => {
    try {
        console.log('🔍 Initializing roles via MySQL CLI...\n');
        
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbUser = process.env.DB_USER || 'root';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbDatabase = process.env.DB_DATABASE || 'aliee_shop';
        const dbPort = process.env.DB_PORT || 3306;
        
        // SQL commands to initialize roles
        const sqlCommands = `
            -- Create roles if they don't exist
            INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
            (1, 'Admin', 'Administrator with full access'),
            (2, 'Customer', 'Regular customer user');
            
            -- Verify roles
            SELECT role_id, role_name FROM roles ORDER BY role_id;
        `;
        
        // Execute MySQL command
        console.log('📝 Running SQL commands...\n');
        
        let command = `mysql -h ${dbHost} -u ${dbUser}`;
        
        if (dbPassword) {
            command += ` -p${dbPassword}`;
        }
        
        command += ` -P ${dbPort} ${dbDatabase} -e "${sqlCommands.replace(/"/g, '\\"')}"`;
        
        const { stdout, stderr } = await execAsync(command);
        
        if (stderr && !stderr.includes('Warning')) {
            throw new Error(stderr);
        }
        
        console.log('✅ Roles initialization output:');
        console.log(stdout);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Ensure MySQL is installed and in PATH');
        console.log('2. Check your .env file for correct credentials');
        console.log('3. Verify MariaDB/MySQL server is running');
        console.log('\nAlternatively, run this SQL directly in your database client:');
        console.log(`
            INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
            (1, 'Admin', 'Administrator with full access'),
            (2, 'Customer', 'Regular customer user');
            
            SELECT * FROM roles;
        `);
    } finally {
        process.exit();
    }
};

initializeRolesViaCLI();
