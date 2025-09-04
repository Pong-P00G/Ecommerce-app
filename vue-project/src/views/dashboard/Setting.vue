<script setup>
import { ref } from 'vue';
import { User, MapPin, CreditCard, Bell, Trash2, ArrowLeft } from 'lucide-vue-next';

const activeTab = ref('profile');

const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
});

const addresses = ref([
  { id: 1, type: 'Home', line1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', isDefault: true },
  { id: 2, type: 'Work', line1: '456 Oak Ave', city: 'Someville', state: 'NY', zip: '67890', isDefault: false },
]);

const paymentMethods = ref([
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/25', isDefault: false },
]);

const notifications = ref({
  promotions: true,
  orderUpdates: true,
  newArrivals: false,
});

</script>

<template>
  <div class="min-h-screen bg-[#f7fafc] p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Settings</h1>
        <router-link to="/dashboard" class="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
          <ArrowLeft class="w-5 h-5" />
          Back to Dashboard
        </router-link>
      </div>
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
        <!-- Sidebar -->
        <div class="w-full md:w-1/4 bg-white p-6 border-r border-gray-200">
          <nav class="space-y-3">
            <button @click="activeTab = 'profile'" :class="['w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300', activeTab === 'profile' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-gray-100']">
              <User class="w-6 h-6" /> <span class="font-medium">Profile</span>
            </button>
            <button @click="activeTab = 'address'" :class="['w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300', activeTab === 'address' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-gray-100']">
              <MapPin class="w-6 h-6" /> <span class="font-medium">Address</span>
            </button>
            <button @click="activeTab = 'payment'" :class="['w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300', activeTab === 'payment' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-gray-100']">
              <CreditCard class="w-6 h-6" /> <span class="font-medium">Payment</span>
            </button>
            <button @click="activeTab = 'notifications'" :class="['w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300', activeTab === 'notifications' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-gray-100']">
              <Bell class="w-6 h-6" /> <span class="font-medium">Notifications</span>
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="w-full md:w-3/4 p-8">
          <!-- Profile Section -->
          <div v-if="activeTab === 'profile'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input type="text" v-model="user.name" class="w-full p-3 bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                <input type="email" v-model="user.email" class="w-full p-3 bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                <input type="tel" v-model="user.phone" class="w-full p-3 bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div v-if="activeTab === 'address'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">Manage Addresses</h3>
            <div class="space-y-4">
              <div v-for="address in addresses" :key="address.id" class="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                <div>
                  <p class="font-semibold">{{ address.type }} <span v-if="address.isDefault" class="text-xs text-blue-500 font-bold">(Default)</span></p>
                  <p class="text-gray-600">{{ address.line1 }}, {{ address.city }}, {{ address.state }} {{ address.zip }}</p>
                </div>
                <button class="text-red-500 hover:text-red-700 transition-colors"><Trash2 class="w-5 h-5" /></button>
              </div>
            </div>
            <button class="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300">Add New Address</button>
          </div>

          <!-- Payment Section -->
          <div v-if="activeTab === 'payment'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">Payment Methods</h3>
            <div class="space-y-4">
              <div v-for="card in paymentMethods" :key="card.id" class="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                <div>
                  <p class="font-semibold">{{ card.type }} ending in {{ card.last4 }} <span v-if="card.isDefault" class="text-xs text-blue-500 font-bold">(Default)</span></p>
                  <p class="text-gray-600">Expires {{ card.expiry }}</p>
                </div>
                <button class="text-red-500 hover:text-red-700 transition-colors"><Trash2 class="w-5 h-5" /></button>
              </div>
            </div>
            <button class="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300">Add New Card</button>
          </div>

          <!-- Notifications Section -->
          <div v-if="activeTab === 'notifications'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">Notification Preferences</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <span class="text-gray-700 font-medium">Promotions and Offers</span>
                <label class="switch"><input type="checkbox" v-model="notifications.promotions"><span class="slider round"></span></label>
              </div>
              <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <span class="text-gray-700 font-medium">Order Updates</span>
                <label class="switch"><input type="checkbox" v-model="notifications.orderUpdates"><span class="slider round"></span></label>
              </div>
              <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <span class="text-gray-700 font-medium">New Arrivals</span>
                <label class="switch"><input type="checkbox" v-model="notifications.newArrivals"><span class="slider round"></span></label>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-10 text-right border-t pt-6">
            <button class="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 font-semibold">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch { position: relative; display: inline-block; width: 50px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #2563eb; }
input:checked + .slider:before { transform: translateX(22px); }
.slider.round { border-radius: 28px; }
.slider.round:before { border-radius: 50%; }
</style>
