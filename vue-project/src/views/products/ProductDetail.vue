<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { useAuthStore } from '../../stores/auth.js';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const { currentProduct: product, loading, error } = storeToRefs(productStore);

// Local state
const selectedImage = ref(0);
const selectedVariant = ref(null);
const quantity = ref(1);
const activeTab = ref('description');
const showImageModal = ref(false);
const relatedProducts = ref([]);

// Computed
const isAdmin = computed(() => authStore.user?.role_id === 1);

const productImages = computed(() => {
    if (!product.value) return [];
    const images = [];

    // Add main image
    if (product.value.main_image) {
        images.push(product.value.main_image);
    }

    // Add additional images if available
    if (product.value.images && Array.isArray(product.value.images)) {
        product.value.images.forEach(img => {
            if (img.image_url && img.image_url !== product.value.main_image) {
                images.push(img.image_url);
            }
        });
    }

    return images;
});

const currentImage = computed(() => {
    return productImages.value[selectedImage.value] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"%3E%3Crect width="800" height="800" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
});

const variants = computed(() => {
    return product.value?.variants || [];
});

const hasVariants = computed(() => variants.value.length > 0);

const currentPrice = computed(() => {
    if (selectedVariant.value) {
        return parseFloat(selectedVariant.value.variant_price || 0);
    }
    return parseFloat(product.value?.final_price || 0);
});

const originalPrice = computed(() => {
    if (selectedVariant.value) {
        return parseFloat(selectedVariant.value.variant_price || 0);
    }
    return parseFloat(product.value?.base_price || 0);
});

const hasDiscount = computed(() => {
    return product.value?.discount_amount && parseFloat(product.value.discount_amount) > 0;
});

const discountPercentage = computed(() => {
    if (!hasDiscount.value) return 0;
    const discount = parseFloat(product.value.discount_amount);
    const basePrice = parseFloat(product.value.base_price);
    return Math.round((discount / basePrice) * 100);
});

const stockStatus = computed(() => {
    const stock = parseInt(product.value?.total_stock || 0);
    if (stock === 0) return { text: 'Out of Stock', class: 'text-red-600', available: false };
    if (stock < 10) return { text: `Only ${stock} left!`, class: 'text-yellow-600', available: true };
    return { text: 'In Stock', class: 'text-green-600', available: true };
});

const breadcrumbs = computed(() => [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/product' },
    { name: product.value?.category_name || 'Category', path: `/product?category=${product.value?.category_name}` },
    { name: product.value?.product_name || 'Product', path: '' }
]);

// Methods
const loadProduct = async () => {
    const productId = route.params.id;
    console.log('Loading product:', productId);
    await productStore.fetchProductById(productId);

    // Load related products (same category)
    if (product.value?.category_name) {
        await loadRelatedProducts();
    }
};

const loadRelatedProducts = async () => {
    // Get all products and filter by same category
    await productStore.fetchAllProducts();
    const allProducts = productStore.products || [];

    relatedProducts.value = allProducts
        .filter(p =>
            p.category_name === product.value.category_name &&
            p.product_id !== product.value.product_id
        )
        .slice(0, 4); // Limit to 4 products
};

const selectImage = (index) => {
    selectedImage.value = index;
};

const selectVariant = (variant) => {
    selectedVariant.value = variant;
};

const incrementQuantity = () => {
    const maxStock = parseInt(product.value?.total_stock || 0);
    if (quantity.value < maxStock) {
        quantity.value++;
    }
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const addToCart = () => {
    console.log('Add to cart:', {
        product: product.value,
        variant: selectedVariant.value,
        quantity: quantity.value
    });
    alert(`Added ${quantity.value} item(s) to cart!`);
};

const buyNow = () => {
    addToCart();
    router.push('/checkout');
};

const addToWishlist = () => {
    console.log('Add to wishlist:', product.value);
    alert('Added to wishlist!');
};

const shareProduct = () => {
    if (navigator.share) {
        navigator.share({
            title: product.value?.product_name,
            text: `Check out ${product.value?.product_name}`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
};

const editProduct = () => {
    router.push(`/admin/products/${product.value.product_id}/edit`);
};

const deleteProduct = async () => {
    if (confirm(`Are you sure you want to delete ${product.value.product_name}?`)) {
        const result = await productStore.deleteProduct(product.value.product_id);
        if (result.success) {
            router.push('/products');
        }
    }
};

const viewRelatedProduct = (productId) => {
    router.push(`/product/${productId}`);
};

const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"%3E%3Crect width="800" height="800" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

// Watch for route changes
watch(() => route.params.id, async (newId) => {
    if (newId) {
        selectedImage.value = 0;
        selectedVariant.value = null;
        quantity.value = 1;
        await loadProduct();
    }
});

// Lifecycle
onMounted(async () => {
    await loadProduct();
});
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div
                    class="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4 mx-auto">
                </div>
                <p class="text-gray-500">Loading product...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-gray-500 mb-4">{{ error }}</p>
                <router-link to="/product"
                    class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Back to Products
                </router-link>
            </div>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Breadcrumbs -->
            <nav class="flex items-center mt-18 gap-2 text-sm mb-8">
                <router-link v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.path" :class="{
                    'text-gray-500 hover:text-gray-700': crumb.path,
                    'text-gray-900 font-medium': !crumb.path
                }" class="transition-colors">
                    {{ crumb.name }}
                    <span v-if="index < breadcrumbs.length - 1" class="mx-2 text-gray-400">/</span>
                </router-link>
            </nav>

            <!-- Product Info Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <!-- Left: Images -->
                <div class="space-y-4">
                    <!-- Main Image -->
                    <div class="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
                        <img :src="currentImage" :alt="product.product_name"
                            class="w-full h-full object-cover cursor-zoom-in" @click="showImageModal = true"
                            @error="handleImageError" />

                        <!-- Discount Badge -->
                        <div v-if="hasDiscount" class="absolute top-4 left-4">
                            <div class="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-lg">
                                -{{ discountPercentage }}% OFF
                            </div>
                        </div>

                        <!-- Wishlist & Share -->
                        <div class="absolute top-4 right-4 flex gap-2">
                            <button @click="addToWishlist"
                                class="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                <svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <button @click="shareProduct"
                                class="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                <svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Thumbnail Gallery -->
                    <div v-if="productImages.length > 1" class="grid grid-cols-5 gap-3">
                        <div v-for="(image, index) in productImages" :key="index" @click="selectImage(index)" :class="{
                            'ring-2 ring-gray-900': selectedImage === index,
                            'ring-1 ring-gray-200 hover:ring-gray-400': selectedImage !== index
                        }" class="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer transition-all">
                            <img :src="image" :alt="`${product.product_name} ${index + 1}`"
                                class="w-full h-full object-cover" @error="handleImageError" />
                        </div>
                    </div>
                </div>

                <!-- Right: Product Info -->
                <div class="space-y-6">
                    <!-- Category -->
                    <div class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {{ product.category_name || 'Uncategorized' }}
                    </div>

                    <!-- Title -->
                    <h1 class="text-4xl font-bold text-gray-900">
                        {{ product.product_name }}
                    </h1>

                    <!-- Price -->
                    <div class="flex items-baseline gap-4">
                        <span class="text-4xl font-bold text-gray-900">
                            ${{ formatPrice(currentPrice) }}
                        </span>
                        <span v-if="hasDiscount" class="text-2xl text-gray-400 line-through">
                            ${{ formatPrice(originalPrice) }}
                        </span>
                        <span v-if="hasDiscount"
                            class="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                            Save ${{ formatPrice(product.discount_amount) }}
                        </span>
                    </div>

                    <!-- Stock Status -->
                    <div class="flex items-center gap-2">
                        <div :class="stockStatus.class" class="flex items-center gap-2 font-medium">
                            <div class="w-3 h-3 rounded-full bg-current"></div>
                            <span>{{ stockStatus.text }}</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div v-if="product.product_description" class="prose prose-gray">
                        <p class="text-gray-600 leading-relaxed">
                            {{ product.product_description }}
                        </p>
                    </div>

                    <!-- Variants -->
                    <div v-if="hasVariants" class="space-y-3">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Select Options</h3>
                        <div class="flex flex-wrap gap-3">
                            <button v-for="variant in variants" :key="variant.variant_id"
                                @click="selectVariant(variant)" :class="{
                                    'bg-gray-900 text-white': selectedVariant?.variant_id === variant.variant_id,
                                    'bg-white text-gray-900 hover:bg-gray-100': selectedVariant?.variant_id !== variant.variant_id
                                }" class="px-6 py-3 border-2 border-gray-900 rounded-lg font-medium transition-colors">
                                {{ variant.size || variant.color || `Option ${variant.variant_id}` }}
                            </button>
                        </div>
                    </div>

                    <!-- Quantity -->
                    <div class="space-y-3">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quantity</h3>
                        <div class="flex items-center gap-4">
                            <div class="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                                <button @click="decrementQuantity" :disabled="quantity <= 1"
                                    class="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 12H4" />
                                    </svg>
                                </button>
                                <span class="px-6 py-3 font-semibold text-gray-900 min-w-16 text-center">
                                    {{ quantity }}
                                </span>
                                <button @click="incrementQuantity" :disabled="quantity >= parseInt(product.total_stock)"
                                    class="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            <span class="text-sm text-gray-500">
                                {{ product.total_stock }} available
                            </span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-4">
                        <button @click="addToCart" :disabled="!stockStatus.available"
                            class="flex-1 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                            Add to Cart
                        </button>
                        <button @click="buyNow" :disabled="!stockStatus.available"
                            class="flex-1 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                            Buy Now
                        </button>
                    </div>

                    <!-- Admin Actions -->
                    <div v-if="isAdmin" class="flex gap-4 pt-4 border-t-2 border-gray-200">
                        <button @click="editProduct"
                            class="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Edit Product
                        </button>
                        <button @click="deleteProduct"
                            class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                            Delete Product
                        </button>
                    </div>

                    <!-- Features -->
                    <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                        <div class="flex items-center gap-3">
                            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <span class="text-sm text-gray-600">Free Shipping</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm text-gray-600">Secure Payment</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span class="text-sm text-gray-600">Easy Returns</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-sm text-gray-600">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products -->
            <div v-if="relatedProducts.length > 0" class="mt-16">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.product_id"
                        @click="viewRelatedProduct(relatedProduct.product_id)"
                        class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div class="relative aspect-square bg-gray-100 overflow-hidden">
                            <img :src="relatedProduct.main_image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial, sans-serif%22 font-size=%2218%22 fill=%22%239ca3af%22%3ENo Image%3C/text%3E%3C/svg%3E'"
                                :alt="relatedProduct.product_name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                @error="handleImageError" />
                        </div>
                        <div class="p-4">
                            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                {{ relatedProduct.category_name }}
                            </p>
                            <h3 class="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                                {{ relatedProduct.product_name }}
                            </h3>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-bold text-gray-900">
                                    ${{ formatPrice(relatedProduct.final_price) }}
                                </span>
                                <span v-if="relatedProduct.discount_amount > 0"
                                    class="text-sm text-gray-400 line-through">
                                    ${{ formatPrice(relatedProduct.base_price) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Modal -->
        <div v-if="showImageModal" @click="showImageModal = false"
            class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div class="relative max-w-5xl w-full">
                <button @click="showImageModal = false"
                    class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
                    <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img :src="currentImage" :alt="product?.product_name" class="w-full h-auto rounded-lg"
                    @error="handleImageError" />
            </div>
        </div>
    </div>
</template>