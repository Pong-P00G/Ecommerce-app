import { createUnhead, headSymbol } from "@unhead/vue";

const head = createUnhead();

// Push initial title/template — createUnhead() doesn't interpret these as options.
head.push({
    title: "Premium Online Store",
    titleTemplate: "%s | AlieeShop",
});

// Export the raw head instance so it can be used directly (e.g., in router)
export const headInstance = head;

// createUnhead returns a head instance without an install() method.
// We wrap it in a proper Vue plugin so app.use() works.
export const seoHead = {
    install(app) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
    }
};
