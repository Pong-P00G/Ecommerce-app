<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { authAPI } from '../../api/authApi';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    UserPlus
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const step = ref(1);

const formData = ref({
    username: '',
    first_name: '',
    mid_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 2 // Default to customer role
});

const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreedToTerms = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

// Username checking
const usernameChecking = ref(false);
const usernameAvailable = ref(null);

// ✅ NEW: Email checking
const emailChecking = ref(false);
const emailAvailable = ref(null);

const passwordStrength = ref(0);

const nextStep = () => {
    // Validate Step 1 before proceeding
    if (!formData.value.first_name || !formData.value.last_name) {
        error.value = 'Please fill in all required fields';
        return;
    }

    if (formData.value.username.length < 4) {
        error.value = 'Username must be at least 4 characters';
        return;
    }

    if (usernameAvailable.value === false) {
        error.value = 'Please choose an available username';
        return;
    }

    step.value = 2;
    error.value = '';
};

const prevStep = () => {
    step.value = 1;
    error.value = '';
};

// ✅ UPDATED: Use authAPI instead of axios
const checkUsernameAvailability = async () => {
    if (formData.value.username.length < 4) {
        usernameAvailable.value = null;
        return;
    }

    usernameChecking.value = true;

    try {
        const response = await authAPI.checkUsername(formData.value.username);
        usernameAvailable.value = response.available;
    } catch (err) {
        console.error('Error checking username:', err);
        usernameAvailable.value = null;
    } finally {
        usernameChecking.value = false;
    }
};

// ✅ NEW: Check email availability
const checkEmailAvailability = async () => {
    if (!formData.value.email) {
        emailAvailable.value = null;
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
        emailAvailable.value = null;
        return;
    }

    emailChecking.value = true;

    try {
        const response = await authAPI.checkEmail(formData.value.email);
        emailAvailable.value = response.available;
    } catch (err) {
        console.error('Error checking email:', err);
        emailAvailable.value = null;
    } finally {
        emailChecking.value = false;
    }
};

const calculatePasswordStrength = () => {
    const password = formData.value.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;

    passwordStrength.value = strength;
};

const getPasswordStrengthLabel = computed(() => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[passwordStrength.value] || 'None';
});

const getPasswordStrengthColor = computed(() => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    return colors[passwordStrength.value] || 'bg-gray-300';
});

const handleSubmit = async () => {
    // Clear previous errors
    error.value = '';
    success.value = '';

    // Validate email availability
    if (emailAvailable.value === false) {
        error.value = 'This email is already registered';
        return;
    }

    // Validate passwords match
    if (formData.value.password !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        return;
    }

    // Validate password length
    if (formData.value.password.length < 8) {
        error.value = 'Password must be at least 8 characters';
        return;
    }

    // Validate terms agreement
    if (!agreedToTerms.value) {
        error.value = 'You must agree to the Terms of Service and Privacy Policy';
        return;
    }

    loading.value = true;
    authStore.clearError();

    try {
        const result = await authStore.register(formData.value);

        if (result.success) {
            success.value = 'Registration successful! Redirecting...';
            setTimeout(() => {
                // Redirect based on role_id (1 = Admin, 2 = User)
                if (authStore.user.role_id === 1) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/');
                }
            }, 1000);
        } else {
            error.value = result.error || 'Registration failed. Please try again.';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'An unexpected error occurred';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-[#f9fafb] relative flex items-center justify-center px-4 py-8">
        <!-- Dotted background -->
        <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[18px_18px]"></div>

        <div class="relative w-full max-w-2xl">
            <!-- Header -->
            <div class="text-center mb-8">
                <div
                    class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
                    <UserPlus class="h-7 w-7" />
                </div>
                <h1 class="text-2xl font-semibold text-gray-900">Create Your Account</h1>
                <p class="mt-1 text-sm text-gray-500">
                    Join our exclusive community today
                </p>
            </div>

            <!-- Card -->
            <div class="rounded-2xl bg-white p-8 shadow-lg">
                <!-- Progress Indicator -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2 flex-1">
                            <div :class="step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
                                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300">
                                1
                            </div>
                            <div :class="step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'"
                                class="h-1 flex-1 transition-all duration-300 rounded-full"></div>
                            <div :class="step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
                                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300">
                                2
                            </div>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 font-medium">
                        Step {{ step }} of 2 - {{ step === 1 ? 'Personal Information' : 'Account Security' }}
                    </p>
                </div>

                <!-- Error Message -->
                <div v-if="error"
                    class="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 animate-shake">
                    <AlertCircle class="h-5 w-5 shrink-0" />
                    {{ error }}
                </div>

                <!-- Success Message -->
                <div v-if="success"
                    class="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                    <CheckCircle2 class="h-5 w-5 shrink-0" />
                    {{ success }}
                </div>

                <!-- Registration Form -->
                <form @submit.prevent="handleSubmit">
                    <!-- Step 1: Personal Information -->
                    <div v-if="step === 1" class="space-y-6 animate-fade-in">
                        <!-- Name Fields -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    First Name *
                                </p>
                                <div class="relative">
                                    <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="text" v-model="formData.first_name" required placeholder="John"
                                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Last Name *
                                </p>
                                <div class="relative">
                                    <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="text" v-model="formData.last_name" required placeholder="Doe"
                                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <!-- Middle Name -->
                        <div>
                            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Middle Name (Optional)
                            </p>
                            <div class="relative">
                                <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" v-model="formData.mid_name" placeholder="Middle name"
                                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                            </div>
                        </div>

                        <!-- Username -->
                        <div>
                            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Username *
                            </p>
                            <div class="relative">
                                <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" v-model="formData.username" required minlength="4"
                                    placeholder="johndoe (minimum 4 characters)" @input="checkUsernameAvailability"
                                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                            </div>
                            <p v-if="usernameChecking" class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
                                <Loader2 class="h-3.5 w-3.5 animate-spin" /> Checking availability...
                            </p>
                            <p v-if="usernameAvailable === true"
                                class="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1">
                                <CheckCircle2 class="h-3.5 w-3.5" /> Username available
                            </p>
                            <p v-if="usernameAvailable === false"
                                class="text-xs text-red-600 mt-2 ml-1 flex items-center gap-1">
                                <AlertCircle class="h-3.5 w-3.5" /> Username already taken
                            </p>
                        </div>

                        <!-- Next Button -->
                        <button type="button" @click="nextStep"
                            :disabled="!formData.first_name || !formData.last_name || formData.username.length < 4 || usernameAvailable === false"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 mt-8 disabled:opacity-50 disabled:cursor-not-allowed">
                            Continue
                            <ArrowRight class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Step 2: Account Security -->
                    <div v-if="step === 2" class="space-y-6 animate-fade-in">
                        <!-- Email -->
                        <div>
                            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Email Address *
                            </p>
                            <div class="relative">
                                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="email" v-model="formData.email" required placeholder="you@example.com"
                                    @blur="checkEmailAvailability"
                                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                            </div>
                            <!-- ✅ NEW: Email availability feedback -->
                            <p v-if="emailChecking" class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
                                <Loader2 class="h-3.5 w-3.5 animate-spin" /> Checking availability...
                            </p>
                            <p v-if="emailAvailable === true"
                                class="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1">
                                <CheckCircle2 class="h-3.5 w-3.5" /> Email available
                            </p>
                            <p v-if="emailAvailable === false"
                                class="text-xs text-red-600 mt-2 ml-1 flex items-center gap-1">
                                <AlertCircle class="h-3.5 w-3.5" /> Email already registered
                            </p>
                        </div>

                        <!-- Password -->
                        <div>
                            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Password *
                            </p>
                            <div class="relative">
                                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" required
                                    minlength="8" placeholder="Minimum 8 characters" @input="calculatePasswordStrength"
                                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
                                </button>
                            </div>

                            <!-- Password Strength -->
                            <div class="mt-3 space-y-2">
                                <div class="flex gap-1">
                                    <div v-for="i in 4" :key="i"
                                        class="h-1.5 flex-1 rounded-full transition-all duration-300"
                                        :class="passwordStrength >= i ? getPasswordStrengthColor : 'bg-gray-200'">
                                    </div>
                                </div>
                                <p class="text-xs text-gray-600">
                                    Strength: <span
                                        :class="passwordStrength > 2 ? 'text-green-600' : passwordStrength > 0 ? 'text-yellow-600' : 'text-red-600'"
                                        class="font-medium">
                                        {{ getPasswordStrengthLabel }}
                                    </span>
                                </p>
                                <ul class="text-xs text-gray-500 space-y-1.5 mt-3 ml-1">
                                    <li class="flex items-center gap-2"
                                        :class="formData.password.length >= 8 ? 'text-green-600' : ''">
                                        <CheckCircle2 v-if="formData.password.length >= 8" class="h-3.5 w-3.5" />
                                        <div v-else class="h-3.5 w-3.5 rounded-full border-2 border-gray-300"></div>
                                        At least 8 characters
                                    </li>
                                    <li class="flex items-center gap-2"
                                        :class="/[A-Z]/.test(formData.password) ? 'text-green-600' : ''">
                                        <CheckCircle2 v-if="/[A-Z]/.test(formData.password)" class="h-3.5 w-3.5" />
                                        <div v-else class="h-3.5 w-3.5 rounded-full border-2 border-gray-300"></div>
                                        One uppercase letter
                                    </li>
                                    <li class="flex items-center gap-2"
                                        :class="/[0-9]/.test(formData.password) ? 'text-green-600' : ''">
                                        <CheckCircle2 v-if="/[0-9]/.test(formData.password)" class="h-3.5 w-3.5" />
                                        <div v-else class="h-3.5 w-3.5 rounded-full border-2 border-gray-300"></div>
                                        One number
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Confirm Password *
                            </p>
                            <div class="relative">
                                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                                    required placeholder="Re-enter your password"
                                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <component :is="showConfirmPassword ? EyeOff : Eye" class="h-5 w-5" />
                                </button>
                            </div>
                            <p v-if="confirmPassword && confirmPassword !== formData.password"
                                class="text-xs text-red-600 mt-2 ml-1 flex items-center gap-1">
                                <AlertCircle class="h-3.5 w-3.5" /> Passwords do not match
                            </p>
                            <p v-if="confirmPassword && confirmPassword === formData.password"
                                class="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1">
                                <CheckCircle2 class="h-3.5 w-3.5" /> Passwords match
                            </p>
                        </div>

                        <!-- Terms & Conditions -->
                        <div class="pt-2">
                            <label class="flex items-start cursor-pointer group">
                                <div class="relative mt-0.5">
                                    <input type="checkbox" v-model="agreedToTerms" required class="peer sr-only" />
                                    <div
                                        class="w-5 h-5 border-2 border-gray-200 rounded-lg group-hover:border-indigo-400 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200">
                                    </div>
                                    <div
                                        class="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform duration-200">
                                        <CheckCircle2 class="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <span class="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    I agree to the
                                    <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Terms of
                                        Service</a>
                                    and
                                    <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Privacy
                                        Policy</a>
                                </span>
                            </label>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-4 pt-4">
                            <button type="button" @click="prevStep"
                                class="flex-1 rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                Back
                            </button>

                            <button type="submit"
                                :disabled="loading || !agreedToTerms || confirmPassword !== formData.password || emailAvailable === false"
                                class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
                                <span v-else class="flex items-center gap-2">
                                    Create Account
                                    <ArrowRight class="h-4 w-4" />
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <p class="mt-6 text-center text-sm font-bold text-gray-500">
                Already have an account?
                <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-700">
                    Sign In
                </router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-4px);
    }

    75% {
        transform: translateX(4px);
    }
}

.animate-shake {
    animation: shake 0.4s ease-in-out 0s 2;
}

.bg-size-\[18px_18px\] {
    background-size: 18px 18px;
}
</style>