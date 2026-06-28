<script setup>
import { ref, computed } from 'vue';
import {
    MapPin, Phone, Mail, Send,
    Facebook, Instagram, Twitter,
    MessageSquare, PackageSearch, ArrowLeftRight, Store,
    Shirt, HeartHandshake, Clock, Loader2, CheckCircle2, Sparkles,
} from 'lucide-vue-next';

const contactForm = ref({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: '',
    category: 'general',
});

const isSubmitting = ref(false);
const isSent = ref(false);

const inquiryCategories = [
    { id: 'general', label: 'General', icon: MessageSquare },
    { id: 'order', label: 'Order Status', icon: PackageSearch },
    { id: 'returns', label: 'Returns', icon: ArrowLeftRight },
    { id: 'wholesale', label: 'Wholesale', icon: Store },
    { id: 'styling', label: 'Styling', icon: Shirt },
    { id: 'partnership', label: 'Partnership', icon: HeartHandshake },
];

const storeHours = [
    { day: 'Monday - Friday', hours: '10:00 AM - 9:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Sunday', hours: '11:00 AM - 6:00 PM' },
];

const submit = async () => {
    if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) return;
    isSubmitting.value = true;
    await new Promise((r) => setTimeout(r, 900));
    isSubmitting.value = false;
    isSent.value = true;
    setTimeout(() => {
        isSent.value = false;
        contactForm.value = { name: '', email: '', subject: '', message: '', orderNumber: '', category: 'general' };
    }, 3500);
};

const isOpen = computed(() => {
    const h = new Date().getHours();
    const d = new Date().getDay();
    if (d === 0) return h >= 11 && h < 18;
    if (d === 6) return h >= 10 && h < 22;
    return h >= 10 && h < 21;
});
</script>

<template>
    <div class="bg-paper">
        <!-- Hero -->
        <section class="bg-ink text-paper">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
                <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
                    <Sparkles class="w-4 h-4" />
                    Get in touch
                </span>
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-elegant font-bold leading-[1.05]">
                    We'd love to <span class="italic text-accent">hear</span> from you.
                </h1>
                <p class="mt-6 text-lg text-neutral-300 max-w-2xl mx-auto font-light">
                    Questions, ideas, or feedback — our team usually responds within one business day.
                </p>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid lg:grid-cols-5 gap-8">
                <!-- Form -->
                <div class="lg:col-span-3">
                    <div class="card-flat p-6 lg:p-10">
                        <h2 class="text-2xl font-bold text-ink mb-2">Send us a message</h2>
                        <p class="text-sm text-neutral-500 mb-6">Fill in the form and we'll respond shortly.</p>

                        <!-- Categories -->
                        <div class="mb-6">
                            <label class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Topic</label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <button
                                    v-for="c in inquiryCategories"
                                    :key="c.id"
                                    @click="contactForm.category = c.id"
                                    :class="[
                                        'flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all',
                                        contactForm.category === c.id
                                            ? 'border-ink bg-ink text-paper'
                                            : 'border-neutral-200 text-ink hover:border-ink'
                                    ]"
                                    type="button"
                                >
                                    <component :is="c.icon" class="w-4 h-4" />
                                    <span>{{ c.label }}</span>
                                </button>
                            </div>
                        </div>

                        <form @submit.prevent="submit" class="space-y-5">
                            <div class="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Name</label>
                                    <input v-model="contactForm.name" required type="text" class="input-base" placeholder="Your name" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Email</label>
                                    <input v-model="contactForm.email" required type="email" class="input-base" placeholder="you@example.com" />
                                </div>
                            </div>
                            <div v-if="contactForm.category === 'order' || contactForm.category === 'returns'">
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Order Number</label>
                                <input v-model="contactForm.orderNumber" type="text" class="input-base" placeholder="e.g. ALIE-2024-001" />
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Subject</label>
                                <input v-model="contactForm.subject" type="text" class="input-base" placeholder="What's this about?" />
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Message</label>
                                <textarea v-model="contactForm.message" required rows="5" class="input-base resize-none" placeholder="Tell us more..."></textarea>
                            </div>
                            <button
                                type="submit"
                                :disabled="isSubmitting || isSent"
                                class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-ink text-paper font-bold text-sm rounded-full hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                                <CheckCircle2 v-else-if="isSent" class="w-4 h-4 text-accent-300" />
                                <Send v-else class="w-4 h-4" />
                                {{ isSubmitting ? 'Sending...' : isSent ? 'Sent!' : 'Send message' }}
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Info -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Open status -->
                    <div class="card-flat p-6">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-ink">Store status</h3>
                            <span
                                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                :class="isOpen ? 'bg-accent text-white' : 'bg-neutral-200 text-neutral-700'"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-current pulse-dot"></span>
                                {{ isOpen ? 'Open now' : 'Closed' }}
                            </span>
                        </div>
                        <div class="space-y-2">
                            <div v-for="h in storeHours" :key="h.day" class="flex justify-between text-sm">
                                <span class="text-neutral-600 font-medium">{{ h.day }}</span>
                                <span class="text-ink font-bold tabular-nums">{{ h.hours }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Contact details -->
                    <div class="card-flat p-6 space-y-4">
                        <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-ink mb-3">Direct lines</h3>
                        <a href="tel:+1234567890" class="flex items-center gap-3 group">
                            <div class="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-colors">
                                <Phone class="w-4 h-4 text-ink group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p class="text-xs text-neutral-500">Phone</p>
                                <p class="text-sm font-bold text-ink">+1 (234) 567-890</p>
                            </div>
                        </a>
                        <a href="mailto:support@aleeshop.com" class="flex items-center gap-3 group">
                            <div class="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-colors">
                                <Mail class="w-4 h-4 text-ink group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p class="text-xs text-neutral-500">Email</p>
                                <p class="text-sm font-bold text-ink">support@aleeshop.com</p>
                            </div>
                        </a>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                                <MapPin class="w-4 h-4 text-ink" />
                            </div>
                            <div>
                                <p class="text-xs text-neutral-500">Visit us</p>
                                <p class="text-sm font-bold text-ink">222 Style Avenue, Phnom Penh</p>
                            </div>
                        </div>
                    </div>

                    <!-- Social -->
                    <div class="card-flat p-6">
                        <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-ink mb-3">Follow along</h3>
                        <div class="flex items-center gap-2">
                            <a v-for="s in [{icon: Instagram, label: 'Instagram'}, {icon: Facebook, label: 'Facebook'}, {icon: Twitter, label: 'Twitter'}]" :key="s.label" :aria-label="s.label" href="#" class="w-10 h-10 rounded-full bg-neutral-100 hover:bg-ink hover:text-paper flex items-center justify-center transition-all">
                                <component :is="s.icon" class="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
