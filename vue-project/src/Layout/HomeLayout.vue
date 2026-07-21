<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import NewsletterPopup from '../components/NewsletterPopup.vue'
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <Navbar />
        <main class="flex-1 pt-20" role="main">
            <div class="min-h-screen bg-paper">
                <router-view />
            </div>
        </main>
        <Footer />
        <NewsletterPopup />
    </div>
</template>
