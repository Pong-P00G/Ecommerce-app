<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {CreditCard, Lock, Shield, CheckCircle} from 'lucide-vue-next';

const router = useRouter();

// Form fields
const cardNumber = ref('');
const expiryDate = ref('');
const cvv = ref('');
const cardholderName = ref('');
const billingAddress = ref('');
const zipCode = ref('');
const errorMessage = ref('');
const totalPrice = ref('');
const isProcessing = ref(false);

// Retrieve total price from localStorage
onMounted(() => {
  totalPrice.value = JSON.parse(localStorage.getItem('totalPrice')) || '0.00';
});

// Format card number with spaces
const formattedCardNumber = computed({
  get: () => cardNumber.value,
  set: (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    cardNumber.value = formatted.substring(0, 19);
  }
});

// Detect card type
const cardType = computed(() => {
  const number = cardNumber.value.replace(/\s/g, '');
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
  if (number.startsWith('3')) return 'amex';
  return 'unknown';
});

// Format expiry date
const formattedExpiryDate = computed({
  get: () => expiryDate.value,
  set: (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      expiryDate.value = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    } else {
      expiryDate.value = cleaned;
    }
  }
});

// Validate form
const validateForm = () => {
  if (!cardNumber.value || !expiryDate.value || !cvv.value || !cardholderName.value || !billingAddress.value) {
    errorMessage.value = 'Please fill out all fields.';
    return false;
  }
  if (cardNumber.value.replace(/\s/g, '').length !== 16) {
    errorMessage.value = 'Card number must be 16 digits.';
    return false;
  }
  if (!/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
    errorMessage.value = 'Expiry date must be in MM/YY format.';
    return false;
  }
  if (cvv.value.length !== 3) {
    errorMessage.value = 'CVV must be 3 digits.';
    return false;
  }
  errorMessage.value = '';
  return true;
};

// Handle payment submission
const handlePayment = async () => {
  if (!validateForm()) return;

  isProcessing.value = true;

  // Simulate payment processing with delay
  setTimeout(() => {
    console.log('Processing payment...', {
      cardNumber: cardNumber.value,
      expiryDate: expiryDate.value,
      cvv: cvv.value,
      cardholderName: cardholderName.value,
      totalPrice: totalPrice.value
    });
    isProcessing.value = false;
    router.push('/orderSucces');
  }, 3000);
};
</script>

<template>
  <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-10 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
          class="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl animate-pulse"></div>
      <div
          class="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
          <CreditCard class="w-8 h-8 text-white"/>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Secure Payment
        </h1>
        <p class="text-gray-400">Complete your purchase securely</p>
      </div>

      <div class="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
        <!-- Payment Form -->
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
          <!-- Total Price -->
          <div
              class="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Total Amount</span>
              <span
                  class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ${{ totalPrice }}
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage"
               class="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-300 rounded-lg backdrop-blur-sm animate-shake">
            {{ errorMessage }}
          </div>

          <!-- Payment Form -->
          <form @submit.prevent="handlePayment" class="space-y-6">
            <!-- Card Number -->
            <div class="group">
              <label for="card-number"
                     class="block text-sm font-medium text-purple-300 mb-2 group-focus-within:text-purple-200 transition-colors">
                Card Number
              </label>
              <div class="relative">
                <input
                    type="text"
                    id="card-number"
                    v-model="formattedCardNumber"
                    placeholder="0000 0000 0000 0000"
                    maxlength="19"
                    class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/15"
                />
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div v-if="cardType === 'visa'"
                       class="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div v-else-if="cardType === 'mastercard'"
                       class="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div v-else-if="cardType === 'amex'"
                       class="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    AMEX
                  </div>
                </div>
              </div>
            </div>

            <!-- Expiry Date and CVV -->
            <div class="grid grid-cols-2 gap-4">
              <div class="group">
                <label for="expiry-date"
                       class="block text-sm font-medium text-purple-300 mb-2 group-focus-within:text-purple-200 transition-colors">
                  Expiry Date
                </label>
                <input
                    type="text"
                    id="expiry-date"
                    v-model="formattedExpiryDate"
                    placeholder="MM/YY"
                    maxlength="5"
                    class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/15"
                />
              </div>
              <div class="group">
                <label for="cvv"
                       class="block text-sm font-medium text-purple-300 mb-2 group-focus-within:text-purple-200 transition-colors">
                  CVV
                </label>
                <div class="relative">
                  <input
                      type="password"
                      id="cvv"
                      v-model="cvv"
                      placeholder="123"
                      maxlength="3"
                      class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/15"
                  />
                  <Shield class="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
                </div>
              </div>
            </div>

            <!-- Cardholder Name -->
            <div class="group">
              <label for="cardholder-name"
                     class="block text-sm font-medium text-purple-300 mb-2 group-focus-within:text-purple-200 transition-colors">
                Cardholder Name
              </label>
              <input
                  type="text"
                  id="cardholder-name"
                  v-model="cardholderName"
                  placeholder="John Doe"
                  class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/15"
              />
            </div>

            <!-- Billing Address -->
            <div class="group">
              <label for="billing-address"
                     class="block text-sm font-medium text-purple-300 mb-2 group-focus-within:text-purple-200 transition-colors">
                Billing Address
              </label>
              <input
                  type="text"
                  id="billing-address"
                  v-model="billingAddress"
                  placeholder="123 Main Street, City, State 12345"
                  class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/15"
              />
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="isProcessing"
                class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span v-if="!isProcessing">
                <Lock class="w-5 h-5 inline mr-2"/>
                Pay Securely
              </span>
              <span v-else class="flex items-center">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Processing Payment...
              </span>
            </button>
          </form>
        </div>

        <!-- Security Features -->
        <div class="space-y-6">
          <!-- Security Badge -->
          <div class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Shield class="w-5 h-5 text-green-400"/>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Secure Payment</h3>
                <p class="text-gray-400 text-sm">256-bit SSL encryption</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <CheckCircle class="w-4 h-4 text-green-400"/>
                <span class="text-gray-300 text-sm">PCI DSS Compliant</span>
              </div>
              <div class="flex items-center space-x-2">
                <CheckCircle class="w-4 h-4 text-green-400"/>
                <span class="text-gray-300 text-sm">Bank-level Security</span>
              </div>
              <div class="flex items-center space-x-2">
                <CheckCircle class="w-4 h-4 text-green-400"/>
                <span class="text-gray-300 text-sm">Fraud Protection</span>
              </div>
            </div>
          </div>
          <!-- Accepted Cards -->
          <div class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10">
            <h3 class="text-lg font-semibold text-white mb-4">Accepted Payment Methods</h3>
            <div class="grid grid-cols-4 gap-3">
              <div class="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                <div
                    class="w-full h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                <div
                    class="w-full h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                <div
                    class="w-full h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                <div
                    class="w-full h-6 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  DISC
                </div>
              </div>
            </div>
          </div>
          <!-- Money Back Guarantee -->
          <div
              class="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-green-400/30">
            <div class="text-center">
              <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle class="w-6 h-6 text-green-400"/>
              </div>
              <h3 class="text-lg font-semibold text-white mb-2">Money Back Guarantee</h3>
              <p class="text-gray-300 text-sm">100% secure transactions with full refund protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.3);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>