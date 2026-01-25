import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Mainlayout from "../Layout/Mainlayout.vue";
import HomeLayout from "../Layout/HomeLayout.vue";

const routes = [
    {
        path: '/',
        component: HomeLayout,
        children: [
            {
                name: 'home',
                path: '/',
                component: () => import("../views/Home.vue"),
                meta: {
                    title: 'Welcome to AlieeShop - Your One-Stop Online Store',
                    description: 'Discover a wide range of products at unbeatable prices. Shop now and enjoy fast shipping and excellent customer service at AlieeShop!',
                }
            },
            {
                name: 'about',
                path: '/about',
                component: () => import("../views/About.vue")
            },
            {
                name: 'contact',
                path: '/contact',
                component: () => import("../views/Contact.vue")
            },
            {
                name: 'checkout',
                path: '/checkout',
                component: () => import("../views/checkout/Checkout.vue")
            },
            {
                name: 'payment',
                path: '/payment',
                component: () => import("../views/Payment.vue")
            },
            {
                name: 'orderSucces',
                path: '/orderSucces',
                component: () => import("../views/OrderSucces.vue")
            },
            {
                name: 'Product',
                path: '/product',
                component: () => import("../views/products/Product.vue"),
            },
            {
                name: 'ProductDetail',
                path: '/product/:id',
                component: () => import("../views/products/ProductDetail.vue"),
            },
            {
                name: 'userprofile',
                path: '/userprofile',
                component: () => import("../views/UserProfile.vue"),
                meta: { requiresAuth: true },
            },
        ]
    },
    {
        path: '/admin/dashboard',
        component: Mainlayout,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                name: 'DashboardHome',
                path: '',
                component: () => import('../views/dashboard/Dashboard.vue'),
            },
            {
                path: '/admin/add-product',
                name: 'addproduct',
                component: () => import('../views/dashboard/AddProduct.vue')
            },
            {
                path: '/admin/manage-products',
                name: 'manageproducts',
                component: () => import('../views/dashboard/ManageProducts.vue')
            },
            {
                path: '/admin/manage-stock',
                name: 'managestock',
                component: () => import('../views/dashboard/ManageStocks.vue')
            },
            {
                path: '/admin/manage-user',
                name: 'manageuser',
                component: () => import('../views/dashboard/ManageUser.vue')
            },
            {
                path: '/admin/analytics',
                name: 'analytics',
                component: () => import('../views/dashboard/Analytic.vue')
            },
            {
                path: '/admin/report',
                name: 'report',
                component: () => import('../views/dashboard/Reports.vue')
            },
        ],
    },
    {
        name: 'login',
        path: '/login',
        component: () => import("../views/auth/Login.vue")
    },
    {
        name: 'register',
        path: '/register',
        component: () => import("../views/auth/Register.vue")
    },
    {
        name: 'forgotPassword',
        path: '/forgotPassword',
        component: () => import("../views/auth/ForgetPass.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const user = authStore.user;

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'login' });
    }

    // Check if route requires admin privileges (role_id = 1)
    if (to.meta.requiresAdmin && (!user || user.role_id !== 1)) {
        return next({ name: 'home' });
    }

    // Redirect authenticated users away from login/register pages
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        // Redirect based on role
        if (user.role_id === 1) {
            return next({ name: 'DashboardHome' });
        } else {
            return next({ name: 'home' });
        }
    }

    next();
});

export default router;