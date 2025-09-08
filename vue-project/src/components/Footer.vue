<script setup>

const currentDate = new Date();
const Year = currentDate.getFullYear(); 
console.log(Year);

//link Facebook & Instagram
const facebookLInk = "https://www.facebook.com";
const instagramLInk = "https://www.instagram.com";

</script>

<template>
    <footer class="bg-gray-900 text-white py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- About Section -->
                <div>
                <h3 class="text-xl font-bold mb-4">About Us</h3>
                <p class="text-gray-400">
                    Our Products in the best quality and affordable price. We are committed to providing the best service to our customers.
                </p>
                </div>
                <!-- Quick Links -->
                <div>
                <h3 class="text-xl font-bold mb-4">Quick Links</h3>
                <ul class="space-y-2" @click="handleScroll">
                    <li>
                        <router-link to="/" class="text-gray-400 hover:text-white transition hover:border-b-2 ">
                            Home
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/Allproduct" class="text-gray-400 hover:text-white transition hover:border-b-2 ">
                            Shop
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/about" class="text-gray-400 hover:text-white transition hover:border-b-2">
                            About Us
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/contact" class="text-gray-400 hover:text-white transition hover:border-b-2 ">
                            Contact
                        </router-link>
                    </li>
                </ul>
                </div>
                <!-- Contact Info -->
                <div>
                    <h3 class="text-xl font-bold mb-4">Contact Us</h3>
                    <ul class="text-gray-400 space-y-2">
                        <li class="flex items-center space-x-2 ml-2">
                            <a :href="facebookLInk" target="_blank" rel="noopener noreferrer"
                                class="hover:text-white transition duration-300 cursor-pointer"
                                aria-label="Visit our Facebook page">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    class="float-left mr-2">
                                        <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                                        <path stroke-dasharray="24" stroke-dashoffset="24" d="M17 4l-2 0c-2.5 0 -4 1.5 -4 4v12">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/>
                                        </path>
                                        <path stroke-dasharray="8" stroke-dashoffset="8" d="M8 12h7">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="8;0"/>
                                        </path>
                                        </g>
                                </svg>
                                Facebook
                            </a>
                        </li>
                        <li class="flex items-center space-x-2 ml-2 ">
                            <a :href="instagramLInk" target="_blank" rel="noopener noreferrer"
                                class="hover:text-white transition duration-300 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    class="float-left mr-2">
                                    <circle cx="17" cy="7" r="1.5" fill="#fff" fill-opacity="0">
                                        <animate fill="freeze" attributeName="fill-opacity" begin="1.3s" dur="0.15s" values="0;1"/>
                                    </circle>
                                    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                        <path stroke-dasharray="72" stroke-dashoffset="72"
                                            d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/>
                                        </path>
                                        <path stroke-dasharray="28" stroke-dashoffset="28"
                                            d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.6s" values="28;0"/>
                                        </path>
                                    </g>
                                </svg>
                                Instagram
                            </a>
                        </li>
                        <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            class="float-left ml-2 mr-2">
                            <path fill="#fff" fill-opacity="0" stroke="#fff" stroke-dasharray="64" stroke-dashoffset="64"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z">
                                <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1"/>
                                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/>
                            </path>
                        </svg>
                        +855 123 456 789
                        </li>
                        <li class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                class="float-left ml-2 mr-2">
                                <path fill="#fff"
                                    d="M12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7m0 2a5 5 0 0 0-5 5c0 1 0 3 5 9.71C17 12 17 10 17 9a5 5 0 0 0-5-5"/>
                            </svg>
                        123 St, Phnom Penh, Cambodia
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Copyright -->
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                &copy; {{ Year }} ShopCloth. All rights reserved.
            </div>
        </div>
    </footer>
</template>
