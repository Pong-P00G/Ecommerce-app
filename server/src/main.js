import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import newsletterRoutes from './routes/newsletterRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import roleRoutes from './routes/roleRoutes.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express()
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/roles', roleRoutes);

// Serve static files from CDN
app.use('/cdn', express.static(path.join(__dirname, '../../cdn')));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Aliee Shop API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            product: '/api/products',
            health: '/health'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});


app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send([
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /login',
        'Disallow: /register',
        'Disallow: /forgotPassword',
        'Disallow: /userprofile',
        '',
        `Sitemap: ${process.env.FRONTEND_URL || 'http://localhost:3001'}/sitemap.xml`,
        '',
        '# AlieeShop',
    ].join('\n'));
});


app.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

        // Fetch active products for dynamic sitemap entries
        let products = [];
        try {
            const { rows } = await db.query(
                `SELECT productsid, productname, createdat FROM products WHERE status = 'active' ORDER BY productsid`
            );
            products = rows;
        } catch (err) {
            // DB might not be available; return static sitemap only
            console.warn('Could not fetch products for sitemap:', err.message);
        }

        const today = new Date().toISOString().split('T')[0];

        const staticPages = [
            { url: '/', priority: '1.0', changefreq: 'daily' },
            { url: '/product', priority: '0.9', changefreq: 'daily' },
            { url: '/about', priority: '0.5', changefreq: 'monthly' },
            { url: '/contact', priority: '0.5', changefreq: 'monthly' },
            { url: '/gift-cards', priority: '0.6', changefreq: 'weekly' },
            { url: '/track-order', priority: '0.4', changefreq: 'monthly' },
            { url: '/returns', priority: '0.5', changefreq: 'monthly' },
            { url: '/shipping', priority: '0.5', changefreq: 'monthly' },
            { url: '/faq', priority: '0.6', changefreq: 'weekly' },
            { url: '/careers', priority: '0.3', changefreq: 'monthly' },
            { url: '/press', priority: '0.4', changefreq: 'monthly' },
        ];

        const urls = [
            ...staticPages.map(p => `  <url>\n    <loc>${baseUrl}${p.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`),
            ...products.map(p => {
                const date = p.createdat ? new Date(p.createdat).toISOString().split('T')[0] : today;
                return `  <url>\n    <loc>${baseUrl}/product/${p.productsid}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
            }),
        ];

        const sitemap = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            urls.join('\n'),
            '</urlset>',
        ].join('\n');

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (err) {
        console.error('Sitemap generation error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to generate sitemap' });
    }
});

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5001;


// ── Startup bootstrap: ensure permissions & role_permissions tables exist ──
(async () => {
    try {
        const db = (await import('./database/dbpool.js')).default;
        const { tableExists } = await import('./model/roleModel.js');

        // Create permissions table if it doesn't exist
        const permExists = await tableExists('permissions');
        if (!permExists) {
            await db.query(`
                CREATE TABLE permissions (
                    permission_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    permission_key VARCHAR(100) NOT NULL UNIQUE,
                    permission_name VARCHAR(100) NOT NULL,
                    module VARCHAR(50) NOT NULL,
                    description VARCHAR(300)
                )
            `);
            console.log('✅ Permissions table created');
        }

        // Create role_permissions junction table if it doesn't exist
        const rpExists = await tableExists('role_permissions');
        if (!rpExists) {
            await db.query(`
                CREATE TABLE role_permissions (
                    role_id INTEGER NOT NULL REFERENCES roles(rolesId) ON DELETE CASCADE,
                    permission_id INTEGER NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
                    PRIMARY KEY (role_id, permission_id)
                )
            `);
            console.log('✅ role_permissions table created');
        }

        // Seed default permissions
        const { seedDefaultPermissions } = await import('./services/roleService.js');
        const seedResult = await seedDefaultPermissions();
        if (seedResult.created) {
            console.log(`✅ Default permissions seeded (${seedResult.count} permissions)`);
        } else if (seedResult.reason === 'permissions already seeded') {
            console.log('✅ Permissions already seeded');
        }
    } catch (err) {
        console.warn('⚠️ Could not init permissions:', err.message);
    }
})();

// ── Startup bootstrap: ensure audit_log table exists ──
(async () => {
    try {
        const { ensureAuditTable } = await import('./model/notificationModel.js');
        await ensureAuditTable();
        console.log('✅ Audit log table ready');
    } catch (err) {
        console.warn('⚠️ Could not init audit log table:', err.message);
    }
})();

// ── Migrate: add level column to roles table ──
(async () => {
    try {
        const db = (await import('./database/dbpool.js')).default;
        await db.query(`ALTER TABLE roles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 3`);
        // Set default levels for system roles
        await db.query(`UPDATE roles SET level = 1 WHERE rolesid = 1 AND level IS DISTINCT FROM 1`);
        await db.query(`UPDATE roles SET level = 2 WHERE rolesid = 2 AND level IS DISTINCT FROM 2`);
        await db.query(`UPDATE roles SET level = 3 WHERE rolesid = 3 AND level IS DISTINCT FROM 3`);
        console.log('✅ Roles level column ready');
    } catch (err) {
        console.warn('⚠️ Could not migrate roles level:', err.message);
    }
})();

// ── Migrate: add type column to permissions table ──
(async () => {
    try {
        const db = (await import('./database/dbpool.js')).default;
        const { tableExists } = await import('./model/roleModel.js');
        const permExists = await tableExists('permissions');
        if (permExists) {
            await db.query(`ALTER TABLE permissions ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'backend'`);
            // Update existing permissions with correct type based on module
            await db.query(`UPDATE permissions SET type = 'frontend' WHERE module IN ('dashboard', 'settings')`);
            console.log('✅ Permissions type column ready');
        }
    } catch (err) {
        console.warn('⚠️ Could not migrate permissions type:', err.message);
    }
})();

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    process.exit(0);
});
process.on('SIGINT', () => {
    process.exit(0);
});


export default app;