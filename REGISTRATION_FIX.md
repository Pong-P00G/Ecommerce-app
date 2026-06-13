# Registration Fix - Complete Setup Guide

## 🔴 Problem
Registration fails with: **Foreign key constraint error on `role_id`**

The `roles` table is missing the required role entries (Admin & Customer).

Additionally, there's a GSSAPI authentication issue with the database connection.

## ✅ Solution - Two Steps

### Step 1: Initialize Roles in Database

You need to manually insert the required roles into your database. Choose one method:

#### **Method A: Using phpMyAdmin (Easiest)**
1. Open phpMyAdmin (`http://localhost/phpmyadmin`)
2. Select database `aliee_shop`
3. Go to **SQL** tab
4. Copy and paste this SQL:
```sql
INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
(1, 'Admin', 'Administrator with full access'),
(2, 'Customer', 'Regular customer user');
```
5. Click **Execute**

#### **Method B: Using Workbench/HeidiSQL**
1. Open MySQL Workbench or HeidiSQL
2. Connect to: `localhost:3306` with user `root`, password `123`
3. Select database `aliee_shop`
4. Run the SQL from Method A above

#### **Method C: Using Import (File provided)**
1. Open phpMyAdmin
2. Select database `aliee_shop`
3. Go to **Import** tab
4. Upload file: `server/init_roles.sql`
5. Click **Execute**

### Step 2: Fix Database Connection (Already Done ✅)

The following files have been updated to handle GSSAPI:
- ✅ `server/src/database/dbpool.js` - Added GSSAPI support

### Step 3: Backend Validation Updated (Already Done ✅)

- ✅ Password minimum increased from 6 → 8 characters
- ✅ Matches frontend security requirements

## 🧪 Testing Registration

After initializing roles:

1. Go to `/register` page
2. Fill the form with:
   - First Name: John
   - Last Name: Doe
   - Username: johndoe (minimum 4 chars, alphanumeric)
   - Email: john@example.com
   - Password: SecurePass123 (minimum 8 chars)
   - Agree to Terms

3. Click **Create Account**
4. ✅ Should automatically log in and redirect

## 📊 Database Structure

After setup, your `roles` table should have:
```
role_id | role_name | description
--------|-----------|---------------------------
1       | Admin     | Administrator with full access
2       | Customer  | Regular customer user
```

## 🔧 Troubleshooting GSSAPI Error

If you still get GSSAPI errors, run this in MariaDB to change auth method:

```sql
-- Change authentication to native password (more Node.js compatible)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123';
FLUSH PRIVILEGES;
```

## 📝 Files Modified/Created

- ✅ `server/initializeRoles.js` - Node.js initialization (for testing)
- ✅ `server/initializeRolesViaCLI.js` - CLI-based initialization
- ✅ `server/init_roles.sql` - SQL file for manual import
- ✅ `server/src/database/dbpool.js` - Fixed authentication
- ✅ `server/src/middleware/validationMiddleWare.js` - Updated validation

## ✨ Registration Features

After setup, users can:
- ✅ Register with email/username uniqueness validation
- ✅ Create 8+ character passwords with strength indicator
- ✅ Automatic login after registration
- ✅ JWT token generation (7-day expiry)
- ✅ Role-based redirection (Admin → Dashboard, User → Home)

## 🎯 Next Steps

1. **Initialize roles** using one of the methods above
2. **Test registration** on `/register` page
3. **Verify login** works after registration
4. **Check admin dashboard** if you promote user to Admin

---

Need help? Check the files:
- `MANUAL_ROLE_SETUP.md` - Detailed manual setup guide
- `init_roles.sql` - SQL file to import directly

