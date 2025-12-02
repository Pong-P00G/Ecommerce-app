<script setup>
import { ref, reactive } from 'vue';
import { UserIcon, ShieldCheckIcon, CogIcon, CameraIcon, ArrowLeftCircleIcon } from '@heroicons/vue/24/outline';
import { RouterLink, useRoute } from 'vue-router';


const route = useRoute();

// Tab management
const activeTab = ref('profile')
const tabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'preferences', name: 'Preferences', icon: CogIcon },
  { id: 'logout', name: 'Logout', icon: ArrowLeftCircleIcon },
]

// User data
const user = reactive({
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  bio: 'Product designer passionate about creating beautiful and functional user experiences. Love hiking and photography.',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  joinDate: '2023-01-15'
})

// Password form
const password = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Preferences
const preferences = reactive({
  emailNotifications: true,
  smsNotifications: false,
  language: 'en',
  timezone: 'pst'
})

const logout = reactive({
  status: '',
})

// UI states
const editAvatar = ref(false)

// Methods
const updateProfile = () => {
  console.log('Updating profile:', user)
  // Add API call here
}

const changePassword = () => {
  console.log('Changing password:', password)
  // Add API call here
  password.current = ''
  password.new = ''
  password.confirm = ''
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Sidebar - Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <nav class="space-y-2">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <component :is="tab.icon" class="w-5 h-5" />
                  <span class="font-medium">{{ tab.name }}</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center space-x-6 mb-8">
              <div class="relative">
                <img
                    :src="user.avatar"
                    alt="Profile"
                    class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                    @click="editAvatar = true"
                    class="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <CameraIcon class="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ user.name }}</h2>
                <p class="text-gray-600">{{ user.email }}</p>
                <p class="text-sm text-gray-500 mt-1">Joined {{ formatDate(user.joinDate) }}</p>
              </div>
            </div>
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                      v-model="user.name"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                      v-model="user.email"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                    v-model="user.bio"
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                      v-model="user.location"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                      v-model="user.phone"
                      type="tel"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
            <div class="space-y-6">
              <div class="border-b border-gray-200 pb-6">
                <h4 class="font-medium text-gray-900 mb-4">Change Password</h4>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                        v-model="password.current"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                        v-model="password.new"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                        v-model="password.confirm"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                      type="submit"
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </form>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600">Add an extra layer of security to your account</p>
                    <p class="text-sm text-gray-500 mt-1">Status: <span class="text-orange-500">Not enabled</span></p>
                  </div>
                  <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">Email Notifications</p>
                  <p class="text-sm text-gray-600">Receive email updates and notifications</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="preferences.emailNotifications" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">SMS Notifications</p>
                  <p class="text-sm text-gray-600">Receive text message notifications</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="preferences.smsNotifications" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                    v-model="preferences.language"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                    v-model="preferences.timezone"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="est">Eastern Time (ET)</option>
                  <option value="cst">Central Time (CT)</option>
                  <option value="pst">Pacific Time (PT)</option>
                  <option value="gmt">Greenwich Mean Time (GMT)</option>
                </select>
              </div>
            </div>
          </div>
          <!-- Login Tab -->
          <div v-if="activeTab === 'logout'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <RouterLink to="/login" class="bg-cyan-50 font-semibold px-8 py-4 rounded-2xl text-gray-900 mt-6 inline-block hover:scale-105">
              Back to Login Page
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>