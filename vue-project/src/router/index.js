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
                component: () => import("../views/Home.vue")
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
                component:() => import("../views/checkout/Checkout.vue")
            },
            {
                name: 'payment',
                path: '/payment',
                component:() => import("../views/Payment.vue")
            },
            {
                name: 'orderSucces',
                path: '/orderSucces',
                component:() => import("../views/OrderSucces.vue")
            },
            {
                name: 'Allproduct',
                path: '/Allproduct',
                component: () => import("../views/products/AllProduct.vue"),
            },
            {
                name: 'userprofile',
                path: '/userprofile',
                component: () => import("../views/UserProfile.vue"),
                // meta: { requiresAuth: true },
            },
        ]
    },
    {
        path: '/dashboard',
        component: Mainlayout,
        // meta: { requiresAuth: true, requireRole: 'admin' },
        children: [
            {
            name: 'DashboardHome',
            path: '',
            component: () => import('../views/dashboard/Dashboard.vue'),
            },
            {
                path: '/add-product',
                name: 'addproduct',
                component: () => import('../views/dashboard/AddProduct.vue')
            },
            {
                path: '/manage-stock',
                name: 'managestock',
                component: () => import('../views/dashboard/ManageStocks.vue')
            },
            {
                path: '/manage-user',
                name: 'manageuser',
                component: () => import('../views/dashboard/ManageUser.vue')
            },
            {
                path: '/analytics',
                name: 'analytics',
                component: () => import('../views/dashboard/Analytic.vue')
            },
            {
                path: '/report',
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
    const userRole = authStore.user?.role;

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    else if (to.meta.requireRole && to.meta.requireRole !== userRole) {
        return next({ name: 'DashboardHome' });
    }

    else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        return next({ name: 'Home' });
    }

    next();
});

export default router;