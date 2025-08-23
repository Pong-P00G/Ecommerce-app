<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "../stores/useUser.js";
import { Eye, EyeOff, Upload } from "lucide-vue-next";
import UserProfile from "../assets/img/user/user (2).png";

const router = useRouter();
const user = useUser();

const isEditing = ref(false);
const form = ref({ ...user.$state });
const showSuccess = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPassword = ref("");
const errorMsg = ref("");

// ✅ new state for preview
const avatarPreview = ref(form.value.avatar || UserProfile);

function handleLogout() {
    user.logout();
    localStorage.removeItem("loggedInUser");
    router.push("/login");
}

function handleEdit() {
    isEditing.value = true;
    form.value = { ...user.$state };
    confirmPassword.value = form.value.password;
    avatarPreview.value = form.value.avatar || UserProfile;
    }

    function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        avatarPreview.value = e.target.result; // preview image
        form.value.avatar = e.target.result;   // save in form
    };
    reader.readAsDataURL(file);
}

function handleSave() {
    if (form.value.password !== confirmPassword.value) {
        errorMsg.value = "Passwords do not match!";
        return;
    }

    user.updateProfile({ ...form.value });

    isEditing.value = false;
    showSuccess.value = true;
    errorMsg.value = "";
    setTimeout(() => (showSuccess.value = false), 3000);
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6">
        <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
        <!-- Success Toast -->
        <transition name="slide-fade">
            <div v-if="showSuccess" class="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg">
                Profile updated successfully!
            </div>
        </transition>
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h2>
        <!-- Avatar -->
        <div class="flex flex-col items-center mb-6 relative">
            <img :src="avatarPreview" alt="Avatar"
                class="w-24 h-24 rounded-full border-4 border-slate-200 shadow-lg"/>
            <div v-if="isEditing" class="mt-3">
                <label class="cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg shadow hover:scale-105 transition flex items-center gap-2">
                    <Upload class="w-4 h-4" />
                    Change Avatar
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload"/>
                </label>
            </div>
        </div>
        <div v-if="isEditing" class="space-y-5">
            <!-- Username -->
            <div class="relative">
                <input v-model="form.username" placeholder=" " class="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"/>
                <label class="absolute left-0 -top-3 text-gray-500 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                    Username
                </label>
            </div>
            <!-- Email -->
            <div class="relative">
                <input v-model="form.email" placeholder=" "  type="email" class="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"/>
                <label class="absolute left-0 -top-3 text-gray-500 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                    Email
                </label>
            </div>
            <!-- Password -->
            <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" v-model="form.password"  placeholder=" " class="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 pr-10"/>
                <label class="absolute left-0 -top-3 text-gray-500 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                    New Password
                </label>
                <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
                </button>
            </div>
            <!-- Confirm Password -->
            <div class="relative">
                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder=" "
                    class="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 pr-10"/>
                <label class="absolute left-0 -top-3 text-gray-500 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                    Confirm Password
                </label>
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <component :is="showConfirmPassword ? EyeOff : Eye" class="w-5 h-5" />
                </button>
            </div>
            <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
            <!-- Buttons -->
            <div class="flex justify-between mt-4">
                <button @click="handleSave" class="w-full mr-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
                    Save Changes
                </button>
                <button @click="isEditing = false" class="w-full ml-2 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-400 transition">
                    Cancel
                </button>
            </div>
        </div>
        <div v-else class="flex justify-between mt-6">
            <button @click="handleEdit" class="w-full mr-2 bg-blue-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition">
                Edit Profile
            </button>
            <button @click="handleLogout" class="w-full ml-2 bg-red-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:bg-red-600 transition">
                Logout
            </button>
        </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.5s ease;
}
.slide-fade-leave-active {
    transition: all 0.5s ease;
}
.slide-fade-enter-from {
    transform: translateY(20px);
    opacity: 0;
}
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
