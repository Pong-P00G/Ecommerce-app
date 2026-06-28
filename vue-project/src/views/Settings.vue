<script setup>
import { ref, reactive } from 'vue';
import {
    Settings as SettingsIcon, Bell, Lock, Globe, CreditCard,
    Eye, EyeOff, Check, Loader2, Mail, Smartphone, Trash2,
} from 'lucide-vue-next';

const activeTab = ref('account');
const showPwd = ref(false);
const isSaving = ref(false);
const isSaved = ref(false);

const notifications = reactive({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productAlerts: true,
    sms: false,
});

const preferences = reactive({
    language: 'en',
    currency: 'USD',
    theme: 'light',
});

const save = async () => {
    isSaving.value = true;
    await new Promise((r) => setTimeout(r, 700));
    isSaving.value = false;
    isSaved.value = true;
    setTimeout(() => (isSaved.value = false), 2500);
};

const tabs = [
    { id: 'account', label: 'Account', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
];
</script>

<template>
    <div class="bg-neutral-50 min-h-screen">
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Header -->
            <div class="mb-10 space-y-2">
                <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    <SettingsIcon class="w-4 h-4" />
                    Settings
                </span>
                <h1 class="text-4xl md:text-5xl font-elegant font-bold text-ink">Account settings</h1>
                <p class="text-neutral-500">Manage your preferences, security, and notifications.</p>
            </div>

            <div class="grid lg:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <aside class="lg:col-span-1">
                    <nav class="bg-paper border border-neutral-200 rounded-2xl p-2 sticky top-24">
                        <button
                            v-for="t in tabs"
                            :key="t.id"
                            @click="activeTab = t.id"
                            :class="[
                                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
                                activeTab === t.id
                                    ? 'bg-ink text-paper'
                                    : 'text-ink hover:bg-neutral-100'
                            ]"
                        >
                            <component :is="t.icon" class="w-4 h-4" />
                            <span>{{ t.label }}</span>
                        </button>
                    </nav>
                </aside>

                <!-- Content -->
                <div class="lg:col-span-3 space-y-6">
                    <transition name="slide-fade">
                        <div v-if="isSaved" class="bg-accent-50 border border-accent-200 text-accent-700 rounded-2xl px-5 py-3 flex items-center gap-2 text-sm font-bold">
                            <Check class="w-4 h-4" />
                            Settings saved successfully.
                        </div>
                    </transition>

                    <!-- Account -->
                    <div v-if="activeTab === 'account'" class="bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-6">
                        <div>
                            <h2 class="text-xl font-bold text-ink mb-1">Account information</h2>
                            <p class="text-sm text-neutral-500">Update your account details and personal info.</p>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Display name</label>
                                <input type="text" class="input-base" placeholder="Your name" />
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Email</label>
                                <input type="email" class="input-base" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Bio</label>
                            <textarea rows="3" class="input-base resize-none" placeholder="Tell us about yourself"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button @click="save" :disabled="isSaving" class="btn-accent">
                                <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                                <Check v-else class="w-4 h-4" />
                                {{ isSaving ? 'Saving...' : 'Save changes' }}
                            </button>
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div v-else-if="activeTab === 'notifications'" class="bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-2">
                        <div class="mb-4">
                            <h2 class="text-xl font-bold text-ink mb-1">Notifications</h2>
                            <p class="text-sm text-neutral-500">Choose what we notify you about.</p>
                        </div>

                        <div v-for="(label, key) in {
                            orderUpdates: 'Order updates',
                            promotions: 'Promotions & offers',
                            newsletter: 'Weekly newsletter',
                            productAlerts: 'Price drop alerts',
                            sms: 'SMS notifications',
                        }" :key="key" class="flex items-center justify-between py-4 border-b border-neutral-100 last:border-b-0">
                            <div class="flex items-start gap-3">
                                <span class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                                    <Mail v-if="key !== 'sms'" class="w-4 h-4 text-ink" />
                                    <Smartphone v-else class="w-4 h-4 text-ink" />
                                </span>
                                <div>
                                    <p class="text-sm font-bold text-ink">{{ label }}</p>
                                    <p class="text-xs text-neutral-500">
                                        <template v-if="key === 'orderUpdates'">Updates about your orders and shipments.</template>
                                        <template v-else-if="key === 'promotions'">Special offers and discount codes.</template>
                                        <template v-else-if="key === 'newsletter'">Our weekly curation of products.</template>
                                        <template v-else-if="key === 'productAlerts'">When items in your wishlist go on sale.</template>
                                        <template v-else>Critical account alerts via SMS.</template>
                                    </p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="notifications[key]" class="sr-only peer" />
                                <span class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-paper after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-paper after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Security -->
                    <div v-else-if="activeTab === 'security'" class="space-y-6">
                        <div class="bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-5">
                            <div>
                                <h2 class="text-xl font-bold text-ink mb-1">Change password</h2>
                                <p class="text-sm text-neutral-500">Use a strong password you don't reuse elsewhere.</p>
                            </div>
                            <div class="space-y-4">
                                <div class="relative">
                                    <input :type="showPwd ? 'text' : 'password'" placeholder="Current password" class="input-base pr-10" />
                                    <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink">
                                        <EyeOff v-if="showPwd" class="w-4 h-4" />
                                        <Eye v-else class="w-4 h-4" />
                                    </button>
                                </div>
                                <input type="password" placeholder="New password" class="input-base" />
                                <input type="password" placeholder="Confirm new password" class="input-base" />
                            </div>
                            <div class="flex justify-end">
                                <button class="btn-primary">Update password</button>
                            </div>
                        </div>

                        <div class="bg-paper border border-red-200 rounded-2xl p-6 lg:p-8 space-y-4">
                            <div>
                                <h2 class="text-xl font-bold text-red-600 mb-1">Danger zone</h2>
                                <p class="text-sm text-neutral-500">Permanently delete your account and all associated data.</p>
                            </div>
                            <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-paper border border-red-300 text-red-600 font-bold text-sm rounded-full hover:bg-red-600 hover:text-paper hover:border-red-600 transition-all">
                                <Trash2 class="w-4 h-4" />
                                Delete account
                            </button>
                        </div>
                    </div>

                    <!-- Preferences -->
                    <div v-else-if="activeTab === 'preferences'" class="bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-6">
                        <div>
                            <h2 class="text-xl font-bold text-ink mb-1">Preferences</h2>
                            <p class="text-sm text-neutral-500">Customize your experience.</p>
                        </div>
                        <div class="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Language</label>
                                <select v-model="preferences.language" class="input-base">
                                    <option value="en">English</option>
                                    <option value="km">ខ្មែរ</option>
                                    <option value="fr">Français</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Currency</label>
                                <select v-model="preferences.currency" class="input-base">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="KHR">KHR (៛)</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Theme</label>
                                <select v-model="preferences.theme" class="input-base">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button @click="save" :disabled="isSaving" class="btn-accent">
                                <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                                <Check v-else class="w-4 h-4" />
                                {{ isSaving ? 'Saving...' : 'Save preferences' }}
                            </button>
                        </div>
                    </div>

                    <!-- Billing -->
                    <div v-else-if="activeTab === 'billing'" class="space-y-6">
                        <div class="bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h2 class="text-xl font-bold text-ink mb-1">Payment methods</h2>
                                    <p class="text-sm text-neutral-500">Manage your saved cards and wallets.</p>
                                </div>
                                <button class="btn-primary">+ Add card</button>
                            </div>
                            <div class="space-y-3">
                                <div v-for="card in [
                                    { brand: 'VISA', last: '4242', exp: '12/26' },
                                    { brand: 'MC', last: '8888', exp: '08/25' },
                                ]" :key="card.last" class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-8 bg-ink text-paper rounded-md flex items-center justify-center text-xs font-bold">{{ card.brand }}</div>
                                        <div>
                                            <p class="text-sm font-bold text-ink">•••• •••• •••• {{ card.last }}</p>
                                            <p class="text-xs text-neutral-500">Expires {{ card.exp }}</p>
                                        </div>
                                    </div>
                                    <button class="text-xs font-bold text-red-600 hover:underline">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
