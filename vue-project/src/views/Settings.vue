<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
    Settings as SettingsIcon, Bell, Lock, Globe, CreditCard,
    Eye, EyeOff, Check, Loader2, Mail, Smartphone, Trash2, BellRing,
} from 'lucide-vue-next';
import { dashboardAPI } from '../api/dashboardApi.js';
import { useToast } from '../composables/useToast.js';

const toast = useToast();
const activeTab = ref('account');
const showPwd = ref(false);
const isSaving = ref(false);
const isSaved = ref(false);
const loadingPrefs = ref(false);

const notifications = reactive({
    order_updates: true,
    promotions: false,
    newsletter: true,
    product_alerts: true,
    sms: false,
    push_enabled: false,
});

const pushSupported = ref('PushManager' in window && 'serviceWorker' in navigator && 'Notification' in window);
const pushPermission = ref(Notification?.permission || 'default');
const pushSubscribing = ref(false);

const preferences = reactive({
    language: 'en',
    currency: 'USD',
    theme: 'light',
});

const fetchPreferences = async () => {
    loadingPrefs.value = true;
    try {
        const res = await dashboardAPI.getNotificationPreferences();
        if (res.success && res.data) {
            notifications.order_updates = res.data.order_updates ?? true;
            notifications.promotions = res.data.promotions ?? false;
            notifications.newsletter = res.data.newsletter ?? true;
            notifications.product_alerts = res.data.product_alerts ?? true;
            notifications.sms = res.data.sms ?? false;
            notifications.push_enabled = res.data.push_enabled ?? false;
        }
    } catch (err) {
        // Preferences endpoint may not exist yet; use defaults
        console.log('Using default notification preferences');
    } finally {
        loadingPrefs.value = false;
    }
};

const save = async () => {
    isSaving.value = true;
    await new Promise((r) => setTimeout(r, 300));
    isSaving.value = false;
    isSaved.value = true;
    setTimeout(() => (isSaved.value = false), 2500);
};

const saveNotificationPrefs = async () => {
    isSaving.value = true;
    try {
        const res = await dashboardAPI.updateNotificationPreferences({
            order_updates: notifications.order_updates,
            promotions: notifications.promotions,
            newsletter: notifications.newsletter,
            product_alerts: notifications.product_alerts,
            sms: notifications.sms,
            push_enabled: notifications.push_enabled,
        });
        if (res.success) {
            isSaved.value = true;
            setTimeout(() => (isSaved.value = false), 2500);
            toast.success('Notification preferences saved');
        } else {
            toast.error(res.message || 'Failed to save');
        }
    } catch (err) {
        toast.error('Failed to save notification preferences');
    } finally {
        isSaving.value = false;
    }
};

const requestPushPermission = async () => {
    if (!pushSupported.value) {
        toast.warning('Push notifications not supported in this browser');
        return;
    }
    
    pushSubscribing.value = true;
    try {
        const perm = await Notification.requestPermission();
        pushPermission.value = perm;
        
        if (perm === 'granted') {
            // Register service worker and subscribe
            const reg = await navigator.serviceWorker.register('/sw.js');
            // Get VAPID public key from server
            const keyRes = await dashboardAPI.getVapidPublicKey();
            if (!keyRes.success) {
                toast.error('Failed to get push keys from server');
                return;
            }
            
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(keyRes.data.publicKey),
            });
            
            // Save subscription to server
            const saveRes = await dashboardAPI.savePushSubscription({
                endpoint: sub.endpoint,
                p256dh_key: arrayBufferToBase64(sub.getKey('p256dh')),
                auth_key: arrayBufferToBase64(sub.getKey('auth')),
            });
            
            if (saveRes.success) {
                notifications.push_enabled = true;
                toast.success('Push notifications enabled');
            }
        } else {
            toast.warning('Push notification permission denied');
        }
    } catch (err) {
        console.error('Push subscription error:', err);
        toast.error('Failed to enable push notifications');
    } finally {
        pushSubscribing.value = false;
    }
};

const disablePushNotifications = async () => {
    try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
            await sub.unsubscribe();
            await dashboardAPI.removePushSubscription(sub.endpoint);
        }
        notifications.push_enabled = false;
        toast.success('Push notifications disabled');
    } catch (err) {
        console.error('Push unsubscribe error:', err);
        toast.error('Failed to disable push notifications');
    }
};

// Utility: Convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Utility: ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

onMounted(() => {
    fetchPreferences();
});

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
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-elegant font-bold text-ink">Account settings</h1>
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
                        <div class="flex justify-end">                                <button @click="save" :disabled="isSaving" class="btn-accent active:scale-[0.97] transition-all duration-200">
                                    <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                                    <Check v-else class="w-4 h-4" />
                                    {{ isSaving ? 'Saving...' : 'Save changes' }}
                                </button>
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div v-else-if="activeTab === 'notifications'" class="bg-paper border border-neutral-200 rounded-2xl p-6 lg:p-8 space-y-2">
                        <div class="mb-4 flex items-center justify-between">
                            <div>
                                <h2 class="text-xl font-bold text-ink mb-1">Notifications</h2>
                                <p class="text-sm text-neutral-500">Choose what we notify you about.</p>
                            </div>                                <button @click="saveNotificationPrefs" :disabled="isSaving || loadingPrefs" class="btn-accent text-sm gap-2 active:scale-[0.97] transition-all duration-200">
                                    <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                                    <Check v-else class="w-4 h-4" />
                                    {{ isSaving ? 'Saving...' : 'Save' }}
                                </button>
                        </div>

                        <div v-if="loadingPrefs" class="py-12 flex items-center justify-center">
                            <Loader2 class="w-8 h-8 text-accent animate-spin" />
                        </div>

                        <template v-else>
                            <div v-for="(label, key) in {
                                order_updates: 'Order updates',
                                promotions: 'Promotions & offers',
                                newsletter: 'Weekly newsletter',
                                product_alerts: 'Price drop alerts',
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
                                            <template v-if="key === 'order_updates'">New orders, status changes, and shipment updates.</template>
                                            <template v-else-if="key === 'promotions'">Special offers, discounts, and promotional campaigns.</template>
                                            <template v-else-if="key === 'newsletter'">Our weekly curation of featured products.</template>
                                            <template v-else-if="key === 'product_alerts'">When items in your wishlist drop in price.</template>
                                            <template v-else>Critical alerts and updates via SMS.</template>
                                        </p>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="notifications[key]" class="sr-only peer" />
                                    <span class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-paper after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-paper after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></span>
                                </label>
                            </div>

                            <!-- Push Notifications Section -->
                            <div class="mt-6 pt-6 border-t border-neutral-200">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-start gap-3">
                                        <span class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                            <BellRing class="w-4 h-4 text-amber-600" />
                                        </span>
                                        <div>
                                            <p class="text-sm font-bold text-ink">Push notifications</p>
                                            <p class="text-xs text-neutral-500">Receive alerts even when you're not on the site.</p>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="!pushSupported" class="bg-neutral-50 rounded-xl p-4 text-sm text-neutral-500">
                                    Push notifications are not supported in this browser. Try Chrome, Edge, or Firefox.
                                </div>

                                <div v-else-if="pushPermission === 'denied'" class="bg-red-50 rounded-xl p-4 text-sm text-red-600">
                                    Push notifications were blocked. Update your browser settings to allow notifications for this site.
                                </div>

                                <div v-else class="flex items-center justify-between py-3">
                                    <div>
                                        <p class="text-sm font-bold text-ink">Browser push alerts</p>
                                        <p class="text-xs text-neutral-500">Get notified about orders, stock alerts, and new users.</p>
                                    </div>
                                    <button
                                        v-if="!notifications.push_enabled"
                                        @click="requestPushPermission"
                                        :disabled="pushSubscribing"
                                        class="px-5 py-2.5 bg-ink text-paper rounded-xl text-xs font-bold hover:bg-ink/80 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                    >
                                        <Loader2 v-if="pushSubscribing" class="w-4 h-4 animate-spin" />
                                        {{ pushSubscribing ? 'Enabling...' : 'Enable Push' }}
                                    </button>
                                    <button
                                        v-else
                                        @click="disablePushNotifications"
                                        class="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Disable
                                    </button>
                                </div>
                            </div>
                        </template>
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
                        <div class="flex justify-end">                                <button @click="save" :disabled="isSaving" class="btn-accent active:scale-[0.97] transition-all duration-200">
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
