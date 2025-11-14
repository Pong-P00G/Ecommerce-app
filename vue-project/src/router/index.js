import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ForgetPassword from "../views/auth/ForgetPass.vue";
import Checkout from "../views/checkout/Checkout.vue";
import AllProduct from "../views/products/AllProduct.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Payment from "../views/Payment.vue";
import OrderSucces from "../views/OrderSucces.vue";
import Mainlayout from "../Layout/Mainlayout.vue";


const routes = [
    {
        name: 'home',
        path: '/',
        component: Home
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'register',
        path: '/register',
        component: Register
    },
    {
        name: 'forgotPassword',
        path: '/forgotPassword',
        component: ForgetPassword
    },
    {
        name: 'about',
        path: '/about',
        component: About
    },
    {
        name: 'contact',
        path: '/contact',
        component: Contact
    },
    {
        name: 'checkout',
        path: '/checkout',
        component:Checkout
    },
    {
        name: 'payment',
        path: '/payment',
        component:Payment
    },
    {
        name: 'orderSucces',
        path: '/orderSucces',
        component:OrderSucces
    },
    {
        name: 'Allproduct',
        path: '/Allproduct',
        component: AllProduct,
    },
    // {
    //     path: '/Shirt/:id',
    //     name: 'ShirtDetail',
    //     component: () => import('../components/productDetails/ShirtDetail.vue')
    // },
    // {
    //     path: '/Hoodie/:id',
    //     name: 'HoodieDetail',
    //     component: () => import('../components/productDetails/HoodieDetail.vue')
    // },
    // {
    //     path: '/Pants/:id',
    //     name: 'PantDetail',
    //     component: () => import('../components/productDetails/PantsDetail.vue')
    // },
    // {
    //     path: '/Accesorie/:id',
    //     name: 'AccesorieDetail',
    //     component: () => import('../components/productDetails/AccesorieDetail.vue')
    // },
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
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;