# Manual Role Initialization Guide

## Problem
The database connection is using GSSAPI authentication, which is blocking the Node.js connection. We need to initialize the `roles` table manually.

## Solution Options

### Option 1: Using MySQL Workbench (Easiest)
1. Open **MySQL Workbench** or **HeidiSQL**
2. Connect to your MariaDB database:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: `123`
   - Database: `aliee_shop`

3. Run this SQL query:
```sql
-- Create default roles
INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
(1, 'Admin', 'Administrator with full access'),
(2, 'Customer', 'Regular customer user');

-- Verify the roles were created
SELECT * FROM roles ORDER BY role_id;
```

### Option 2: Using phpMyAdmin
1. Go to your phpMyAdmin interface (usually `http://localhost/phpmyadmin`)
2. Select the `aliee_shop` database
3. Click on the **SQL** tab
4. Paste and execute the SQL query from Option 1

### Option 3: Using MariaDB Command Line
If you have MariaDB installed locally, open Command Prompt and run:

```bash
mariadb -h localhost -u root -p123 aliee_shop
```

Then paste the SQL commands:
```sql
INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
(1, 'Admin', 'Administrator with full access'),
(2, 'Customer', 'Regular customer user');

SELECT * FROM roles ORDER BY role_id;
```

## Expected Output
After running the SQL, you should see:
```
role_id | role_name | description
--------|-----------|---------------------------
1       | Admin     | Administrator with full access
2       | Customer  | Regular customer user
```

## After Initialization
Once the roles table is populated, users can register successfully!

Try registering with:
- First Name: John
- Last Name: Doe
- Username: johndoe123
- Email: john@example.com
- Password: SecurePass123

## Troubleshooting GSSAPI Authentication Error

The `auth_gssapi_client` error typically occurs when:
1. MariaDB is configured to use GSSAPI authentication
2. The connection from Node.js doesn't support this auth plugin

**To fix this permanently**, change the user's authentication method in MariaDB:

```sql
-- Run this in MariaDB as admin
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123';
FLUSH PRIVILEGES;
```

After this, the Node.js connection should work directly without needing GSSAPI.
