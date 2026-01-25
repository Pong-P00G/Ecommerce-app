import db from '../database/dbpool.js';

// Get comprehensive dashboard statistics
export const getDashboardStats = async () => {
    try {
        // Get product statistics
        const productStats = await getProductStats();

        // Get user statistics
        const userStats = await getUserStats();

        // Mock revenue data (since there's no order system yet)
        const revenueData = {
            today: 0,
            week: 0,
            month: 0,
            growth: 0
        };

        return {
            products: productStats,
            users: userStats,
            revenue: revenueData,
            orders: {
                total: 0,
                pending: 0,
                processing: 0,
                completed: 0
            }
        };
    } catch (error) {
        throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
};

// Get product statistics
export const getProductStats = async () => {
    try {
        // Get basic product counts
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_products,
                SUM(CASE WHEN product_status = 'active' THEN 1 ELSE 0 END) as active_products,
                SUM(CASE WHEN product_status = 'inactive' THEN 1 ELSE 0 END) as inactive_products,
                SUM(CASE WHEN product_status = 'draft' THEN 1 ELSE 0 END) as draft_products
            FROM products
        `);

        // Get total stock from all product variants
        const [stockStats] = await db.query(`
            SELECT 
                COALESCE(SUM(s.quantity), 0) as total_stock
            FROM stocks s
        `);

        // Get low stock count (products with total stock < 10)
        const [lowStockCount] = await db.query(`
            SELECT COUNT(DISTINCT p.product_id) as low_stock_count
            FROM products p
            INNER JOIN product_variants pv ON p.product_id = pv.product_id
            INNER JOIN stocks s ON pv.variant_id = s.variant_id
            GROUP BY p.product_id
            HAVING SUM(s.quantity) > 0 AND SUM(s.quantity) < 10
        `);

        // Get out of stock count
        const [outOfStockCount] = await db.query(`
            SELECT COUNT(DISTINCT p.product_id) as out_of_stock_count
            FROM products p
            INNER JOIN product_variants pv ON p.product_id = pv.product_id
            INNER JOIN stocks s ON pv.variant_id = s.variant_id
            GROUP BY p.product_id
            HAVING SUM(s.quantity) = 0
        `);

        // Get category distribution
        // Change c.name to c.category_name in database letter
        const [categories] = await db.query(`
            SELECT 
                c.name,
                COUNT(p.product_id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.category_id = p.category_id
            GROUP BY c.category_id, c.name
            ORDER BY product_count DESC
        `);

        return {
            ...stats[0],
            total_stock: stockStats[0].total_stock,
            low_stock_count: lowStockCount.length > 0 ? lowStockCount[0].low_stock_count : 0,
            out_of_stock_count: outOfStockCount.length > 0 ? outOfStockCount[0].out_of_stock_count : 0,
            categories
        };
    } catch (error) {
        throw new Error(`Failed to fetch product stats: ${error.message}`);
    }
};

// Get user statistics
export const getUserStats = async () => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_users,
                SUM(CASE WHEN role_id = 1 THEN 1 ELSE 0 END) as admin_users,
                SUM(CASE WHEN role_id = 2 THEN 1 ELSE 0 END) as regular_users,
                SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as new_today,
                SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week,
                SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_this_month
            FROM users
        `);

        // Get recent users
        const [recentUsers] = await db.query(`
            SELECT 
                user_id,
                username,
                email,
                role_id,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);

        return {
            ...stats[0],
            recent_users: recentUsers
        };
    } catch (error) {
        throw new Error(`Failed to fetch user stats: ${error.message}`);
    }
};

// Get recent activities (user registrations and product additions)
export const getRecentActivities = async (limit = 10) => {
    try {
        const activities = [];

        // Get recent user registrations
        const [recentUsers] = await db.query(`
            SELECT 
                user_id,
                username,
                role_id,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ?
        `, [Math.ceil(limit / 2)]);

        recentUsers.forEach(user => {
            const userType = user.role_id === 1 ? 'admin' : 'user';
            const userLabel = user.role_id === 1 ? 'admin' : 'customer';
            activities.push({
                type: userType,
                message: `New ${userLabel} registration: ${user.username}`,
                time: formatTimeAgo(user.created_at),
                timestamp: user.created_at,
                icon: user.role_id === 1 ? '👨‍💼' : '👤'
            });
        });

        // Get recent product additions
        const [recentProducts] = await db.query(`
            SELECT 
                p.product_id,
                p.product_name,
                COALESCE(SUM(s.quantity), 0) as total_stock,
                p.created_at,
                'product' as type
            FROM products p
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            LEFT JOIN stocks s ON pv.variant_id = s.variant_id
            GROUP BY p.product_id, p.product_name, p.created_at
            ORDER BY p.created_at DESC
            LIMIT ?
        `, [Math.ceil(limit / 2)]);

        recentProducts.forEach(product => {
            if (product.total_stock < 10 && product.total_stock > 0) {
                activities.push({
                    type: 'product',
                    message: `Product "${product.product_name}" low stock (${product.total_stock} left)`,
                    time: formatTimeAgo(product.created_at),
                    timestamp: product.created_at,
                    icon: '⚠️'
                });
            } else {
                activities.push({
                    type: 'product',
                    message: `New product added: ${product.product_name}`,
                    time: formatTimeAgo(product.created_at),
                    timestamp: product.created_at,
                    icon: '📦'
                });
            }
        });

        // Sort activities by timestamp and return
        return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    } catch (error) {
        throw new Error(`Failed to fetch recent activities: ${error.message}`);
    }
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? 's' : ''} ago`;
};

// Get analytics data
export const getAnalytics = async (timeframe = 'month') => {
    try {
        // Since we don't have orders yet, return data based on products and users
        const productStats = await getProductStats();
        const userStats = await getUserStats();

        // Calculate period based on timeframe
        let dateFilter = '';
        let periodLabel = '';

        switch (timeframe) {
            case 'week':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
                periodLabel = 'week';
                break;
            case 'year':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
                periodLabel = 'year';
                break;
            case 'month':
            default:
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
                periodLabel = 'month';
                break;
        }

        // Get product performance (top products by stock value)
        const [topProducts] = await db.query(`
            SELECT 
                p.product_id,
                p.product_name,
                COALESCE(SUM(s.quantity), 0) as units_sold,
                p.base_price,
                COALESCE(SUM(s.quantity * p.base_price), 0) as revenue
            FROM products p
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            LEFT JOIN stocks s ON pv.variant_id = s.variant_id
            WHERE p.product_status = 'active'
            GROUP BY p.product_id, p.product_name, p.base_price
            ORDER BY revenue DESC
            LIMIT 5
        `);

        // Get category performance
        const [categoryPerformance] = await db.query(`
            SELECT 
                c.name as category_name,
                COUNT(p.product_id) as product_count,
                COALESCE(SUM(s.quantity * p.base_price), 0) as sales
            FROM categories c
            LEFT JOIN products p ON c.category_id = p.category_id
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            LEFT JOIN stocks s ON pv.variant_id = s.variant_id
            GROUP BY c.category_id, c.name
            ORDER BY sales DESC
        `);

        // Calculate total and percentages
        const totalCategorySales = categoryPerformance.reduce((sum, cat) => sum + parseFloat(cat.sales || 0), 0);
        const categoryData = categoryPerformance.map(cat => ({
            name: cat.category_name,
            product_count: cat.product_count,
            sales: parseFloat(cat.sales || 0),
            percentage: totalCategorySales > 0 ? Math.round((parseFloat(cat.sales || 0) / totalCategorySales) * 100) : 0
        }));

        return {
            timeframe: periodLabel,
            summary: {
                total_revenue: 0, // No orders yet
                total_orders: 0,
                total_customers: userStats.total_users,
                average_order_value: 0
            },
            product_performance: topProducts.map(p => ({
                name: p.product_name,
                units: parseInt(p.units_sold) || 0,
                revenue: parseFloat(p.revenue) || 0,
                sales: parseFloat(p.revenue) || 0
            })),
            category_data: categoryData,
            sales_trend: [] // No orders yet, will be empty
        };
    } catch (error) {
        throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
};
