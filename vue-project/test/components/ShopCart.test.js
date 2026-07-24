import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { useShopStore } from '../../src/stores/shop';
import ShopCart from '../../src/components/ShopCart.vue';

const sampleProduct = {
    id: 1,
    name: 'Test Product',
    price: 29.99,
    image: '/images/test.jpg',
    thumbnail: '/images/test-thumb.jpg',
};

function createStore() {
    const pinia = createPinia();
    setActivePinia(pinia);
    return useShopStore();
}

function mountComponent(props = {}) {
    const shop = createStore();
    return {
        shop,
        ...render(ShopCart, {
            props: { product: sampleProduct, ...props },
        }),
    };
}

// Helper to wait for the 500ms animation timer to complete
async function waitForAnimation() {
    await vi.advanceTimersByTimeAsync(500);
}

describe('ShopCart — rendering', () => {
    it('renders product name and price', () => {
        mountComponent();
        expect(screen.getByText('Test Product')).toBeTruthy();
        expect(screen.getByText('$29.99')).toBeTruthy();
    });

    it('renders the Add to Cart button', () => {
        mountComponent();
        const btn = screen.getByRole('button', { name: /add to cart/i });
        expect(btn).toBeTruthy();
        expect(btn.textContent).toContain('Add to Cart');
    });

    it('renders the shopping cart icon', () => {
        mountComponent();
        // The ShoppingCart icon from lucide-vue-next renders as an SVG
        const svg = document.querySelector('svg');
        expect(svg).not.toBeNull();
    });
});

describe('ShopCart — add to cart behavior', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('calls shop.addToCart with correct data when clicked', async () => {
        const { shop } = mountComponent();
        const addSpy = vi.spyOn(shop, 'addToCart');

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith({
            id: sampleProduct.id,
            title: sampleProduct.name,
            price: sampleProduct.price,
            qty: 1,
            image: sampleProduct.image,
        });
    });

    it('calls shop.openCart after 500ms animation delay', async () => {
        const { shop } = mountComponent();
        const openSpy = vi.spyOn(shop, 'openCart');

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        // openCart should NOT be called yet (still in animation delay)
        expect(openSpy).not.toHaveBeenCalled();

        // Advance the timer past the 500ms delay
        await vi.advanceTimersByTimeAsync(500);

        expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it('addToCart is called before openCart (order matters)', async () => {
        const { shop } = mountComponent();
        const addSpy = vi.spyOn(shop, 'addToCart');
        const openSpy = vi.spyOn(shop, 'openCart');

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        // addToCart is called synchronously on click
        expect(addSpy).toHaveBeenCalledTimes(1);

        // Advance timer to trigger openCart
        await vi.advanceTimersByTimeAsync(500);

        expect(addSpy.mock.invocationCallOrder[0])
            .toBeLessThan(openSpy.mock.invocationCallOrder[0]);
    });

    it('falls back to thumbnail when image is not provided', async () => {
        const productNoImage = { ...sampleProduct, image: undefined };
        const shop = createStore();
        const addSpy = vi.spyOn(shop, 'addToCart');

        render(ShopCart, {
            props: { product: productNoImage },
        });

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        expect(addSpy).toHaveBeenCalledWith({
            id: productNoImage.id,
            title: productNoImage.name,
            price: productNoImage.price,
            qty: 1,
            image: productNoImage.thumbnail,
        });
    });

    it('stores the item in the cart store after clicking', async () => {
        const { shop } = mountComponent();

        expect(shop.cart.length).toBe(0);

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        // addToCart is synchronous, so cart updates immediately
        expect(shop.cart.length).toBe(1);
        expect(shop.cart[0]).toMatchObject({
            id: sampleProduct.id,
            title: sampleProduct.name,
            price: sampleProduct.price,
            qty: 1,
        });
    });

    it('increments quantity for duplicate additions after animation completes', async () => {
        const { shop } = mountComponent();

        const btn = screen.getByRole('button', { name: /add to cart/i });
        // Click once, wait for animation to complete so addingItem resets
        await fireEvent.click(btn);
        await vi.advanceTimersByTimeAsync(500);
        // Click again, wait for animation again
        await fireEvent.click(btn);
        await vi.advanceTimersByTimeAsync(500);

        expect(shop.cart.length).toBe(1);
        expect(shop.cart[0].qty).toBe(2);
    });

    it('sets cartOpen to true after animation delay', async () => {
        const { shop } = mountComponent();

        expect(shop.cartOpen).toBe(false);

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        // Should still be closed during animation
        expect(shop.cartOpen).toBe(false);

        // Advance timer
        await vi.advanceTimersByTimeAsync(500);

        expect(shop.cartOpen).toBe(true);
    });

    it('prevents double-click during animation', async () => {
        const { shop } = mountComponent();
        const addSpy = vi.spyOn(shop, 'addToCart');

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);
        await fireEvent.click(btn);
        await fireEvent.click(btn);

        // addToCart should only have been called once due to double-click guard
        expect(addSpy).toHaveBeenCalledTimes(1);
    });

    it('shows "Added!" text after clicking the button', async () => {
        mountComponent();

        expect(screen.getByText('Add to Cart')).toBeTruthy();

        const btn = screen.getByRole('button', { name: /add to cart/i });
        await fireEvent.click(btn);

        expect(screen.getByText('Added!')).toBeTruthy();
        expect(screen.queryByText('Add to Cart')).toBeNull();
    });
});

describe('ShopCart — product prop variants', () => {
    it('handles product with only required fields', () => {
        const minimal = { id: 1, name: 'Minimal', price: 9.99 };

        render(ShopCart, {
            props: { product: minimal },
        });

        expect(screen.getByText('Minimal')).toBeTruthy();
        expect(screen.getByText('$9.99')).toBeTruthy();
    });
});
