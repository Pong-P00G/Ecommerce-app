import { render, screen } from '@testing-library/vue';
import MainLayout from '../src/Layout/Mainlayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { describe, it, expect } from 'vitest';

const routes = [
    { path: '/dashboard', component: { template: '<div></div>' } },
    { path: '/manage-stock', component: { template: '<div></div>' } },
    { path: '/manage-user', component: { template: '<div></div>' } },
    { path: '/analytics', component: { template: '<div></div>' } },
    { path: '/report', component: { template: '<div></div>' } },
    { path: '/add-product', component: { template: '<div></div>' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('MainLayout.vue', () => {
    it('renders correct navigation links', async () => {
        render(MainLayout, {
            global: {
                plugins: [router]
            }
        });

        await router.isReady();

        const expectedLinks = [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Stock', to: '/manage-stock' },
            { label: 'User', to: '/manage-user' },
            { label: 'Analytic', to: '/analytics' },
            { label: 'Report', to: '/report' },
            { label: 'Add Product', to: '/add-product' },
        ];

        for (const link of expectedLinks) {
            const linkElement = await screen.findByText(link.label);
            expect(linkElement.closest('a')).toHaveProperty('href', 'http://localhost:3000' + link.to);
        }
    });
});
