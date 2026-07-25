<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import {
      Mail,
      ArrowRight,
      Loader2,
      AlertCircle,
      CheckCircle2,
      KeyRound,
      ArrowLeft
    } from 'lucide-vue-next';
    
    const router = useRouter();
    
    const step = ref(1); // 1: email input, 2: success message
    const email = ref('');
    const loading = ref(false);
    const error = ref('');
    const success = ref('');
    
    const handleSubmit = async () => {
      error.value = '';
      success.value = '';
      
      if (!email.value) {
        error.value = 'Please enter your email address';
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        error.value = 'Please enter a valid email address';
        return;
      }
      
      loading.value = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real app, call your password reset API here
        // await authAPI.forgotPassword({ email: email.value });
        
        success.value = 'Password reset link sent successfully!';
        step.value = 2;
        
      } catch (err) {
        error.value = err.message || 'Failed to send reset link. Please try again.';
      } finally {
        loading.value = false;
      }
    };
    
    const goBack = () => {
      router.push('/login');
    };
    
    const resendEmail = async () => {
      step.value = 1;
      error.value = '';
      success.value = '';
    };
    </script>
    
    <template>
      <div class="min-h-screen bg-neutral-50 relative flex items-center justify-center px-4">
        <!-- Dotted background -->
        <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[18px_18px]"></div>
        
        <div class="relative w-full max-w-md">
          <!-- Step 1: Email Input -->
          <div v-if="step === 1" class="animate-fade-in">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-ink text-paper shadow">
                <KeyRound class="h-7 w-7" />
              </div>
              <h1 class="text-xl sm:text-2xl font-semibold text-ink">Forgot Password?</h1>
              <p class="mt-1 text-sm text-neutral-500">
                No worries, we'll send you reset instructions
              </p>
            </div>
    
            <!-- Card -->
            <div class="rounded-2xl bg-paper p-8 shadow-lg">
              <!-- Error Message -->
              <div v-if="error" class="mb-6 flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger animate-shake">
                <AlertCircle class="h-5 w-5 shrink-0" />
                {{ error }}
              </div>
    
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Email Input -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Email Address
                  </p>
                  <div class="relative">
                    <Mail class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input 
                      v-model="email" 
                      type="email" 
                      id="forgot-email"
                      name="email"
                      placeholder="you@example.com"
                      @keyup.enter="handleSubmit" aria-label="Email address"
                      class="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-12 py-3 text-sm text-ink placeholder-neutral-400 focus:border-ink focus:ring-2 focus:ring-ink/10 outline-none transition-all"
                    />
                  </div>
                  <p class="mt-2 text-xs text-neutral-500 ml-1">
                    Enter the email address associated with your account
                  </p>
                </div>
    
                <!-- Submit Button -->
                <button 
                  type="submit"
                  :disabled="loading"
                  class="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-paper transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
                  <span v-else class="flex items-center gap-2">
                    Send Reset Link
                    <ArrowRight class="h-4 w-4" />
                  </span>
                </button>
              </form>
            </div>
    
            <!-- Back to Login -->
            <button 
              @click="goBack"
              class="mt-6 w-full flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-ink transition-colors"
            >
              <ArrowLeft class="h-4 w-4" />
              Back to Login
            </button>
          </div>
    
          <!-- Step 2: Success Message -->
          <div v-if="step === 2" class="animate-fade-in">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success text-white shadow">
                <CheckCircle2 class="h-7 w-7" />
              </div>
              <h1 class="text-xl sm:text-2xl font-semibold text-ink">Check Your Email</h1>
              <p class="mt-1 text-sm text-neutral-500">
                We've sent you a password reset link
              </p>
            </div>
    
            <!-- Card -->
            <div class="rounded-2xl bg-paper p-8 shadow-lg">
              <div class="text-center space-y-4">
                <!-- Success Icon -->
                <div class="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Mail class="h-8 w-8 text-success" />
                </div>
    
                <!-- Message -->
                <div class="space-y-2">
                  <p class="text-sm text-neutral-600">
                    We've sent a password reset link to
                  </p>
                  <p class="text-sm font-semibold text-ink">
                    {{ email }}
                  </p>
                </div>
    
                <!-- Instructions -->
                <div class="bg-info/10 rounded-lg p-4 mt-6">
                  <p class="text-xs text-info leading-relaxed">
                    Click the link in the email to reset your password. If you don't see the email, check your spam folder.
                  </p>
                </div>
    
                <!-- Resend Button -->
                <button 
                  @click="resendEmail"
                  class="w-full mt-6 py-3 text-sm font-medium text-accent hover:text-accent-600 transition-colors"
                >
                  Didn't receive the email? Click to resend
                </button>
    
                <!-- Back to Login -->
                <button 
                  @click="goBack"
                  class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all mt-4"
                >
                  <ArrowLeft class="h-4 w-4" />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
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
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    
    .animate-shake {
      animation: shake 0.4s ease-in-out 0s 2;
    }
    
    .bg-size-\[18px_18px\] {
      background-size: 18px 18px;
    }
    </style>