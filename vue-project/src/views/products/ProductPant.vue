<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import {
  Eye, Star, ShoppingCart, Minus, Plus, Truck, Shield, Heart,
  Filter, Grid, List, ChevronDown, Search, SortAsc, AlertCircle,
  Check, X, ShoppingBag, Zap, Award, TrendingUp
} from 'lucide-vue-next';
import api from '../../api/api.js';
import '../../assets/product.css';

const router = useRouter();
const error = ref(null);
const productCard = ref([]);
const isLoading = ref(true);
const selectSize = ref({});
const selectColor = ref({});
const quantity = ref({});
const wishlist = ref(new Set());
const cartNotification = ref({ show: false, message: '', type: 'success' });


const viewMode = ref('grid'); 
const sortBy = ref('name'); 
const filterBy = ref({ color: '', size: '', priceRange: [0, 250] });
const searchQuery = ref('');
const showFilters = ref(false);
const selectedCategory = ref('all');


const colorMap = {
  black: '#000000',
  white: '#ffffff',
  gray: '#6B7280',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316'
};

// Toast notification system
const showToast = (message, type = 'success') => {
  cartNotification.value = { show: true, message, type };
  setTimeout(() => {
    cartNotification.value.show = false;
  }, 3000);
};

// Computed properties for filtering and sorting
const filteredProducts = computed(() => {
  let products = [...productCard.value];
  // Search filter
  if (searchQuery.value) {
    products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  // Color filter
  if (filterBy.value.color) {
    products = products.filter(product =>
        Object.values(product.color).some(color =>
            color.toLowerCase().includes(filterBy.value.color.toLowerCase())
        )
    );
  }
  // Size filter
  if (filterBy.value.size) {
    products = products.filter(product =>
        Object.values(product.size).includes(filterBy.value.size)
    );
  }
  // Price filter
  products = products.filter(product => {
    return product.price >= filterBy.value.priceRange[0] && product.price <= filterBy.value.priceRange[1];
  });

  // Sort products
  switch(sortBy.value) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
      break;
    default:
      products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return products;
});

// Categories for filtering
const categories = computed(() => {
  const cats = new Set(['all']);
  productCard.value.forEach(product => {
    if (product.category) cats.add(product.category);
  });
  return Array.from(cats);
});

// Available colors and sizes for filtering
const availableColors = computed(() => {
  const colors = new Set();
  productCard.value.forEach(product => {
    Object.values(product.color).forEach(color => colors.add(color));
  });
  return Array.from(colors);
});

const availableSizes = computed(() => {
  const sizes = new Set();
  productCard.value.forEach(product => {
    Object.values(product.size).forEach(size => sizes.add(size));
  });
  return Array.from(sizes);
});

onMounted(async () => {
    try {
        isLoading.value = true;
        const { data } = await api.get("/products/category/pants");
        productCard.value = data.map(p=>{
          const price = parseFloat(String(p.price).replace(/[$,]/g, ''));
          return {
            ...p,
            image: p.image || "fallback.jpg",
            price: price,
            originalPrice: price*1.3,
            rating: (Math.random()*1+4).toFixed(1),
            reviews: Math.floor(Math.random()*500+50),
            stock: p.stock??Math.floor(Math.random()*20+5),
            isNew: Math.random()>0.7,
            isBestseller: Math.random()>0.8,
          }
        });
        productCard.value.forEach(p=>{
        selectSize.value[p.id] = Object.keys(p.size||{})[0];
        selectColor.value[p.id] = Object.keys(p.color||{})[0];
        quantity.value[p.id] = 1;
        });
    } catch(e){
        error.value = "Failed to load products. Please try again.";
        showToast("Failed to load products", "error");
    } finally { isLoading.value=false; }
});


const incrementQuantity = (productId) => {
  const product = productCard.value.find(p => p.id === productId);
  const maxQty = Math.min(10, product?.stock || 10);
  quantity.value[productId] = Math.min(maxQty, (quantity.value[productId] || 1) + 1);
};
const decrementQuantity = (productId) => {
  quantity.value[productId] = Math.max(1, (quantity.value[productId] || 1) - 1);
};

const updateSelectedColor = (productId, colorCode) => {
  selectColor.value[productId] = colorCode;
  showToast(`Color updated to ${colorCode}`, 'info');
};

const updateSelectedSize = (productId, sizeCode) => {
  selectSize.value[productId] = sizeCode;
  showToast(`Size updated to ${sizeCode}`, 'info');
};

const getColorHex = (colorName) => {
  return colorMap[colorName.toLowerCase()] || '#6B7280';
};

const toggleWishlist = (productId) => {
  if (wishlist.value.has(productId)) {
    wishlist.value.delete(productId);
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.value.add(productId);
    showToast('Added to wishlist ❤️', 'success');
  }
  localStorage.setItem('wishlist', JSON.stringify([...wishlist.value]));
};


const addToCart = async (Pants) => {
  try {
    const qty = Math.max(1, quantity.value[Pants.id] || 1);
    const cartItem = {
      id: Pants.id,
      name: Pants.name,
      size: selectSize.value[Pants.id],
      color: selectColor.value[Pants.id],
      quantity: qty,
      price: Pants.price,
      originalPrice: Pants.originalPrice,
      description: Pants.description,
      image: Pants.image,
      category: Pants.category,
      addedAt: new Date().toISOString()
    };
    const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingIndex = existingItems.findIndex((item) =>
        item.id === Pants.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existingIndex !== -1) {
      existingItems[existingIndex].quantity += qty;
      showToast(`Updated quantity in cart (${existingItems[existingIndex].quantity})`, 'success');
    } else {
      existingItems.push(cartItem);
      showToast(`${Pants.name} added to cart! 🛒`, 'success');
    }
    localStorage.setItem('cartItems', JSON.stringify(existingItems));
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: { action: 'add', item: cartItem, totalItems: existingItems.length }
    }));
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add to cart', 'error');
  }
};


const quickAddToCart = (Pants) => {
  addToCart(Pants);
};

const buyNow = (Pants) => {
  addToCart(Pants);
  router.push('/checkout');
};

const clearFilters = () => {
  searchQuery.value = '';
  filterBy.value = { color: '', size: '', priceRange: [0, 50] };
  selectedCategory.value = 'all';
  showToast('Filters cleared', 'info');
};


onMounted(() => {
  const handleKeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'f':
          e.preventDefault();
          nextTick(() => {
            document.getElementById('search-input')?.focus();
          });
          break;
        case 'g':
          e.preventDefault();
          viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
          break;
      }
    }
  };
  document.addEventListener('keydown', handleKeydown);
  return () => document.removeEventListener('keydown', handleKeydown);
});

watch(() => router.currentRoute.value.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory;
  }
});

</script>

<template>
  <div>
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="bubble absolute top-20 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
      <div class="bubble delay-2s absolute top-40 right-40 w-32 h-32 bg-purple-500 rounded-full opacity-10"></div>
      <div class="bubble delay-3s absolute bottom-10 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-10"></div>
      <div class="bubble delay-4s absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full opacity-10"></div>
    </div>
    <!-- Toast Notifications -->
    <Transition name="toast" appear>
      <div v-if="cartNotification.show"
          class="fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4"
          :class="cartNotification.type === 'success' ? 'border-green-500' :
            cartNotification.type === 'error' ? 'border-red-500' : 'border-blue-500'">
        <div class="flex items-center space-x-3">
          <Check v-if="cartNotification.type === 'success'" class="w-5 h-5 text-green-500" />
          <AlertCircle v-else-if="cartNotification.type === 'error'" class="w-5 h-5 text-red-500" />
          <Eye v-else class="w-5 h-5 text-blue-500" />
          <span class="text-sm font-medium text-gray-900">{{ cartNotification.message }}</span>
          <button @click="cartNotification.show = false" class="ml-auto">
            <X class="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </Transition>
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen bg-white flex items-center justify-center px-4">
      <div class="text-center">
        <div class="relative">
          <div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <ShoppingBag class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p class="text-base sm:text-lg text-gray-600 animate-pulse">Loading premium products...</p>
        <div class="flex justify-center space-x-1 mt-4">
          <div class="animate-bounce w-2 h-2 bg-blue-600 rounded-full" style="animation-delay: 0ms"></div>
          <div class="animate-bounce w-2 h-2 bg-blue-600 rounded-full" style="animation-delay: 150ms"></div>
          <div class="animate-bounce w-2 h-2 bg-blue-600 rounded-full" style="animation-delay: 300ms"></div>
        </div>
      </div>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen bg-white flex items-center justify-center px-4">
      <div class="text-center max-w-md mx-auto">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p class="text-sm sm:text-base text-gray-600 mb-6">{{ error }}</p>
        <div class="space-y-3">
          <button @click="location.reload()"
                  class="w-full px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base">
            Try Again
          </button>
          <button @click="router.push('/')"
                  class="w-full px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base">
            Go Home
          </button>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <main v-else class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <Award class="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300" />
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              Premium T-Pants Collection
            </h1>
            <p class="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover our curated selection of high-quality, comfortable t-Pantss designed for the modern lifestyle.
            </p>
            <div class="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Truck class="w-5 h-5" />
                <span>Free Worldwide Shipping</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield class="w-5 h-5" />
                <span>100% Authentic</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap class="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Filter & Search Section -->
      <section class="bg-gray-800/50 backdrop-blur-lg sticky top-0 z-40 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Serch Bar -->
            <div class="relative flex-1 max-w-md">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
              <input id="search-input" v-model="searchQuery" type="text" placeholder="Search products... (Ctrl+F)"
                class="w-full pl-10 pr-4 py-2 border text-gray-100 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"/>
            </div>
            <!-- Control -->
            <div class="flex items-center space-x-4">
              <!-- Category Fillter -->
              <select v-model="selectedCategory" class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-100">
                <option v-for="category in categories" :key="category" :value="category" class="bg-gray-600 hover:bg-gray-800">
                  {{ category === 'all' ? 'All Categories' : category }}
                </option>
              </select>
              <!-- Sort Dropdown -->
              <select v-model="sortBy" class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-100">
                <option value="name" class="bg-gray-600 hover:bg-gray-800">Sort by Name</option>
                <option value="price-low" class="bg-gray-600 hover:bg-gray-800">Price: Low to High</option>
                <option value="price-high" class="bg-gray-600 hover:bg-gray-800">Price: High to Low</option>
                <option value="rating" class="bg-gray-600 hover:bg-gray-800">Highest Rated</option>
              </select>
              <!-- Mode Toggle -->
              <div class="flex bg-gray-800/50 backdrop-blur-lg rounded-lg p-1">
                <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-gray-300 shadow-sm' : ''" class="p-2 rounded-md transition-all duration-200">
                  <Grid class="w-5 h-5" />
                </button>
                <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-gray-300 shadow-sm' : ''" class="p-2 rounded-md transition-all duration-200">
                  <List class="w-5 h-5" />
                </button>
              </div>
              <!-- Fillter Toggle -->
              <button @click="showFilters = !showFilters" class="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-lg text-white rounded-lg hover:bg-gray-400 transition-colors">
                <Filter class="w-5 h-5" />
                <span class="hidden sm:inline">Filters</span>
            </button>
            </div>
          </div>
          <!-- Advanced Fillter -->
          <Transition name="slide-down">
            <div v-if="showFilters" class="mt-4 p-4 bg-gray-200 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Color Fillter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select v-model="filterBy.color" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Colors</option>
                    <option v-for="color in availableColors" :key="color" :value="color">{{ color }}</option>
                  </select>
                </div>
                <!-- Size Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select v-model="filterBy.size" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Sizes</option>
                    <option v-for="size in availableSizes" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>
                <!-- Price Range -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${{ filterBy.priceRange[0] }} - ${{ filterBy.priceRange[1] }}
                  </label>
                  <div class="flex items-center space-x-2">
                    <input v-model.number="filterBy.priceRange[0]" type="range" min="0" max="50" class="flex-1" />
                    <input v-model.number="filterBy.priceRange[1]" type="range" min="0" max="50" class="flex-1" />
                  </div>
                </div>
              </div>
              <div class="mt-4 flex justify-between">
                <span class="text-sm text-gray-600">{{ filteredProducts.length }} products found</span>
                <button @click="clearFilters" class="text-sm text-blue-600 hover:text-blue-800">Clear all filters</button>
              </div>
            </div>
          </Transition>
        </div>
      </section>
      <!-- Product Grid/List -->
      <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <Search class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-black mb-2">No products found</h3>
          <p class="text-gray-300 mb-6">Try adjusting your search or filter criteria</p>
          <button @click="clearFilters"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Clear Filters
          </button>
        </div>
        <!-- Products Grid -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div v-for="Pants in filteredProducts" :key="Pants.id" class="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:translate-y-2">
            <!-- Image Container -->
            <div class="relative aspect-square overflow-hidden bg-gray-100">
              <!-- Badges -->
              <div class="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 space-y-2">
                <span v-if="Pants.isNew" class="inline-block px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  NEW
                </span>
                <span v-if="Pants.isBestseller" class="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  <TrendingUp class="w-3 h-3 inline mr-1" />
                  BESTSELLER
                </span>
              </div>
              <!-- Wishlist Button -->
              <button @click="toggleWishlist(Pants.id)" class="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200">
                <Heart :class="wishlist.has(Pants.id) ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'" class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <!-- Stock indicator -->
              <div v-if="Pants.stock < 5" class="absolute top-2 right-16 sm:right-20 z-10">
                <span class="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  Only {{ Pants.stock }} left!
                </span>
              </div>
              <!-- Product Image -->
              <img :src="Pants.image" :alt="Pants.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <!-- Quick Actions Overlay -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <router-link :to="`/Pants/${Pants.id}`" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 text-xs sm:text-sm">
                    <span class="hidden sm:inline">Quick View</span>
                    <Eye class="w-4 h-4 sm:hidden" />
                  </router-link>
                  <button @click="quickAddToCart(Pants)" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 text-xs sm:text-sm">
                    <ShoppingCart class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Product Details -->
            <div class="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
              <!-- Name and Rating -->
              <div class="flex justify-between items-start gap-2">
                <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                  {{ Pants.name }}
                </h3>
                <div class="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                  <Star class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span>{{ Pants.rating }}</span>
                  <span class="text-gray-400">({{ Pants.reviews }})</span>
                </div>
              </div>
              <!-- Price -->
              <div class="flex items-center space-x-2 flex-wrap">
                <span class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  ${{ Pants.price.toFixed(2) }}
                </span>
                <span class="text-sm sm:text-base lg:text-lg text-gray-400 line-through">
                  ${{ Pants.originalPrice.toFixed(2) }}
                </span>
                <span class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {{ Math.round((1 - Pants.price / Pants.originalPrice) * 100) }}% OFF
                </span>
              </div>
              <!-- Color Selector -->
              <div class="space-y-1.5 sm:space-y-2">
                <label class="block text-xs sm:text-sm font-medium text-gray-700">Color</label>
                <div class="flex flex-wrap gap-1.5 sm:gap-2">
                  <button v-for="(colorName, colorCode) in Pants.color" :key="colorCode" @click="updateSelectedColor(Pants.id, colorCode)" class="relative group/color">
                    <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200" :style="{ backgroundColor: getColorHex(colorName) }"
                        :class="selectColor[Pants.id] === colorCode? 'border-blue-500 ring-1 sm:ring-2 ring-blue-200 scale-110' : 'border-gray-300 hover:border-gray-400 hover:scale-105'">
                      <div v-if="selectColor[Pants.id] === colorCode" class="absolute inset-0 flex items-center justify-center">
                        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    <!-- Tooltip -->
                    <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                      {{ colorName }}
                    </div>
                  </button>
                </div>
              </div>
              <!-- Size Selector -->
              <div class="space-y-1.5 sm:space-y-2">
                <label class="block text-xs sm:text-sm font-medium text-gray-700">Size</label>
                <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
                  <button v-for="(sizeName, sizeCode) in Pants.size" :key="sizeCode" @click="updateSelectedSize(Pants.id, sizeCode)"
                    class="py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg border transition-all duration-200 hover:scale-105"
                    :class="selectSize[Pants.id] === sizeCode ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'">
                    {{ sizeName }}
                  </button>
                </div>
              </div>
              <!-- Quantity Selector -->
              <div class="space-y-1.5 sm:space-y-2">
                <label class="block text-xs sm:text-sm font-medium text-gray-700">Quantity</label>
                <div class="flex items-center justify-center">
                  <div class="flex items-center border border-gray-300 rounded-md sm:rounded-lg overflow-hidden">
                    <button @click="decrementQuantity(Pants.id)" :disabled="quantity[Pants.id] <= 1" class="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Minus class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                    <div class="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-gray-300 bg-gray-50 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                      <span class="text-sm sm:text-base font-semibold text-gray-900">{{ quantity[Pants.id] || 1 }}</span>
                    </div>
                    <button @click="incrementQuantity(Pants.id)" :disabled="quantity[Pants.id] >= Math.min(10, Pants.stock)" class="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Plus class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button @click="addToCart(Pants)"
                        class="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base hover:scale-[1.02]">
                  <ShoppingCart class="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add to Cart</span>
                </button>
                <button @click="buyNow(Pants)" class="sm:flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center font-medium text-sm sm:text-base hover:scale-[1.02]">
                  <Zap class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-0" />
                  <span class="sm:hidden">Buy Now</span>
                </button>
                <router-link :to="`/Pants/${Pants.id}`" class="sm:flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
                  <Eye class="w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="ml-2 sm:hidden">View Details</span>
                </router-link>
              </div>
              <!-- Enhanced Features -->
              <div class="flex justify-between text-xs text-gray-500 pt-3 sm:pt-4 border-t border-gray-100 space-x-2">
                <div class="flex items-center space-x-1 flex-1 justify-center hover:text-green-600 transition-colors">
                  <Truck class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">Free Ship</span>
                </div>
                <div class="flex items-center space-x-1 flex-1 justify-center hover:text-blue-600 transition-colors">
                  <Shield class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">Authentic</span>
                </div>
                <div class="flex items-center space-x-1 flex-1 justify-center hover:text-yellow-600 transition-colors">
                  <Award class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">Premium</span>
                </div>
              </div>
              <!-- Stock Status -->
              <div class="text-center">
                <span v-if="Pants.stock > 10" class="text-xs text-green-600 font-medium">✓ In Stock</span>
                <span v-else-if="Pants.stock > 0" class="text-xs text-orange-600 font-medium">⚠ Limited Stock ({{ Pants.stock }} left)</span>
                <span v-else class="text-xs text-red-600 font-medium">✗ Out of Stock</span>
              </div>
            </div>
          </div>
        </div>
        <!-- List View (Alternative layout for larger screens) -->
        <div v-else class="space-y-4">
          <div v-for="Pants in filteredProducts" :key="Pants.id" class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row gap-6">
              <!-- Image -->
              <div class="w-full sm:w-48 h-48 sm:h-32 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <img :src="Pants.image" :alt="Pants.name" class="w-full h-full object-cover" loading="lazy" />
                <button @click="toggleWishlist(Pants.id)" class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                  <Heart :class="wishlist.has(Pants.id) ? 'text-red-500 fill-current' : 'text-gray-600'" class="w-4 h-4" />
                </button>
              </div>
              <!-- Details -->
              <div class="flex-1 space-y-3">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-semibold text-gray-900">{{ Pants.name }}</h3>
                  <div class="flex items-center space-x-1 text-sm text-gray-500">
                    <Star class="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{{ Pants.rating }}</span>
                  </div>
                </div>
                <p class="text-gray-600 text-sm">{{ Pants.description }}</p>
                <div class="flex items-center space-x-4">
                  <span class="text-xl font-bold text-gray-900">${{ Pants.price.toFixed(2) }}</span>
                  <span class="text-gray-400 line-through">${{ Pants.originalPrice.toFixed(2) }}</span>
                  <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {{ Math.round((1 - Pants.price / Pants.originalPrice) * 100) }}% OFF
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-4">
                  <button @click="addToCart(Pants)"
                          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <ShoppingCart class="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <router-link :to="`/Pants/${Pants.id}`" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details →
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>