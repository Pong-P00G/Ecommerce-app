<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { storeToRefs } from 'pinia';
import { ArrowLeft, X, Plus, Image as ImageIcon, Package, Sparkles } from 'lucide-vue-next';
import { useToast } from '../../composables/useToast.js';

const toast = useToast();
const router = useRouter();
const productStore = useProductStore();
const { categories, loading } = storeToRefs(productStore);

const form = ref({
  product_name: '',
  product_description: '',
  category_id: null,
  base_price: '',
  product_status: 'active',
  main_image: '',
  images: [],
  variants: [],
  stock: []
});

const newVariant = ref({ size: '', color: '', variant_price: '' });
const newStock = ref({ size: '', color: '', quantity: '' });

const errors = ref({});
const submitting = ref(false);

const validateForm = () => {
  errors.value = {};
  if (!form.value.product_name.trim()) errors.value.product_name = 'Product name is required';
  if (!form.value.category_id) errors.value.category_id = 'Category is required';
  if (!form.value.base_price || parseFloat(form.value.base_price) <= 0) errors.value.base_price = 'Valid price is required';
  return Object.keys(errors.value).length === 0;
};

const addVariant = () => {
  if (newVariant.value.size || newVariant.value.color) {
    form.value.variants.push({ ...newVariant.value });
    newVariant.value = { size: '', color: '', variant_price: '' };
  }
};

const removeVariant = (index) => form.value.variants.splice(index, 1);

const addStock = () => {
  if (newStock.value.quantity > 0) {
    form.value.stock.push({ ...newStock.value });
    newStock.value = { size: '', color: '', quantity: '' };
  }
};

const removeStock = (index) => form.value.stock.splice(index, 1);

const handleSubmit = async () => {
  if (!validateForm()) return;
  submitting.value = true;
  try {
    const result = await productStore.createCompleteProduct(form.value);
    if (result.success) {
      toast.success('Product created successfully!');
      router.push('/admin/dashboard');
    } else {
      toast.error(result.error || 'Failed to create product');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error(error.response?.data?.message || 'Error creating product');
  } finally {
    submitting.value = false;
  }
};

const cancel = () => router.push('/admin/dashboard');

onMounted(async () => {
  await productStore.fetchCategories();
});
</script>

<template>
  <div class="bg-neutral-100 min-h-screen">
    <div class="section py-6 sm:py-8 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <button @click="cancel" class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-ink mb-4 transition-colors">
          <ArrowLeft class="h-4 w-4" />
          Back to dashboard
        </button>
        <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
          <Sparkles class="w-3.5 h-3.5" />
          New inventory
        </span>
        <h1 class="heading-hero text-4xl text-ink">Add new product</h1>
        <p class="text-neutral-500 mt-2">Create a new product in your catalog.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Basic Information -->
        <div class="card-flat p-6 md:p-8">
          <h2 class="text-base font-bold text-ink mb-6">Basic information</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">
                Product name <span class="text-accent">*</span>
              </label>
              <input v-model="form.product_name" type="text" class="input-base" placeholder="Enter product name" />
              <p v-if="errors.product_name" class="mt-1.5 text-xs text-danger font-semibold">{{ errors.product_name }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Description</label>
              <textarea v-model="form.product_description" rows="4" class="input-base resize-none" placeholder="Describe your product..."></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">
                  Category <span class="text-accent">*</span>
                </label>
                <select v-model="form.category_id" class="input-base">
                  <option :value="null">Select category</option>
                  <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                    {{ category.name }}
                  </option>
                </select>
                <p v-if="errors.category_id" class="mt-1.5 text-xs text-danger font-semibold">{{ errors.category_id }}</p>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">
                  Base price <span class="text-accent">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">{{ '$' }}</span>
                  <input v-model="form.base_price" type="number" step="0.01" class="input-base pl-9" placeholder="0.00" />
                </div>
                <p v-if="errors.base_price" class="mt-1.5 text-xs text-danger font-semibold">{{ errors.base_price }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Status</label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-ink transition-colors"
                       :class="{ 'border-ink bg-ink text-paper': form.product_status === 'active' }">
                  <input v-model="form.product_status" type="radio" value="active" class="hidden" />
                  <span class="text-sm font-semibold">Active</span>
                </label>
                <label class="flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-ink transition-colors"
                       :class="{ 'border-ink bg-ink text-paper': form.product_status === 'inactive' }">
                  <input v-model="form.product_status" type="radio" value="inactive" class="hidden" />
                  <span class="text-sm font-semibold">Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="card-flat p-6 md:p-8">
          <h2 class="text-base font-bold text-ink mb-6 flex items-center gap-2">
            <ImageIcon class="w-4 h-4 text-accent" />
            Product images
          </h2>
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Main image URL</label>
            <input v-model="form.main_image" type="url" class="input-base" placeholder="https://example.com/image.jpg" />
            <p class="mt-1.5 text-xs text-neutral-500">Enter the URL of your product's main image.</p>
          </div>
        </div>

        <!-- Variants -->
        <div class="card-flat p-6 md:p-8">
          <h2 class="text-base font-bold text-ink mb-6">Product variants <span class="text-xs font-normal text-neutral-500">(optional)</span></h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input v-model="newVariant.size" type="text" placeholder="Size (M, L, XL)" class="input-base text-sm" />
            <input v-model="newVariant.color" type="text" placeholder="Color (Red, Blue)" class="input-base text-sm" />
            <input v-model="newVariant.variant_price" type="number" step="0.01" placeholder="Price (optional)" class="input-base text-sm" />
            <button @click="addVariant" type="button" class="btn-primary text-sm py-2.5">
              <Plus class="w-4 h-4" />
              Add variant
            </button>
          </div>

          <div v-if="form.variants.length > 0" class="space-y-2">
            <div v-for="(variant, index) in form.variants" :key="index"
              class="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
              <div class="flex-1 text-sm">
                <span v-if="variant.size" class="font-semibold text-ink">Size: {{ variant.size }}</span>
                <span v-if="variant.size && variant.color" class="mx-2 text-neutral-400">·</span>
                <span v-if="variant.color" class="font-semibold text-ink">Color: {{ variant.color }}</span>
                <span v-if="variant.variant_price" class="ml-2 text-accent font-bold">{{ '$' }}{{ variant.variant_price }}</span>
              </div>
              <button @click="removeVariant(index)" type="button" class="text-neutral-400 hover:text-danger transition-colors">
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Stock -->
        <div class="card-flat p-6 md:p-8">
          <h2 class="text-base font-bold text-ink mb-6 flex items-center gap-2">
            <Package class="w-4 h-4 text-accent" />
            Stock management <span class="text-xs font-normal text-neutral-500">(optional)</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input v-model="newStock.size" type="text" placeholder="Size" class="input-base text-sm" />
            <input v-model="newStock.color" type="text" placeholder="Color" class="input-base text-sm" />
            <input v-model.number="newStock.quantity" type="number" placeholder="Quantity" class="input-base text-sm" />
            <button @click="addStock" type="button" class="btn-primary text-sm py-2.5">
              <Plus class="w-4 h-4" />
              Add stock
            </button>
          </div>

          <div v-if="form.stock.length > 0" class="space-y-2">
            <div v-for="(stock, index) in form.stock" :key="index"
              class="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
              <div class="flex-1 text-sm">
                <span v-if="stock.size" class="font-semibold text-ink">Size: {{ stock.size }}</span>
                <span v-if="stock.size && stock.color" class="mx-2 text-neutral-400">·</span>
                <span v-if="stock.color" class="font-semibold text-ink">Color: {{ stock.color }}</span>
                <span class="ml-2 text-neutral-600">Qty: <span class="font-bold text-ink tabular-nums">{{ stock.quantity }}</span></span>
              </div>
              <button @click="removeStock(index)" type="button" class="text-neutral-400 hover:text-danger transition-colors">
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="button" @click="cancel" class="btn-outline flex-1 py-3.5">
            Cancel
          </button>
          <button type="submit" :disabled="submitting" class="btn-accent shine-effect flex-1 py-3.5 disabled:opacity-50">
            {{ submitting ? 'Creating product...' : 'Create product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
