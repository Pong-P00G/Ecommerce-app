import { createUnhead, headSymbol } from '@unhead/vue';

/**
 * Shared head instance for @unhead/vue.
 *
 * createUnhead() creates a head instance, but doesn't automatically
 * set up Vue's provide/inject for useHead(). We do that manually.
 *
 * Used as:
 * - Vue plugin in main.js: app.use(seoHead)
 * - Router SEO: headInstance.push({ ... })
 * - ProductDetail: useHead() composable (works when plugin is registered)
 */
export const headInstance = createUnhead();

export const seoHead = {
    install(app) {
        // Provide the head instance so useHead() works in components
        app.provide(headSymbol, headInstance);
    }
};
