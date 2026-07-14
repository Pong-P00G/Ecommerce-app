<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { CheckCircle2, Package, Mail, ArrowRight, Sparkles, Truck, Calendar, Download } from 'lucide-vue-next';

const showContent = ref(false);
const showConfetti = ref(false);

const confettiPieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    color: ['bg-accent', 'bg-ink', 'bg-amber-400', 'bg-emerald-400', 'bg-blue-400', 'bg-violet-400'][i % 6],
    size: 6 + Math.random() * 6,
    rotation: Math.random() * 360,
}));

const countUp = ref(0);
const targetTotal = 148;

onMounted(() => {
    showConfetti.value = true;
    setTimeout(() => { showContent.value = true; }, 100);
    // Animate count-up
    const steps = 30;
    const increment = targetTotal / steps;
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetTotal) {
            countUp.value = targetTotal;
            clearInterval(timer);
        } else {
            countUp.value = Math.round(current * 100) / 100;
        }
    }, 40);
});
</script>

<template>
    <div class="bg-paper min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <!-- Confetti Pieces -->
        <div v-if="showConfetti" class="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                v-for="piece in confettiPieces"
                :key="piece.id"
                class="absolute rounded-sm animate-confetti"
                :class="piece.color"
                :style="{
                    left: piece.left + '%',
                    top: '-10px',
                    width: piece.size + 'px',
                    height: piece.size * 0.6 + 'px',
                    animationDelay: piece.delay + 's',
                    animationDuration: piece.duration + 's',
                    transform: 'rotate(' + piece.rotation + 'deg)',
                }"
            ></div>
        </div>

        <div class="max-w-2xl w-full text-center relative">
            <!-- Icon with staggered entrance -->
            <transition name="fade-up-scale">
                <div v-if="showContent" class="relative inline-block mb-8">
                    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-50 flex items-center justify-center mx-auto">
                        <CheckCircle2 class="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                    </div>
                    <span class="absolute inset-0 rounded-full ring-4 ring-accent/20"></span>
                </div>
            </transition>

            <transition name="fade-up">
                <div v-if="showContent">
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
                        <Sparkles class="w-4 h-4" />
                        Order confirmed
                    </span>
                </div>
            </transition>

            <transition name="fade-up" appear>
                <div v-if="showContent">
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-elegant font-bold text-ink mb-4">Thank you for your order!</h1>
                    <p class="text-lg text-neutral-500 font-light max-w-md mx-auto">
                        Your order <span class="font-bold text-ink tabular-nums">#ALIE-2024-0218</span> has been placed successfully.
                    </p>
                </div>
            </transition>

            <!-- Order Details Card -->
            <transition name="fade-up">
                <div v-if="showContent" class="bg-paper border border-neutral-200 rounded-3xl p-5 sm:p-6 mt-8 sm:mt-10 text-left space-y-4 sm:space-y-5">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Order details</span>
                        <button class="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-accent transition-colors">
                            <Download class="w-3.5 h-3.5" />
                            Receipt
                        </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div class="flex items-start gap-3">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                                <Package class="w-4 h-4 text-ink" />
                            </div>
                            <div>
                                <p class="text-xs text-neutral-500">Items</p>
                                <p class="text-sm font-bold text-ink tabular-nums">3 products</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                                <Truck class="w-4 h-4 text-ink" />
                            </div>
                            <div>
                                <p class="text-xs text-neutral-500">Estimated arrival</p>
                                <p class="text-sm font-bold text-ink">Mar 28 - Apr 02</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                                <Calendar class="w-4 h-4 text-ink" />
                            </div>
                            <div>
                                <p class="text-xs text-neutral-500">Total paid</p>
                                <p class="text-sm font-bold text-accent tabular-nums">{{ '$' }}{{ countUp.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-neutral-200 pt-4 flex items-center gap-3">
                        <Mail class="w-4 h-4 text-neutral-400 shrink-0" />
                        <p class="text-sm text-neutral-600">
                            A confirmation email is on its way to <span class="font-bold text-ink">you@example.com</span>.
                        </p>
                    </div>
                </div>
            </transition>

            <!-- Action Buttons -->
            <transition name="fade-up">
                <div v-if="showContent" class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <RouterLink to="/product" class="btn-accent shine-effect">
                        Continue shopping
                        <ArrowRight class="w-4 h-4" />
                    </RouterLink>
                    <RouterLink to="/track-order" class="btn-outline">
                        Track this order
                    </RouterLink>
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
/* Staggered entrance animations */
.fade-up-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-up-leave-active {
    transition: all 0.2s ease;
}
.fade-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
}
.fade-up-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-up-scale-enter-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-up-scale-enter-from {
    opacity: 0;
    transform: scale(0.5);
}

/* Confetti falling animation */
@keyframes confetti-fall {
    0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}
.animate-confetti {
    animation: confetti-fall linear forwards;
}
</style>
