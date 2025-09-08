<script setup>
import { ref, onMounted, computed } from "vue";
import { ArrowLeft, User, MapPin, Bell, Trash2 } from "lucide-vue-next";
import { useUserStore } from "../../stores/useUser";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const activeTab = ref("profile");

const tabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "address", label: "Address", icon: MapPin },
  { key: "notifications", label: "Notifications", icon: Bell },
];

// Use computed properties to avoid direct mutation of store state
const name = computed({
  get: () => userStore.username,
  set: (value) => userStore.username = value,
});

const email = computed({
  get: () => userStore.email,
  set: (value) => userStore.email = value,
});

const phone = computed({
  get: () => userStore.phone || '',
  set: (value) => userStore.phone = value,
});

const addresses = ref(
  userStore.addresses || [
    { id: 1, type: "Home", line1: "123 Main St", city: "NYC", state: "NY", zip: "10001", isDefault: true },
    { id: 2, type: "Office", line1: "456 Market St", city: "NYC", state: "NY", zip: "10002", isDefault: false },
  ]
);

const notifications = ref(
  userStore.notifications || {
    promotions: true,
    orderUpdates: true,
    newArrivals: false,
  }
);

const showAddAddressForm = ref(false);
const newAddress = ref({
  type: "",
  line1: "",
  city: "",
  state: "",
  zip: "",
  isDefault: false,
});

const addAddress = () => {
  addresses.value.push({ ...newAddress.value, id: Date.now() });
  newAddress.value = {
    type: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  };
  showAddAddressForm.value = false;
  saveSettings();
};

const deleteAddress = (id) => {
  addresses.value = addresses.value.filter((address) => address.id !== id);
  saveSettings();
};


// onMounted(() => {
//   if (!userStore.isLoggedIn) {
//     router.push('/auth/login');
//   }
// });

const saveSettings = async () => {
  try {
    const updatedUserData = {
      username: name.value,
      email: email.value,
      phone: phone.value,
      notifications: { ...notifications.value },
      addresses: [...addresses.value],
    };
    await userStore.updateProfile(updatedUserData);
    alert("Settings saved successfully!");
  } catch (error) {
    console.error("Failed to save settings:", error);
    alert("Failed to save settings. Please try again.");
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">⚙️ Settings</h1>
        <router-link to="/dashboard" class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft class="w-5 h-5" />
          Back to Dashboard
        </router-link>
      </div>
      <!-- Card Layout -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <!-- Sidebar -->
        <div class="w-full md:w-1/4 bg-gray-50 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
          <nav class="space-y-3">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-300',
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              ]"
            >
              <component :is="tab.icon" class="w-6 h-6" />
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>
        <!-- Main Content -->
        <div class="w-full md:w-3/4 p-6 md:p-8">
          <!-- Profile Section -->
          <div v-if="activeTab === 'profile'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">👤 Personal Information</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  v-model="name"
                  class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                <input
                  type="email"
                  v-model="email"
                  class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                <input
                  type="tel"
                  v-model="phone"
                  class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
          <!-- Address Section -->
          <div v-if="activeTab === 'address'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">🏠 Manage Addresses</h3>
            <div class="space-y-4">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="p-4 border rounded-lg flex justify-between items-center bg-gray-50 hover:shadow-md transition"
              >
                <div>
                  <p class="font-semibold">
                    {{ address.type }}
                    <span
                      v-if="address.isDefault"
                      class="ml-1 text-xs text-blue-600 font-bold"
                      >(Default)</span
                    >
                  </p>
                  <p class="text-gray-600">
                    {{ address.line1 }}, {{ address.city }}, {{ address.state }} {{ address.zip }}
                  </p>
                </div>
                <button
                  @click="deleteAddress(address.id)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div v-if="showAddAddressForm" class="mt-6">
              <h4 class="text-xl font-semibold text-gray-800 mb-4">Add New Address</h4>
              <div class="space-y-4">
                <input type="text" v-model="newAddress.type" placeholder="Address Type (e.g., Home, Office)" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <input type="text" v-model="newAddress.line1" placeholder="Address Line 1" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <input type="text" v-model="newAddress.city" placeholder="City" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <input type="text" v-model="newAddress.state" placeholder="State" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <input type="text" v-model="newAddress.zip" placeholder="ZIP Code" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <div class="flex items-center">
                  <input type="checkbox" v-model="newAddress.isDefault" id="isDefault" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="isDefault" class="ml-2 block text-sm text-gray-900">Set as default address</label>
                </div>
                <div class="flex justify-end gap-4">
                  <button @click="showAddAddressForm = false" class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                  <button @click="addAddress" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Save Address</button>
                </div>
              </div>
            </div>
            <button
              v-else
              @click="showAddAddressForm = true"
              class="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              ➕ Add New Address
            </button>
          </div>
          <!-- Notifications Section -->
          <div v-if="activeTab === 'notifications'">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">🔔 Notification Preferences</h3>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:shadow-sm transition"
              >
                <span class="text-gray-700 font-medium">Promotions and Offers</span>
                <label class="switch">
                  <input type="checkbox" v-model="notifications.promotions" />
                  <span class="slider round"></span>
                </label>
              </div>
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:shadow-sm transition"
              >
                <span class="text-gray-700 font-medium">Order Updates</span>
                <label class="switch">
                  <input type="checkbox" v-model="notifications.orderUpdates" />
                  <span class="slider round"></span>
                </label>
              </div>
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:shadow-sm transition"
              >
                <span class="text-gray-700 font-medium">New Arrivals</span>
                <label class="switch">
                  <input type="checkbox" v-model="notifications.newArrivals" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <!-- Save Button -->
          <div class="mt-10 text-right border-t pt-6">
            <button
              @click="saveSettings"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transform transition font-semibold"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #2563eb;
}
input:checked + .slider:before {
  transform: translateX(22px);
}
.slider.round {
  border-radius: 28px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>