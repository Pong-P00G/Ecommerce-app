-- ============================================
-- AlieeShop Database - Role Initialization
-- ============================================

-- Insert default roles for user management
INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
(1, 'Admin', 'Administrator with full access to system'),
(2, 'Customer', 'Regular customer user account');

-- Verify insertion
SELECT role_id, role_name, description FROM roles ORDER BY role_id;
