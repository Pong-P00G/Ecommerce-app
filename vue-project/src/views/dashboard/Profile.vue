<script setup>
import { ref } from "vue";
import { useUserStore } from "../../composables/useUser";
import { Eye, EyeOff, Upload, ArrowLeft } from "lucide-vue-next";
import user from '../../assets/img/user/user.png'

const userStore = useUserStore();
const isEditing = ref(false);
const form = ref({ ...userStore.$state });
const showSuccess = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPassword = ref("");
const errorMsg = ref("");

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
    form.value.avatar = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleSave() {
  if (form.value.password !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match!";
    return;
  }

  userStore.updateProfile({ ...form.value });

  isEditing.value = false;
  showSuccess.value = true;
  errorMsg.value = "";
  setTimeout(() => (showSuccess.value = false), 3000);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 md:p-10">
    <div
      class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-blue-500 relative overflow-hidden"
    >
      <!-- Background Accent -->
      <div
        class="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"
      ></div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          Your Profile
        </h1>
        <router-link
          to="/dashboard"
          class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all font-medium"
        >
          <ArrowLeft class="w-5 h-5" />
          Back to Dashboard
        </router-link>
      </div>

      <!-- Success Alert -->
      <transition name="fade">
        <div
          v-if="showSuccess"
          class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl mb-6 shadow-sm"
        >
          <p class="font-bold">Success</p>
          <p>Profile updated successfully!</p>
        </div>
      </transition>

      <!-- Avatar -->
      <div class="flex flex-col items-center mb-10">
        <div class="relative group">
          <img
            :src= "user"
            alt="Avatar"
            class="w-36 h-36 md:w-40 md:h-40 rounded-full border-8 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <label
            v-if="isEditing"
            class="absolute bottom-2 right-2 cursor-pointer bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
          >
            <Upload class="w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            />
          </label>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-if="isEditing">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
          <!-- Username -->
          <div>
            <label class="block text-gray-600 font-semibold mb-2">Username</label>
            <input
              v-model="form.username"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-600 font-semibold mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-gray-600 font-semibold mb-2">New Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              />
              <button
                @click="showPassword = !showPassword"
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <component :is="showPassword ? EyeOff : Eye" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-gray-600 font-semibold mb-2">Confirm Password</label>
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              />
              <button
                @click="showConfirmPassword = !showConfirmPassword"
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <component :is="showConfirmPassword ? EyeOff : Eye" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <p
            v-if="errorMsg"
            class="text-red-600 mb-6 text-center bg-red-50 p-3 rounded-lg shadow-sm"
          >
            {{ errorMsg }}
          </p>
        </transition>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <button
            @click="isEditing = false"
            class="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10 text-center">
          <div class="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h3 class="text-gray-500 font-semibold mb-1">Username</h3>
            <p class="text-gray-800 text-xl md:text-2xl font-light">{{ userStore.username }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h3 class="text-gray-500 font-semibold mb-1">Email</h3>
            <p class="text-gray-800 text-xl md:text-2xl font-light">{{ userStore.email }}</p>
          </div>
        </div>

        <div class="flex justify-center">
          <button
            @click="isEditing = true"
            class="bg-blue-600 text-white px-10 py-4 rounded-lg shadow-md hover:bg-blue-700 transition font-semibold text-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
