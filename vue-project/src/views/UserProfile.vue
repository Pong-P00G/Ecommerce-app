<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import {
    User, Mail, Phone, MapPin, Calendar, Camera,
    Edit3, Save, LogOut, Package, Heart, Settings as SettingsIcon,
    ShoppingBag, ShieldCheck, Loader2, X,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

const activeTab = ref('overview');
const isEditing = ref(false);
const isSaving = ref(false);
const isSaved = ref(false);

const profile = ref({
    name: authStore.user?.username || 'Guest User',
    email: authStore.user?.email || 'user@aleeshop.com',
    phone: '+1 (555) 123-4567',
    location: 'Phnom Penh, Cambodia',
    bio: 'Lover of design, slow fashion, and great coffee.',
    joined: '2024',
});

const stats = [
    { label: 'Orders', value: 24, icon: Package },
    { label: 'Wishlist', value: 12, icon: Heart },
    { label: 'Reviews', value: 8, icon: Edit3 },
];

const recentOrders = [
    { id: 'ALIE-2024-018', date: 'Mar 12, 2024', total: 148, status: 'Delivered', items: 3 },
    { id: 'ALIE-2024-015', date: 'Mar 02, 2024', total: 89, status: 'In transit', items: 2 },
    { id: 'ALIE-2024-009', date: 'Feb 14, 2024', total: 219, status: 'Delivered', items: 5 },
];

const statusColor = (s) =>
    s === 'Delivered' ? 'bg-accent text-white' :
    s === 'In transit' ? 'bg-ink text-paper' :
    'bg-neutral-200 text-ink';

const save = async () => {
    isSaving.value = true;
    await new Promise((r) => setTimeout(r, 700));
    isSaving.value = false;
    isSaved.value = true;
    isEditing.value = false;
    setTimeout(() => (isSaved.value = false), 2500);
};

const logout = () => {
    authStore.logout();
    router.push('/login');
};

const initials = computed(() =>
    profile.value.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
);
</script>

<template>
    <div class="bg-neutral-50 min-h-screen">
        <!-- Cover + avatar -->
        <section class="bg-ink text-paper">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <div class="flex flex-col md:flex-row items-start md:items-end gap-6">
                    <div class="relative">
                        <div class="w-28 h-28 rounded-3xl bg-accent flex items-center justify-center text-3xl font-elegant font-bold text-white border-4 border-paper">
                            {{ initials }}
                        </div>
                        <button class="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-paper text-ink flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-colors" aria-label="Change photo">
                            <Camera class="w-4 h-4" />
                        </button>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">Member since {{ profile.joined }}</p>
                        <h1 class="text-3xl md:text-4xl font-elegant font-bold">{{ profile.name }}</h1>
                        <p class="text-neutral-400 mt-1 flex items-center gap-2">
                            <Mail class="w-4 h-4" />
                            {{ profile.email }}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            @click="isEditing = !isEditing"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-paper text-ink font-bold text-sm rounded-full hover:bg-accent hover:text-white transition-all"
                        >
                            <Edit3 class="w-4 h-4" />
                            {{ isEditing ? 'Cancel' : 'Edit profile' }}
                        </button>
                        <button
                            @click="logout"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-neutral-700 text-paper font-bold text-sm rounded-full hover:bg-paper hover:text-ink transition-all"
                        >
                            <LogOut class="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16 relative z-10">
            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div v-for="s in stats" :key="s.label" class="bg-paper border border-neutral-200 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-ink transition-colors">
                    <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                        <component :is="s.icon" class="w-5 h-5 text-ink" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xl sm:text-2xl font-elegant font-bold text-ink tabular-nums">{{ s.value }}</p>
                        <p class="text-xs font-bold uppercase tracking-wider text-neutral-500 truncate">{{ s.label }}</p>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex items-center gap-1 sm:gap-2 mb-6 border-b border-neutral-200 overflow-x-auto">
                <button
                    v-for="tab in [
                        { id: 'overview', label: 'Overview', icon: User },
                        { id: 'orders', label: 'Orders', icon: ShoppingBag },
                        { id: 'security', label: 'Security', icon: ShieldCheck },
                    ]"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                        'inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap shrink-0',
                        activeTab === tab.id
                            ? 'border-ink text-ink'
                            : 'border-transparent text-neutral-500 hover:text-ink'
                    ]"
                >
                    <component :is="tab.icon" class="w-4 h-4" />
                    {{ tab.label }}
                </button>
            </div>

            <!-- Overview -->
            <div v-if="activeTab === 'overview'" class="grid lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-6">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-ink">Personal info</h2>
                        <transition name="slide-fade">
                            <span v-if="isSaved" class="text-xs font-bold text-accent flex items-center gap-1">
                                <Save class="w-3 h-3" />
                                Saved
                            </span>
                        </transition>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Full name</label>
                            <input v-model="profile.name" :disabled="!isEditing" class="input-base disabled:bg-neutral-50 disabled:text-neutral-500" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Email</label>
                            <input v-model="profile.email" :disabled="!isEditing" type="email" class="input-base disabled:bg-neutral-50 disabled:text-neutral-500" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Phone</label>
                            <input v-model="profile.phone" :disabled="!isEditing" class="input-base disabled:bg-neutral-50 disabled:text-neutral-500" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Location</label>
                            <input v-model="profile.location" :disabled="!isEditing" class="input-base disabled:bg-neutral-50 disabled:text-neutral-500" />
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Bio</label>
                        <textarea v-model="profile.bio" :disabled="!isEditing" rows="3" class="input-base disabled:bg-neutral-50 disabled:text-neutral-500 resize-none"></textarea>
                    </div>
                    <div v-if="isEditing" class="flex gap-2 pt-2">
                        <button @click="save" :disabled="isSaving" class="btn-accent">
                            <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                            <Save v-else class="w-4 h-4" />
                            {{ isSaving ? 'Saving...' : 'Save changes' }}
                        </button>
                        <button @click="isEditing = false" class="btn-outline">Cancel</button>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-paper border border-neutral-200 rounded-2xl p-6">
                        <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-ink mb-4">Account</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex items-center justify-between">
                                <span class="text-neutral-500">Plan</span>
                                <span class="font-bold text-ink">Premium</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-neutral-500">Member since</span>
                                <span class="font-bold text-ink">{{ profile.joined }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-neutral-500">Status</span>
                                <span class="inline-flex items-center gap-1 text-xs font-bold text-accent">
                                    <span class="w-1.5 h-1.5 rounded-full bg-accent pulse-dot"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders -->
            <div v-else-if="activeTab === 'orders'" class="bg-paper border border-neutral-200 rounded-2xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[600px]">
                        <thead class="bg-neutral-50">
                            <tr class="text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                                <th class="px-4 sm:px-6 py-4">Order</th>
                                <th class="px-4 sm:px-6 py-4">Date</th>
                                <th class="px-4 sm:px-6 py-4">Items</th>
                                <th class="px-4 sm:px-6 py-4">Total</th>
                                <th class="px-4 sm:px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr v-for="o in recentOrders" :key="o.id" class="hover:bg-neutral-50 transition-colors">
                                <td class="px-4 sm:px-6 py-4 text-sm font-bold text-ink tabular-nums">{{ o.id }}</td>
                                <td class="px-4 sm:px-6 py-4 text-sm text-neutral-600">{{ o.date }}</td>
                                <td class="px-4 sm:px-6 py-4 text-sm text-neutral-600 tabular-nums">{{ o.items }}</td>
                                <td class="px-4 sm:px-6 py-4 text-sm font-bold text-ink tabular-nums">{{ '$' }}{{ o.total }}</td>
                                <td class="px-4 sm:px-6 py-4">
                                    <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold', statusColor(o.status)]">{{ o.status }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Security -->
            <div v-else-if="activeTab === 'security'" class="grid lg:grid-cols-2 gap-6">
                <div class="bg-paper border border-neutral-200 rounded-2xl p-6 space-y-4">
                    <h3 class="text-lg font-bold text-ink">Password</h3>
                    <p class="text-sm text-neutral-500">Update your password to keep your account secure.</p>
                    <input type="password" placeholder="Current password" class="input-base" />
                    <input type="password" placeholder="New password" class="input-base" />
                    <input type="password" placeholder="Confirm new password" class="input-base" />
                    <button class="btn-primary">Update password</button>
                </div>
                <div class="bg-paper border border-neutral-200 rounded-2xl p-6 space-y-4">
                    <h3 class="text-lg font-bold text-ink">Two-factor authentication</h3>
                    <p class="text-sm text-neutral-500">Add an extra layer of security to your account.</p>
                    <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                            <p class="text-sm font-bold text-ink">Authenticator app</p>
                            <p class="text-xs text-neutral-500">Use an app like Authy or Google Authenticator.</p>
                        </div>
                        <button class="btn-outline">Enable</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
