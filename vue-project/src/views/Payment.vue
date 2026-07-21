<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import {
    CreditCard, Lock, ShieldCheck, CheckCircle2, ArrowLeft, Loader2,
    Sparkles, Wallet, Smartphone, Building2, ChevronRight,
} from 'lucide-vue-next';

const router = useRouter();
const method = ref('card');
const isProcessing = ref(false);
const isSuccess = ref(false);

const form = ref({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
    saveCard: true,
});

const cardBrand = computed(() => {
    const num = form.value.cardNumber.replace(/\D/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'Mastercard';
    if (num.startsWith('3')) return 'Amex';
    if (num.startsWith('6')) return 'Discover';
    return '';
});

const formattedCardNumber = computed(() => {
    const num = form.value.cardNumber.replace(/\D/g, '');
    const groups = [];
    for (let i = 0; i < num.length && i < 16; i += 4) {
        groups.push(num.slice(i, i + 4));
    }
    return groups.join(' ');
});

watch(() => form.value.cardNumber, (val) => {
    form.value.cardNumber = val.replace(/\D/g, '').slice(0, 16);
});

watch(() => form.value.expiry, (val) => {
    let cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    form.value.expiry = cleaned;
});

watch(() => form.value.cvc, (val) => {
    form.value.cvc = val.replace(/\D/g, '').slice(0, 4);
});

const methods = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
    { id: 'mobile', label: 'Mobile Pay', icon: Smartphone },
    { id: 'bank', label: 'Bank Transfer', icon: Building2 },
];

const orderSummary = { items: 3, subtotal: 142, shipping: 6, tax: 0, total: 148 };

const pageLoading = ref(true);
setTimeout(() => { pageLoading.value = false; }, 1000);

const processPayment = async () => {
    isProcessing.value = true;
    await new Promise((r) => setTimeout(r, 1500));
    isProcessing.value = false;
    isSuccess.value = true;
    setTimeout(() => router.push('/orderSucces'), 1200);
};
</script>

<template>
    <div class="bg-neutral-50 min-h-screen">
        <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <button @click="router.back()" class="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-ink mb-6 transition-colors">
                <ArrowLeft class="w-4 h-4" /> Back
            </button>

            <!-- Skeleton loading -->
            <div v-if="pageLoading" class="grid lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
                <div class="lg:col-span-2">
                    <div class="bg-paper border border-neutral-200 rounded-2xl p-5 sm:p-6 lg:p-8 space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-neutral-200 rounded-xl"></div>
                            <div class="space-y-2">
                                <div class="h-5 bg-neutral-200 rounded w-36"></div>
                                <div class="h-3 bg-neutral-200 rounded w-48"></div>
                            </div>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-2">
                            <div v-for="i in 4" :key="'sk-method-' + i" class="h-14 bg-neutral-200 rounded-xl"></div>
                        </div>
                        <div class="h-48 bg-neutral-200 rounded-2xl"></div>
                        <div class="space-y-4">
                            <div v-for="i in 3" :key="'sk-field-' + i" class="space-y-2">
                                <div class="h-3 bg-neutral-200 rounded w-24"></div>
                                <div class="h-11 bg-neutral-200 rounded-lg"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <div class="h-3 bg-neutral-200 rounded w-16"></div>
                                    <div class="h-11 bg-neutral-200 rounded-lg"></div>
                                </div>
                                <div class="space-y-2">
                                    <div class="h-3 bg-neutral-200 rounded w-12"></div>
                                    <div class="h-11 bg-neutral-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-1">
                    <div class="bg-paper border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
                        <div class="h-4 bg-neutral-200 rounded w-28"></div>
                        <div class="space-y-3">
                            <div v-for="i in 3" :key="'sk-price-' + i" class="flex justify-between">
                                <div class="h-4 bg-neutral-200 rounded w-20"></div>
                                <div class="h-4 bg-neutral-200 rounded w-14"></div>
                            </div>
                        </div>
                        <div class="flex justify-between pt-4 border-t-2 border-neutral-200">
                            <div class="h-5 bg-neutral-200 rounded w-12"></div>
                            <div class="h-7 bg-neutral-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actual content -->
            <div v-if="!pageLoading" class="grid lg:grid-cols-3 gap-6 sm:gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-paper border border-neutral-200 rounded-2xl p-5 sm:p-6 lg:p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
                                <Lock class="w-4 h-4" />
                            </div>
                            <div>
                                <h1 class="text-xl sm:text-2xl font-bold text-ink">Secure payment</h1>
                                <p class="text-sm text-neutral-500 flex items-center gap-1.5">
                                    <ShieldCheck class="w-3.5 h-3.5 text-accent" /> 256-bit SSL encryption
                                </p>
                            </div>
                        </div>

                        <div class="mb-8">
                            <label class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3 block">Payment method</label>
                            <div class="grid sm:grid-cols-2 gap-2">
                                <button v-for="m in methods" :key="m.id" @click="method = m.id" type="button" :class="['flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all', method === m.id ? 'border-ink bg-ink text-paper' : 'border-neutral-200 text-ink hover:border-ink']">
                                    <component :is="m.icon" class="w-5 h-5 shrink-0" />
                                    <span class="text-sm font-bold flex-1">{{ m.label }}</span>
                                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="method === m.id ? 'border-paper bg-accent' : 'border-neutral-300'">
                                        <span v-if="method === m.id" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Card Preview -->
                        <transition name="fade-up" mode="out-in">
                        <div v-if="method === 'card'" :key="'card-form'" class="space-y-5">
                            <div class="relative bg-linear-to-br from-neutral-800 to-ink rounded-2xl p-5 sm:p-6 text-paper overflow-hidden mb-6">
                                <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5"></div>
                                <div class="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5"></div>
                                <div class="flex items-center justify-between mb-8">
                                    <div class="flex items-center gap-2">
                                        <div class="w-10 h-7 rounded-md bg-linear-to-r from-amber-300 to-amber-500 flex items-center justify-center text-[8px] font-bold text-ink">
                                            <span v-if="cardBrand">{{ cardBrand }}</span>
                                            <span v-else class="opacity-40">CRD</span>
                                        </div>
                                    </div>
                                    <Lock class="w-4 h-4 text-white/40" />
                                </div>
                                <p class="text-lg sm:text-xl tracking-[0.15em] font-mono mb-4">
                                    {{ formattedCardNumber || '••••  ••••  ••••  ••••' }}
                                </p>
                                <div class="flex items-end justify-between">
                                    <div class="space-y-1">
                                        <p class="text-[8px] uppercase tracking-[0.2em] text-white/50">Cardholder</p>
                                        <p class="text-sm font-medium">{{ form.cardName || 'Your Name' }}</p>
                                    </div>
                                    <div class="text-right space-y-1">
                                        <p class="text-[8px] uppercase tracking-[0.2em] text-white/50">Expires</p>
                                        <p class="text-sm font-mono">{{ form.expiry || 'MM/YY' }}</p>
                                    </div>
                                </div>
                                <div class="absolute bottom-5 right-5 space-y-1 text-right">
                                    <p class="text-[8px] uppercase tracking-[0.2em] text-white/50">CVC</p>
                                    <p class="text-sm font-mono">{{ form.cvc ? '•'.repeat(form.cvc.length) : '•••' }}</p>
                                </div>
                            </div>
                            <form @submit.prevent="processPayment" class="space-y-5">
                                <div>
                                    <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Card number</label>
                                    <div class="relative">
                                        <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                        <input v-model="form.cardNumber" type="text" placeholder="1234 5678 9012 3456" class="input-base pl-11 font-mono tracking-wider" maxlength="16" aria-label="Card number" />
                                    </div>
                                </div>
                                <div>
                                    <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Name on card</label>
                                    <input v-model="form.cardName" type="text" placeholder="John Doe" class="input-base" aria-label="Name on card" />
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Expiry</label>
                                        <input v-model="form.expiry" type="text" placeholder="MM/YY" class="input-base font-mono" maxlength="5" aria-label="Expiry date" />
                                    </div>
                                    <div>
                                        <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">CVC</label>
                                        <input v-model="form.cvc" type="text" placeholder="123" class="input-base font-mono" maxlength="4" aria-label="CVC code" />
                                    </div>
                                </div>
                                <label class="flex items-center gap-2 text-sm text-ink cursor-pointer">
                                    <input type="checkbox" v-model="form.saveCard" class="w-4 h-4 rounded border-neutral-300 text-accent focus:ring-accent" />
                                    <span>Save this card for future purchases</span>
                                </label>
                                <button type="submit" :disabled="isProcessing || isSuccess" class="w-full btn-accent shine-effect justify-center py-4 text-base">
                                    <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
                                    <CheckCircle2 v-else-if="isSuccess" class="w-5 h-5" />
                                    <Lock v-else class="w-5 h-5" />
                                    {{ isProcessing ? 'Processing...' : isSuccess ? 'Payment successful!' : ('Pay ' + ('$' ) + orderSummary.total + ' securely') }}
                                </button>
                            </form>
                        </div>

                        <div v-else :key="'alt-method'" class="text-center py-12 px-6 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                            <Sparkles class="w-10 h-10 text-accent mx-auto mb-3" />
                            <h3 class="text-lg font-bold text-ink mb-2">{{ methods.find(m => m.id === method).label }}</h3>
                            <p class="text-sm text-neutral-500 mb-5">You'll be redirected to complete this payment securely.</p>
                            <button @click="processPayment" :disabled="isProcessing" class="btn-accent">
                                <Loader2 v-if="isProcessing" class="w-4 h-4 animate-spin" />
                                <Lock v-else class="w-4 h-4" />
                                {{ isProcessing ? 'Redirecting...' : 'Continue to ' + methods.find(m => m.id === method).label }}
                            </button>
                        </div>
                        </transition>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <div v-for="b in [
                            { icon: ShieldCheck, label: 'Buyer protection' },
                            { icon: Lock, label: 'SSL encrypted' },
                            { icon: CheckCircle2, label: 'PCI compliant' },
                        ]" :key="b.label" class="bg-paper border border-neutral-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                            <component :is="b.icon" class="w-5 h-5 text-accent" />
                            <span class="text-xs font-bold text-ink">{{ b.label }}</span>
                        </div>
                    </div>
                </div>

                <aside class="lg:col-span-1">
                    <div class="bg-paper border border-neutral-200 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 space-y-4 sm:space-y-5">
                        <h2 class="text-sm font-bold uppercase tracking-[0.2em] text-ink">Order summary</h2>
                        <div class="space-y-3 pb-5 border-b border-neutral-200">
                            <div class="flex justify-between text-sm">
                                <span class="text-neutral-600">Items ({{ orderSummary.items }})</span>
                                <span class="font-bold text-ink tabular-nums">{{ '$' }}{{ orderSummary.subtotal }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-neutral-600">Shipping</span>
                                <span class="font-bold text-ink tabular-nums">{{ '$' }}{{ orderSummary.shipping }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-neutral-600">Tax</span>
                                <span class="font-bold text-accent">Free</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-baseline">
                            <span class="text-sm font-bold text-ink">Total</span>
                            <span class="text-3xl font-elegant font-bold text-ink tabular-nums">{{ '$' }}{{ orderSummary.total }}</span>
                        </div>
                        <RouterLink to="/checkout" class="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-accent transition-colors">
                            <ChevronRight class="w-3 h-3 rotate-180" /> Edit order
                        </RouterLink>
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>
