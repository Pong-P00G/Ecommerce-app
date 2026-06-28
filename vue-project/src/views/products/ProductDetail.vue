<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { useAuthStore } from '../../stores/auth.js';
import { storeToRefs } from 'pinia';
import {
    Heart,
    Share2,
    Plus,
    Minus,
    Check,
    X,
    ShieldCheck,
    CreditCard,
    RotateCcw,
    Clock,
    ChevronRight,
    PackageOpen,
    AlertTriangle,
    ZoomIn,
    Sparkles,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const { currentProduct: product, loading, error } = storeToRefs(productStore);

const selectedImage = ref(0);
const selectedVariant = ref(null);
const quantity = ref(1);
const showImageModal = ref(false);
const relatedProducts = ref([]);

const isAdmin = computed(() => authStore.user?.role_id === 1);

const productImages = computed(() => {
    if (!product.value) return [];
    const images = [];

    if (product.value.main_image) {
        images.push(product.value.main_image);
    }

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
    return productImages.value[selectedImage.value] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"%3E%3Crect width="800" height="800" fill="%23f4f4f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%23a1a1aa"%3ENo Image%3C/text%3E%3C/svg%3E';
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
    if (stock === 0) return { text: 'Out of stock', available: false };
    if (stock < 10) return { text: `Only ${stock} left`, available: true };
    return { text: 'In stock', available: true };
});

const breadcrumbs = computed(() => [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/product' },
    { name: product.value?.category_name || 'Category', path: `/product?category=${product.value?.category_name}` },
    { name: product.value?.product_name || 'Product', path: '' }
]);

const loadProduct = async () => {
    const productId = route.params.id;
    await productStore.fetchProductById(productId);
    if (product.value?.category_name) {
        await loadRelatedProducts();
    }
};

const loadRelatedProducts = async () => {
    await productStore.fetchAllProducts();
    const allProducts = productStore.products || [];

    relatedProducts.value = allProducts
        .filter(p =>
            p.category_name === product.value.category_name &&
            p.product_id !== product.value.product_id
        )
        .slice(0, 4);
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
    alert(`Added ${quantity.value} item(s) to cart!`);
};

const buyNow = () => {
    addToCart();
    router.push('/checkout');
};

const addToWishlist = () => {
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
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"%3E%3Crect width="800" height="800" fill="%23f4f4f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%23a1a1aa"%3ENo Image%3C/text%3E%3C/svg%3E';
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

watch(() => route.params.id, async (newId) => {
    if (newId) {
        selectedImage.value = 0;
        selectedVariant.value = null;
        quantity.value = 1;
        await loadProduct();
    }
});

onMounted(async () => {
    await loadProduct();
});
</script>

<template>
    <div class="bg-paper min-h-screen">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
            <div class="text-center">
                <div class="w-12 h-12 border-4 border-neutral-200 border-t-accent rounded-full animate-spin mb-4 mx-auto"></div>
                <p class="text-neutral-500 text-sm">Loading product...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
            <div class="text-center">
                <AlertTriangle class="mx-auto h-12 w-12 text-accent mb-4" :stroke-width="1.5" />
                <p class="text-neutral-700 font-medium mb-4">{{ error }}</p>
                <RouterLink to="/product" class="btn-primary">Back to products</RouterLink>
            </div>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="section py-8 md:py-12">
            <!-- Breadcrumbs -->
            <nav class="flex items-center flex-wrap gap-y-1 text-sm mb-8">
                <template v-for="(crumb, index) in breadcrumbs" :key="index">
                    <RouterLink
                        v-if="crumb.path"
                        :to="crumb.path"
                        class="text-neutral-500 hover:text-accent transition-colors"
                    >
                        {{ crumb.name }}
                    </RouterLink>
                    <span v-else class="text-ink font-semibold">{{ crumb.name }}</span>
                    <ChevronRight v-if="index < breadcrumbs.length - 1" class="w-4 h-4 mx-1.5 text-neutral-400" />
                </template>
            </nav>

            <!-- Product Info Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
                <!-- Left: Images -->
                <div class="space-y-4">
                    <div class="relative aspect-square card-flat overflow-hidden bg-neutral-50">
                        <img
                            :src="currentImage"
                            :alt="product.product_name"
                            class="w-full h-full object-cover cursor-zoom-in"
                            @click="showImageModal = true"
                            @error="handleImageError"
                        />
                        <div v-if="hasDiscount" class="absolute top-4 left-4">
                            <span class="badge-accent">-{{ discountPercentage }}% OFF</span>
                        </div>
                        <div class="absolute top-4 right-4 flex gap-2">
                            <button
                                @click="addToWishlist"
                                class="w-11 h-11 rounded-full bg-paper shadow-md hover:bg-accent hover:text-white text-ink inline-flex items-center justify-center transition-all duration-200"
                            >
                                <Heart class="w-5 h-5" />
                            </button>
                            <button
                                @click="shareProduct"
                                class="w-11 h-11 rounded-full bg-paper shadow-md hover:bg-accent hover:text-white text-ink inline-flex items-center justify-center transition-all duration-200"
                            >
                                <Share2 class="w-5 h-5" />
                            </button>
                        </div>
                        <div class="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-paper/90 backdrop-blur-sm inline-flex items-center justify-center text-ink">
                            <ZoomIn class="w-5 h-5" />
                        </div>
                    </div>

                    <div v-if="productImages.length > 1" class="grid grid-cols-5 gap-3">
                        <button
                            v-for="(image, index) in productImages"
                            :key="index"
                            @click="selectImage(index)"
                            :class="[
                                'aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200',
                                selectedImage === index ? 'border-accent' : 'border-neutral-200 hover:border-ink'
                            ]"
                        >
                            <img
                                :src="image"
                                :alt="`${product.product_name} ${index + 1}`"
                                class="w-full h-full object-cover"
                                @error="handleImageError"
                            />
                        </button>
                    </div>
                </div>

                <!-- Right: Product Info -->
                <div class="space-y-6">
                    <span class="badge-ghost">{{ product.category_name || 'Uncategorized' }}</span>

                    <h1 class="heading-hero text-3xl sm:text-4xl md:text-5xl text-ink">
                        {{ product.product_name }}
                    </h1>

                    <div class="flex items-baseline gap-4 flex-wrap">
                        <span class="text-4xl font-bold text-ink tabular-nums">
                            {{ '$' }}{{ formatPrice(currentPrice) }}
                        </span>
                        <span v-if="hasDiscount" class="text-base sm:text-xl text-neutral-400 line-through tabular-nums">
                            {{ '$' }}{{ formatPrice(originalPrice) }}
                        </span>
                        <span v-if="hasDiscount" class="badge-accent">
                            Save {{ '$' }}{{ formatPrice(product.discount_amount) }}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm font-semibold">
                        <span class="relative flex h-2.5 w-2.5">
                            <span class="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 pulse-dot"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                        </span>
                        <span :class="stockStatus.available ? 'text-success' : 'text-danger'">
                            {{ stockStatus.text }}
                        </span>
                    </div>

                    <p v-if="product.product_description" class="text-neutral-600 leading-relaxed">
                        {{ product.product_description }}
                    </p>

                    <!-- Variants -->
                    <div v-if="hasVariants" class="space-y-3 pt-2">
                        <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink">Select options</h3>
                        <div class="flex flex-wrap gap-2.5">
                            <button
                                v-for="variant in variants"
                                :key="variant.variant_id"
                                @click="selectVariant(variant)"
                                :class="[
                                    'px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200',
                                    selectedVariant?.variant_id === variant.variant_id
                                        ? 'border-ink bg-ink text-paper'
                                        : 'border-neutral-300 text-ink hover:border-ink'
                                ]"
                            >
                                {{ variant.size || variant.color || `Option ${variant.variant_id}` }}
                            </button>
                        </div>
                    </div>

                    <!-- Quantity -->
                    <div class="space-y-3 pt-2">
                        <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink">Quantity</h3>
                        <div class="flex items-center gap-4">
                            <div class="inline-flex items-center border-2 border-neutral-300 rounded-full overflow-hidden">
                                <button
                                    @click="decrementQuantity"
                                    :disabled="quantity <= 1"
                                    class="w-10 h-10 sm:w-11 sm:h-11 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
                                >
                                    <Minus class="w-4 h-4" />
                                </button>
                                <span class="w-12 text-center font-bold text-ink tabular-nums">
                                    {{ quantity }}
                                </span>
                                <button
                                    @click="incrementQuantity"
                                    :disabled="quantity >= parseInt(product.total_stock)"
                                    class="w-10 h-10 sm:w-11 sm:h-11 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
                                >
                                    <Plus class="w-4 h-4" />
                                </button>
                            </div>
                            <span class="text-sm text-neutral-500 tabular-nums">
                                {{ product.total_stock }} available
                            </span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            @click="addToCart"
                            :disabled="!stockStatus.available"
                            class="btn-primary flex-1 py-4 disabled:opacity-40 disabled:hover:translate-y-0"
                        >
                            Add to cart
                        </button>
                        <button
                            @click="buyNow"
                            :disabled="!stockStatus.available"
                            class="btn-accent shine-effect flex-1 py-4 disabled:opacity-40 disabled:hover:translate-y-0"
                        >
                            Buy now
                        </button>
                    </div>

                    <!-- Admin Actions -->
                    <div v-if="isAdmin" class="flex gap-3 pt-4 border-t border-neutral-200">
                        <button @click="editProduct" class="btn-outline flex-1">Edit product</button>
                        <button @click="deleteProduct" class="btn-outline flex-1 !border-danger !text-danger hover:!bg-danger hover:!text-paper">
                            Delete
                        </button>
                    </div>

                    <!-- Features -->
                    <div class="grid grid-cols-2 gap-3 pt-6 border-t border-neutral-200">
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                            <div class="w-10 h-10 rounded-full bg-paper inline-flex items-center justify-center text-ink shrink-0">
                                <Truck class="w-5 h-5" />
                            </div>
                            <span class="text-xs font-semibold text-ink">Free shipping</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                            <div class="w-10 h-10 rounded-full bg-paper inline-flex items-center justify-center text-ink shrink-0">
                                <CreditCard class="w-5 h-5" />
                            </div>
                            <span class="text-xs font-semibold text-ink">Secure payment</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                            <div class="w-10 h-10 rounded-full bg-paper inline-flex items-center justify-center text-ink shrink-0">
                                <RotateCcw class="w-5 h-5" />
                            </div>
                            <span class="text-xs font-semibold text-ink">Easy returns</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                            <div class="w-10 h-10 rounded-full bg-paper inline-flex items-center justify-center text-ink shrink-0">
                                <Clock class="w-5 h-5" />
                            </div>
                            <span class="text-xs font-semibold text-ink">24/7 support</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products -->
            <section v-if="relatedProducts.length > 0" class="mt-12 sm:mt-16">
                <div class="text-center mb-10">
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
                        <Sparkles class="w-3.5 h-3.5" />
                        You may also love
                    </span>
                    <h2 class="heading-hero text-2xl sm:text-3xl md:text-4xl text-ink">Related products</h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <article
                        v-for="relatedProduct in relatedProducts"
                        :key="relatedProduct.product_id"
                        @click="viewRelatedProduct(relatedProduct.product_id)"
                        class="card-base overflow-hidden cursor-pointer group"
                    >
                        <div class="aspect-square bg-neutral-100 overflow-hidden">
                            <img
                                :src="relatedProduct.main_image"
                                :alt="relatedProduct.product_name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                @error="handleImageError"
                            />
                        </div>
                        <div class="p-4 space-y-1.5">
                            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                                {{ relatedProduct.category_name }}
                            </p>
                            <h3 class="font-bold text-sm text-ink line-clamp-2 group-hover:text-accent transition-colors">
                                {{ relatedProduct.product_name }}
                            </h3>
                            <div class="flex items-baseline gap-2 pt-1">
                                <span class="text-base font-bold text-ink tabular-nums">
                                    {{ '$' }}{{ formatPrice(relatedProduct.final_price) }}
                                </span>
                                <span v-if="relatedProduct.discount_amount > 0" class="text-xs text-neutral-400 line-through tabular-nums">
                                    {{ '$' }}{{ formatPrice(relatedProduct.base_price) }}
                                </span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>

        <!-- Image Modal -->
        <div
            v-if="showImageModal"
            @click="showImageModal = false"
            class="fixed inset-0 bg-ink/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
            <button
                @click="showImageModal = false"
                class="absolute top-4 right-4 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper inline-flex items-center justify-center transition-colors"
            >
                <X class="w-6 h-6" />
            </button>
            <img
                :src="currentImage"
                :alt="product?.product_name"
                class="max-w-full max-h-full rounded-2xl shadow-2xl"
                @error="handleImageError"
            />
        </div>
    </div>
</template>
