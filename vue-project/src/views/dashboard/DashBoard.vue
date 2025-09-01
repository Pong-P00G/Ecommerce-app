<script setup>
import { ref } from "vue";
import { useUserStore } from "../composables/useUser.js";

// --- User Store ---
const userStore = useUserStore();
const user = userStore.user;

// --- Products ---
const products = ref([
    { name: "Hoodie", stock: 10, price: 40 },
    { name: "Pant", stock: 15, price: 30 },
]);

const newProduct = ref({ name: "", stock: 0, price: 0 });

function addProduct() {
    if (!newProduct.value.name) return;
    products.value.push({ ...newProduct.value });
    newProduct.value = { name: "", stock: 0, price: 0 };
}

// --- Discounts ---
const discounts = ref([]);
const discount = ref({ product: "", percent: 0 });

function applyDiscount() {
    if (!discount.value.product) return;
    discounts.value.push({ ...discount.value });
    discount.value = { product: "", percent: 0 };
}

// --- Logout ---
function logout() {
    userStore.logout();
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Dashboard Header -->
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-700">Admin Dashboard</h1>
      <div class="flex items-center gap-3">
        <img :src="user.avatar" alt="user" class="w-10 h-10 rounded-full border" />
        <span class="font-medium text-gray-600">{{ user.name }}</span>
        <button
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </header>
    <!-- Dashboard Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Product Management -->
      <section class="bg-white shadow p-4 rounded-2xl">
        <h2 class="text-xl font-semibold mb-3">Add Product</h2>
        <form @submit.prevent="addProduct" class="space-y-3">
          <input
            v-model="newProduct.name"
            type="text"
            placeholder="Product Name"
            class="w-full border p-2 rounded"
          />
          <input
            v-model.number="newProduct.stock"
            type="number"
            placeholder="Stock Quantity"
            class="w-full border p-2 rounded"
          />
          <input
            v-model.number="newProduct.price"
            type="number"
            placeholder="Price"
            class="w-full border p-2 rounded"
          />
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Add Product
          </button>
        </form>
      </section>
      <!-- Stock Overview -->
      <section class="bg-white shadow p-4 rounded-2xl">
        <h2 class="text-xl font-semibold mb-3">Stock Overview</h2>
        <ul class="divide-y">
          <li
            v-for="(p, i) in products"
            :key="i"
            class="flex justify-between items-center py-2"
          >
            <span>{{ p.name }} ({{ p.stock }})</span>
            <button
              class="text-sm bg-green-500 text-white px-2 py-1 rounded"
              @click="p.stock++"
            >
              +1
            </button>
          </li>
        </ul>
      </section>
      <!-- Discounts -->
      <section class="bg-white shadow p-4 rounded-2xl">
        <h2 class="text-xl font-semibold mb-3">Manage Discounts</h2>
        <form @submit.prevent="applyDiscount" class="space-y-3">
          <select v-model="discount.product" class="w-full border p-2 rounded">
            <option disabled value="">Select Product</option>
            <option v-for="(p, i) in products" :key="i" :value="p.name">
              {{ p.name }}
            </option>
          </select>
          <input
            v-model.number="discount.percent"
            type="number"
            placeholder="Discount %"
            class="w-full border p-2 rounded"
          />
          <button
            type="submit"
            class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
          >
            Apply Discount
          </button>
        </form>
        <ul class="mt-4 text-sm text-gray-600">
          <li v-for="(d, i) in discounts" :key="i">
            {{ d.product }} → {{ d.percent }}% off
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>