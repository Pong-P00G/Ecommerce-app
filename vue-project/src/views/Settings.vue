<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { getUserById, updateProfile, changePassword } from '@/api/users.js';

const auth = useAuthStore();

const placeholderAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="%235865f2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="white">👤</text></svg>';

const form = reactive({
  username: '',
  email: ''
});
const profileError = ref('');
const profileSaved = ref(false);
const loadingProfile = ref(false);

const avatarPreview = ref('');

const prefs = reactive({
  productUpdates: JSON.parse(localStorage.getItem('pref_productUpdates') || 'true'),
  newsletter: JSON.parse(localStorage.getItem('pref_newsletter') || 'false')
});
const prefsSaved = ref(false);

const theme = ref(localStorage.getItem('theme') || 'system');
watch(theme, (val) => applyTheme(val), { immediate: true });

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
});
const passwordError = ref('');
const passwordSaved = ref(false);
const loadingPassword = ref(false);

function applyTheme(mode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = mode === 'dark' || (mode === 'system' && prefersDark);
  root.classList.toggle('dark', useDark);
  localStorage.setItem('theme', mode);
}
function setTheme(mode) {
  theme.value = mode;
}

function savePrefs() {
  localStorage.setItem('pref_productUpdates', JSON.stringify(prefs.productUpdates));
  localStorage.setItem('pref_newsletter', JSON.stringify(prefs.newsletter));
  prefsSaved.value = true;
  setTimeout(() => (prefsSaved.value = false), 1200);
}

function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatarPreview.value = reader.result;
  };
  reader.readAsDataURL(file);
}

async function loadProfile() {
  try {
    profileError.value = '';
    loadingProfile.value = true;
    const id = auth.user?.id || auth.user?._id || auth.user?.userId;
    if (!id) {
      profileError.value = 'No user session found';
      return;
    }
    const data = await getUserById(id);
    const profile = data?.user || data;
    form.username = profile?.username || profile?.name || form.username;
    form.email = profile?.email || form.email;
  } catch (e) {
    profileError.value = e.message || 'Failed to load profile';
  } finally {
    loadingProfile.value = false;
  }
}

async function saveProfile() {
  profileError.value = '';
  profileSaved.value = false;
  loadingProfile.value = true;
  try {
    const payload = {
      username: form.username,
      email: form.email
    };
    const res = await updateProfile(payload);
    const updatedUser = res?.user || res;
    // Update auth store user if possible
    if (updatedUser) {
      auth.user = { ...(auth.user || {}), ...updatedUser };
      localStorage.setItem('auth_user', JSON.stringify(auth.user));
    }
    profileSaved.value = true;
    setTimeout(() => (profileSaved.value = false), 1500);
  } catch (e) {
    profileError.value = e.message || 'Failed to save profile';
  } finally {
    loadingProfile.value = false;
  }
}

async function submitPassword() {
  passwordError.value = '';
  passwordSaved.value = false;
  if (passwordForm.new !== passwordForm.confirm) {
    passwordError.value = 'New passwords do not match';
    return;
  }
  loadingPassword.value = true;
  try {
    await changePassword({
      currentPassword: passwordForm.current,
      newPassword: passwordForm.new
    });
    passwordSaved.value = true;
    passwordForm.current = '';
    passwordForm.new = '';
    passwordForm.confirm = '';
    setTimeout(() => (passwordSaved.value = false), 1500);
  } catch (e) {
    passwordError.value = e.message || 'Failed to update password';
  } finally {
    loadingPassword.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>


<template>
  <div class="min-h-screen bg-neutral text-primary">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="mb-10 text-center lg:text-left">
        <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight">Settings</h1>
        <p class="text-gray-600 mt-2 text-lg">Manage your profile, password, and preferences.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile -->
        <section class="lg:col-span-2 rounded-3xl bg-white ring-1 ring-gray-200 p-8 shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Profile</h2>
            <span v-if="profileSaved" class="text-secondary text-sm font-medium">Saved ✓</span>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm text-gray-600 mb-2" for="username">Username</label>
                <input
                    id="username"
                    v-model.trim="form.username"
                    type="text"
                    required
                    class="w-full px-5 py-3 rounded-2xl bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary outline-none placeholder:text-gray-400 transition"
                    placeholder="Pong"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-2" for="email">Email</label>
                <input
                    id="email"
                    v-model.trim="form.email"
                    type="email"
                    required
                    class="w-full px-5 py-3 rounded-2xl bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary outline-none placeholder:text-gray-400 transition"
                    placeholder="you@example.com"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="relative group">
                <img
                    :src="avatarPreview || placeholderAvatar"
                    alt="Avatar"
                    class="h-16 w-16 rounded-xl object-cover ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-105"
                />
                <label
                    class="absolute -bottom-2 -right-2 bg-secondary hover:bg-secondary/90 transition text-xs px-3 py-1 rounded-md cursor-pointer shadow-md opacity-0 group-hover:opacity-100 text-white"
                >
                  Change
                  <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
                </label>
              </div>
              <p class="text-sm text-gray-500">Avatar is preview only until uploaded.</p>
            </div>

            <div class="flex items-center gap-3">
              <button
                  type="submit"
                  :disabled="loadingProfile"
                  class="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-60 transition font-semibold shadow-md text-white"
              >
                <span v-if="!loadingProfile">Save profile</span>
                <span v-else>Saving...</span>
              </button>
              <p v-if="profileError" class="text-sm text-red-500 font-medium">{{ profileError }}</p>
            </div>
          </form>
        </section>

        <!-- Preferences -->
        <aside class="rounded-3xl bg-white ring-1 ring-gray-200 p-8 shadow-lg flex flex-col justify-between">
          <div class="space-y-8">
            <div>
              <p class="text-sm text-gray-600 mb-2">Notifications</p>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="prefs.productUpdates" class="h-4 w-4 rounded accent-secondary" />
                <span class="text-sm">Product updates</span>
              </label>
              <label class="flex items-center gap-3 mt-2">
                <input type="checkbox" v-model="prefs.newsletter" class="h-4 w-4 rounded accent-secondary" />
                <span class="text-sm">Monthly newsletter</span>
              </label>
            </div>
          </div>

          <div class="mt-6">
            <button
                type="button"
                @click="savePrefs"
                class="w-full px-5 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition font-medium shadow-md"
            >Save preferences</button>
            <p v-if="prefsSaved" class="text-secondary text-sm mt-2 font-medium">Preferences saved ✓</p>
          </div>
        </aside>
      </div>

      <!-- Password -->
      <section class="mt-10 rounded-3xl bg-white ring-1 ring-gray-200 p-8 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Password</h2>
          <span v-if="passwordSaved" class="text-secondary text-sm font-medium">Updated ✓</span>
        </div>

        <form @submit.prevent="submitPassword" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm text-gray-600 mb-2" for="current">Current password</label>
            <input
                id="current"
                v-model="passwordForm.current"
                type="password"
                required
                class="w-full px-5 py-3 rounded-2xl bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary outline-none placeholder:text-gray-400 transition"
                placeholder="••••••••"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-2" for="new">New password</label>
            <input
                id="new"
                v-model="passwordForm.new"
                type="password"
                required
                minlength="6"
                class="w-full px-5 py-3 rounded-2xl bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary outline-none placeholder:text-gray-400 transition"
                placeholder="••••••••"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-2" for="confirm">Confirm</label>
            <input
                id="confirm"
                v-model="passwordForm.confirm"
                type="password"
                required
                minlength="6"
                class="w-full px-5 py-3 rounded-2xl bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary outline-none placeholder:text-gray-400 transition"
                placeholder="••••••••"
            />
          </div>

          <div class="md:col-span-3 flex items-center gap-3 mt-4">
            <button
                type="submit"
                :disabled="loadingPassword"
                class="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-60 transition font-semibold shadow-md text-white"
            >
              <span v-if="!loadingPassword">Update password</span>
              <span v-else>Updating...</span>
            </button>
            <p v-if="passwordError" class="text-sm text-red-500 font-medium">{{ passwordError }}</p>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
