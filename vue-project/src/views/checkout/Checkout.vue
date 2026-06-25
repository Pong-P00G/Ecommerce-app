<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Steps
const steps = ['Shipping', 'Delivery', 'Payment'];
const currentStep = ref(1);

// User state
const isLoggedIn = computed(() => authStore.isAuthenticated);
const savedAddresses = ref([]);
const showAddressBook = ref(false);

// Shipping Info
const shippingInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
});
const saveAddress = ref(false);

// Shipping Methods
const shippingMethods = ref([
  { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 0 },
  { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 15 },
  { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', price: 30 }
]);
const selectedShipping = ref('standard');

// Payment Methods
const paymentMethods = ref([
  { 
      id: 'card', 
      name: 'Credit/Debit Card',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  },
  { 
      id: 'paypal', 
      name: 'PayPal',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  }
]);
const selectedPayment = ref('card');

const paymentInfo = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardName: ''
});

// Cart Items (mock data)
const cartItems = ref([
  { 
      id: 1, 
      name: 'Modern Floor Lamp', 
      price: 89.99, 
      quantity: 1,
      image: 'https://via.placeholder.com/80'
  },
  { 
      id: 2, 
      name: 'Decorative Cushion Set', 
      price: 45.00, 
      quantity: 2,
      image: 'https://via.placeholder.com/80'
  }
]);

// Promo Code
const promoCode = ref('');
const promoApplied = ref(false);
const discount = ref(0);

// Processing
const processing = ref(false);

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shippingCost = computed(() => {
  const method = shippingMethods.value.find(m => m.id === selectedShipping.value);
  return method ? method.price : 0;
});

const tax = computed(() => {
  return (subtotal.value + shippingCost.value - discount.value) * 0.08; // 8% tax
});

const orderTotal = computed(() => {
  return subtotal.value + shippingCost.value + tax.value - discount.value;
});

// Methods
const goToStep = (step) => {
  currentStep.value = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const applyPromo = () => {
  if (promoCode.value.toUpperCase() === 'SAVE10') {
      discount.value = subtotal.value * 0.1;
      promoApplied.value = true;
  }
};

const handleSubmit = async () => {
  processing.value = true;
  
  // Simulate API call
  setTimeout(() => {
      processing.value = false;
      // Redirect to success page
      router.push('/orderSucces');
  }, 2000);
};
</script>


<template>
  <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header -->
          <div class="mb-8 mt-16">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p class="text-gray-600">Complete your purchase</p>
          </div>
          <!-- Progress Steps -->
          <div class="mb-8">
              <div class="flex items-center justify-between">
                  <div 
                      v-for="(step, index) in steps" 
                      :key="index"
                      class="flex items-center"
                      :class="{ 'flex-1': index < steps.length - 1 }"
                  >
                      <!-- Step Circle -->
                      <div class="flex flex-col items-center">
                          <div 
                              :class="{
                                  'bg-gray-900 text-white': currentStep >= index + 1,
                                  'bg-white text-gray-400 border-2 border-gray-300': currentStep < index + 1
                              }"
                              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all"
                          >
                              <svg v-if="currentStep > index + 1" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                              <span v-else>{{ index + 1 }}</span>
                          </div>
                          <span 
                              :class="{
                                  'text-gray-900 font-medium': currentStep >= index + 1,
                                  'text-gray-400': currentStep < index + 1
                              }"
                              class="text-sm hidden sm:block"
                          >
                              {{ step }}
                          </span>
                      </div>

                      <!-- Connector Line -->
                      <div 
                          v-if="index < steps.length - 1"
                          :class="{
                              'bg-gray-900': currentStep > index + 1,
                              'bg-gray-300': currentStep <= index + 1
                          }"
                          class="flex-1 h-1 mx-4 transition-all"
                      ></div>
                  </div>
              </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left Column - Forms -->
              <div class="lg:col-span-2 space-y-6">
                  <!-- Step 1: Shipping Information -->
                  <div v-if="currentStep === 1" class="bg-white rounded-2xl shadow-sm p-6">
                      <div class="flex items-center justify-between mb-6">
                          <h2 class="text-xl font-semibold text-gray-900">Shipping Information</h2>
                          <button 
                              v-if="isLoggedIn && savedAddresses.length > 0"
                              @click="showAddressBook = true"
                              class="text-sm text-gray-600 hover:text-gray-900"
                          >
                              Use saved address
                          </button>
                      </div>

                      <form @submit.prevent="goToStep(2)" class="space-y-4">
                          <!-- Full Name -->
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                  <input 
                                      v-model="shippingInfo.firstName"
                                      type="text" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="John"
                                  />
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                  <input 
                                      v-model="shippingInfo.lastName"
                                      type="text" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="Doe"
                                  />
                              </div>
                          </div>

                          <!-- Email & Phone -->
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                  <input 
                                      v-model="shippingInfo.email"
                                      type="email" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="john@example.com"
                                  />
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                  <input 
                                      v-model="shippingInfo.phone"
                                      type="tel" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="+1 (555) 000-0000"
                                  />
                              </div>
                          </div>

                          <!-- Address -->
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                              <input 
                                  v-model="shippingInfo.address"
                                  type="text" 
                                  required
                                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  placeholder="123 Main Street"
                              />
                          </div>

                          <!-- City, State, Zip -->
                          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                  <input 
                                      v-model="shippingInfo.city"
                                      type="text" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="New York"
                                  />
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                  <input 
                                      v-model="shippingInfo.state"
                                      type="text" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="NY"
                                  />
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                                  <input 
                                      v-model="shippingInfo.zipCode"
                                      type="text" 
                                      required
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="10001"
                                  />
                              </div>
                          </div>

                          <!-- Country -->
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                              <select 
                                  v-model="shippingInfo.country"
                                  required
                                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                              >
                                  <option value="">Select Country</option>
                                  <option value="US">United States</option>
                                  <option value="CA">Canada</option>
                                  <option value="UK">United Kingdom</option>
                                  <option value="AU">Australia</option>
                              </select>
                          </div>

                          <!-- Save Address -->
                          <div v-if="isLoggedIn" class="flex items-center">
                              <input 
                                  v-model="saveAddress"
                                  type="checkbox" 
                                  id="saveAddress"
                                  class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
                              />
                              <label for="saveAddress" class="ml-2 text-sm text-gray-700">
                                  Save this address for future orders
                              </label>
                          </div>

                          <button 
                              type="submit"
                              class="w-full py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                          >
                              Continue to Shipping Method
                          </button>
                      </form>
                  </div>

                  <!-- Step 2: Shipping Method -->
                  <div v-if="currentStep === 2" class="bg-white rounded-2xl shadow-sm p-6">
                      <h2 class="text-xl font-semibold text-gray-900 mb-6">Shipping Method</h2>

                      <div class="space-y-3">
                          <label 
                              v-for="method in shippingMethods" 
                              :key="method.id"
                              class="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all"
                              :class="{
                                  'border-gray-900 bg-gray-50': selectedShipping === method.id,
                                  'border-gray-200 hover:border-gray-300': selectedShipping !== method.id
                              }"
                          >
                              <div class="flex items-center gap-4">
                                  <input 
                                      v-model="selectedShipping"
                                      type="radio" 
                                      :value="method.id"
                                      class="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-400"
                                  />
                                  <div>
                                      <div class="font-medium text-gray-900">{{ method.name }}</div>
                                      <div class="text-sm text-gray-500">{{ method.description }}</div>
                                  </div>
                              </div>
                              <div class="font-semibold text-gray-900">
                                  {{ method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}` }}
                              </div>
                          </label>
                      </div>

                      <div class="flex gap-4 mt-6">
                          <button 
                              @click="goToStep(1)"
                              class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                              Back
                          </button>
                          <button 
                              @click="goToStep(3)"
                              :disabled="!selectedShipping"
                              class="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Continue to Payment
                          </button>
                      </div>
                  </div>

                  <!-- Step 3: Payment -->
                  <div v-if="currentStep === 3" class="bg-white rounded-2xl shadow-sm p-6">
                      <h2 class="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>

                      <!-- Payment Method Selection -->
                      <div class="space-y-3 mb-6">
                          <label 
                              v-for="method in paymentMethods" 
                              :key="method.id"
                              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                              :class="{
                                  'border-gray-900 bg-gray-50': selectedPayment === method.id,
                                  'border-gray-200 hover:border-gray-300': selectedPayment !== method.id
                              }"
                          >
                              <input 
                                  v-model="selectedPayment"
                                  type="radio" 
                                  :value="method.id"
                                  class="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-400"
                              />
                              <div class="ml-4 flex items-center gap-3">
                                  <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path :d="method.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                  </svg>
                                  <span class="font-medium text-gray-900">{{ method.name }}</span>
                              </div>
                          </label>
                      </div>

                      <!-- Credit Card Form -->
                      <form v-if="selectedPayment === 'card'" @submit.prevent="handleSubmit" class="space-y-4">
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                              <input 
                                  v-model="paymentInfo.cardNumber"
                                  type="text" 
                                  required
                                  maxlength="19"
                                  placeholder="1234 5678 9012 3456"
                                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                              />
                          </div>

                          <div class="grid grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                                  <input 
                                      v-model="paymentInfo.expiry"
                                      type="text" 
                                      required
                                      placeholder="MM/YY"
                                      maxlength="5"
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                                  <input 
                                      v-model="paymentInfo.cvv"
                                      type="text" 
                                      required
                                      maxlength="4"
                                      placeholder="123"
                                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                              </div>
                          </div>

                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                              <input 
                                  v-model="paymentInfo.cardName"
                                  type="text" 
                                  required
                                  placeholder="John Doe"
                                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                              />
                          </div>

                          <div class="flex gap-4 mt-6">
                              <button 
                                  type="button"
                                  @click="goToStep(2)"
                                  class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                              >
                                  Back
                              </button>
                              <button 
                                  type="submit"
                                  :disabled="processing"
                                  class="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  {{ processing ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}` }}
                              </button>
                          </div>
                      </form>

                      <!-- PayPal/Other Methods -->
                      <div v-else class="space-y-4">
                          <p class="text-sm text-gray-600">You will be redirected to complete your payment securely.</p>
                          
                          <div class="flex gap-4">
                              <button 
                                  @click="goToStep(2)"
                                  class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                              >
                                  Back
                              </button>
                              <button 
                                  @click="handleSubmit"
                                  :disabled="processing"
                                  class="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                              >
                                  {{ processing ? 'Processing...' : 'Continue to Payment' }}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Right Column - Order Summary -->
              <div class="lg:col-span-1">
                  <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                      <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                      <!-- Cart Items -->
                      <div class="space-y-4 mb-6">
                          <div 
                              v-for="item in cartItems" 
                              :key="item.id"
                              class="flex gap-4"
                          >
                              <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                  <img 
                                      :src="item.image" 
                                      :alt="item.name"
                                      class="w-full h-full object-cover"
                                  />
                              </div>
                              <div class="flex-1 min-w-0">
                                  <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
                                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                                  <p class="text-sm font-semibold text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                              </div>
                          </div>
                      </div>

                      <!-- Promo Code -->
                      <div class="mb-6">
                          <div class="flex gap-2">
                              <input 
                                  v-model="promoCode"
                                  type="text" 
                                  placeholder="Promo code"
                                  class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                              />
                              <button 
                                  @click="applyPromo"
                                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              >
                                  Apply
                              </button>
                          </div>
                          <p v-if="promoApplied" class="text-sm text-green-600 mt-2">✓ Promo code applied!</p>
                      </div>

                      <!-- Price Breakdown -->
                      <div class="space-y-3 py-4 border-t border-gray-200">
                          <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Subtotal</span>
                              <span class="font-medium text-gray-900">${{ subtotal.toFixed(2) }}</span>
                          </div>
                          <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Shipping</span>
                              <span class="font-medium text-gray-900">
                                  {{ shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}` }}
                              </span>
                          </div>
                          <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
                              <span>Discount</span>
                              <span>-${{ discount.toFixed(2) }}</span>
                          </div>
                          <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Tax</span>
                              <span class="font-medium text-gray-900">${{ tax.toFixed(2) }}</span>
                          </div>
                      </div>

                      <!-- Total -->
                      <div class="flex justify-between items-center pt-4 border-t-2 border-gray-900">
                          <span class="text-lg font-semibold text-gray-900">Total</span>
                          <span class="text-2xl font-bold text-gray-900">${{ orderTotal.toFixed(2) }}</span>
                      </div>

                      <!-- Security Badge -->
                      <div class="mt-6 p-3 bg-gray-50 rounded-lg">
                          <div class="flex items-center gap-2 text-sm text-gray-600">
                              <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                              </svg>
                              <span>Secure checkout powered by Stripe</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>