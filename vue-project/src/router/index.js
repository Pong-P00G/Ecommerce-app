import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ForgetPassword from "../components/ForgetPass.vue";
import Checkout from "../views/checkout/Checkout.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import AllProduct from "../views/products/AllProduct.vue";
import Shirt from "../views/products/ProductShirt.vue";
import Accesorie from "../views/products/AccesoriesProduct.vue";
import Hoodie from "../views/products/ProductHoodie.vue";
import Pants  from "../views/products/ProductPant.vue";
import Payment from "../views/Payment.vue";
import OrderSucces from "../views/OrderSucces.vue";
import ProductCart from "../views/cart/ProductCart.vue";


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
    {
        name: 'Shirt',
        path: '/Shirt',
        component: Shirt,
    },
    {
        name: 'Accessorie',
        path: '/Accessorie',
        component: Accesorie,
    },
    {
        name: 'Hoodie',
        path: '/Hoodie',
        component: Hoodie,
    },
    {
        name: 'Pant',
        path: '/Pant',
        component: Pants,
    },
    {
        path: '/Shirt/:id',
        name: 'ShirtDetail',
        component: () => import('../components/productDetails/ShirtDetail.vue')
    },
    {
        path: '/Hoodie/:id',
        name: 'HoodieDetail',
        component: () => import('../components/productDetails/HoodieDetail.vue')
    },
    {
        path: '/Pants/:id',
        name: 'PantDetail',
        component: () => import('../components/productDetails/PantsDetail.vue')
    },
    {
        path: '/Accesorie/:id',
        name: 'AccesorieDetail',
        component: () => import('../components/productDetails/AccesorieDetail.vue')
    },
    {
        path: '/productCart',
        name: 'productCart',
        component: ProductCart
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/dashboard/Setting.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/dashboard/Profile.vue')
    },
    {
        path: '/WishList',
        name: 'WishList',
        component: () => import('../views/dashboard/WishList.vue')
    },
    {
        path: '/Dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashBoard.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;