<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, RouterLink } from 'vue-router'
import { Calendar, Clock, User, ArrowLeft, Heart, Share2, BookOpen, ArrowRight, Tag } from 'lucide-vue-next'
import LazyImage from '../../components/LazyImage.vue'

const route = useRoute()

const posts = [
    {
        id: 1,
        title: 'The Ultimate Guide to Building a Capsule Wardrobe',
        excerpt: 'Discover how to curate a timeless wardrobe with versatile pieces that work for every occasion.',
        content: `A capsule wardrobe is a curated collection of essential clothing items that never go out of style. It is about quality over quantity, versatility over trends. Building one is a liberating experience that simplifies your morning routine and elevates your personal style.

## Start with the Basics

The foundation of any capsule wardrobe starts with high-quality basics. Think crisp white shirts, well-fitted dark denim, a tailored blazer, and a little black dress. These pieces should form 70% of your wardrobe — timeless, neutral, and endlessly combinable.

## Choose a Color Palette

Stick to a cohesive color palette of 5-7 colors that work together harmoniously. Neutrals like black, white, navy, beige, and gray form the backbone. Add 2-3 accent colors that complement each other and express your personality.

## Invest in Quality

When building a capsule, prioritize quality over quantity. A well-made wool coat will last a decade; a fast-fashion version might not survive a single season. Look for natural fibers like cotton, wool, linen, and silk, and pay attention to construction details like stitching and finishing.

## The 30-Wear Test

Before adding any piece to your capsule, ask yourself: will I wear this at least 30 times? If the answer is no, it does not belong in your wardrobe. This simple rule eliminates impulse purchases and ensures every item earns its place.

## Seasonal Rotation

A capsule wardrobe evolves with the seasons. Store off-season items away to keep your closet organized and your choices focused. A typical capsule contains 30-40 items per season, including shoes and accessories.

## Sustainability Matters

Beyond simplifying your life, a capsule wardrobe is inherently sustainable. By buying fewer, better things, you reduce waste, support ethical production, and develop a deeper appreciation for what you own.`,
        category: 'guides',
        author: 'Bun Rathanak Pong',
        date: 'June 12, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=800&fit=crop',
        tags: ['wardrobe', 'minimalist', 'style', 'sustainable']
    },
    {
        id: 2,
        title: '5 Sustainable Fashion Brands You Need to Know',
        content: `The fashion industry is undergoing a transformation. As consumers become more conscious of their environmental impact, a new wave of brands is leading the charge toward sustainability. Here are five we love.

## 1. Everlane

Everlane has built its brand on radical transparency. They show you exactly what each product costs to make, from materials to labor to transport. Their commitment to ethical factories and timeless design makes them a staple in any conscious wardrobe.

## 2. Patagonia

The gold standard for sustainable outdoor apparel. Patagonia has been fighting for the planet since 1973, donating 1% of sales to environmental causes and pioneering the use of recycled materials in clothing.

## 3. Reformation

Reformation combines trendy designs with serious sustainability credentials. They track the environmental impact of every garment and use deadstock fabrics, recycled materials, and low-impact dyes to minimize their footprint.

## 4. Veja

Veja sneakers are made from organic cotton sourced from Brazil and Peru, wild rubber from the Amazon rainforest, and recycled plastic bottles. Their supply chain is completely transparent, and they prioritize fair trade partnerships.

## 5. Stella McCartney

A luxury pioneer in sustainable fashion, Stella McCartney has never used leather or fur. Instead, they innovate with bio-based materials, regenerated cashmere, and circular design principles that prioritize recyclability.`,
        category: 'sustainability',
        author: 'Bun Rathanak Pong',
        date: 'June 8, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop',
        tags: ['sustainable', 'ethical', 'brands', 'fashion']
    },
]

const post = computed(() => posts.find(p => p.id === Number(route.params.id)))
const relatedPosts = computed(() => posts.filter(p => p.id !== Number(route.params.id)).slice(0, 3))

const formatContent = (text) => {
    return text.split('\n\n').map(block => {
        if (block.startsWith('## ')) {
            return { type: 'heading', content: block.replace('## ', '') }
        }
        return { type: 'paragraph', content: block }
    })
}

// ── Dynamic SEO ──────────────────────────────────────────────────────────────

useHead({
    title: computed(() => post.value ? `${post.value.title} | AlieeShop` : 'Article | AlieeShop'),
    meta: computed(() => [
        ...(post.value
            ? [
                { name: 'description', content: post.value.excerpt },
                { property: 'og:title', content: `${post.value.title} | AlieeShop` },
                { property: 'og:description', content: post.value.excerpt },
                { property: 'og:type', content: 'article' },
                { property: 'og:image', content: post.value.image },
                { property: 'article:published_time', content: post.value.date },
                { property: 'article:author', content: post.value.author },
                { property: 'article:section', content: post.value.category },
                { name: 'twitter:title', content: `${post.value.title} | AlieeShop` },
                { name: 'twitter:description', content: post.value.excerpt },
                { name: 'twitter:image', content: post.value.image },
            ]
            : [
                { name: 'description', content: 'Read our latest journal entry at AlieeShop.' },
                { property: 'og:title', content: 'Article | AlieeShop' },
                { property: 'og:description', content: 'Read our latest journal entry at AlieeShop.' },
                { name: 'twitter:title', content: 'Article | AlieeShop' },
                { name: 'twitter:description', content: 'Read our latest journal entry at AlieeShop.' },
            ]
        ),
    ]),
    link: computed(() => post.value
        ? [{ rel: 'canonical', href: `https://alieeshop.com/blog/${post.value.id}` }]
        : [{ rel: 'canonical', href: 'https://alieeshop.com/blog' }]
    ),
})
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <div v-if="post" class="max-w-4xl mx-auto">
                <!-- Back link -->
                <RouterLink to="/blog" class="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-ink transition-colors mb-8">
                    <ArrowLeft class="w-4 h-4" />
                    Back to journal
                </RouterLink>

                <!-- Hero Image -->
                <div class="rounded-3xl overflow-hidden bg-neutral-100 mb-8">
                    <LazyImage :src="post.image" :alt="post.title" wrapper-class="w-full h-64 md:h-96" img-class="w-full h-full object-cover" />
                </div>

                <!-- Meta -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-4">
                    <span class="badge-ghost">{{ post.category }}</span>
                    <span class="inline-flex items-center gap-1.5"><Calendar class="w-4 h-4" /> {{ post.date }}</span>
                    <span class="inline-flex items-center gap-1.5"><Clock class="w-4 h-4" /> {{ post.readTime }}</span>
                    <span class="inline-flex items-center gap-1.5"><User class="w-4 h-4" /> {{ post.author }}</span>
                </div>

                <!-- Title -->
                <h1 class="text-3xl md:text-5xl font-elegant font-bold text-ink mb-6 leading-tight">{{ post.title }}</h1>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-8">
                    <span v-for="tag in post.tags" :key="tag"
                        class="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-ink rounded-full text-xs font-medium">
                        <Tag class="w-3 h-3" />
                        {{ tag }}
                    </span>
                </div>

                <!-- Content -->
                <article class="prose prose-neutral max-w-none space-y-6">
                    <div v-for="(block, idx) in formatContent(post.content)" :key="idx">
                        <h2 v-if="block.type === 'heading'" class="text-2xl md:text-3xl font-elegant font-bold text-ink mt-10 mb-4">
                            {{ block.content }}
                        </h2>
                        <p v-else class="text-neutral-600 leading-relaxed text-lg">{{ block.content }}</p>
                    </div>
                </article>

                <!-- Share & Save -->
                <div class="mt-10 pt-8 border-t border-neutral-200 flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <button class="btn-ghost text-sm gap-2">
                            <Heart class="w-4 h-4" />
                            Save article
                        </button>
                        <button class="btn-ghost text-sm gap-2">
                            <Share2 class="w-4 h-4" />
                            Share
                        </button>
                    </div>
                    <RouterLink to="/blog" class="btn-outline text-sm">
                        <ArrowLeft class="w-4 h-4" />
                        Back to journal
                    </RouterLink>
                </div>

                <!-- Related Posts -->
                <div v-if="relatedPosts.length > 0" class="mt-16">
                    <div class="flex items-center gap-2 mb-6">
                        <BookOpen class="w-5 h-5 text-accent" />
                        <h2 class="text-2xl font-elegant font-bold text-ink">More articles</h2>
                    </div>
                    <div class="grid md:grid-cols-2 gap-5">
                        <RouterLink v-for="rp in relatedPosts" :key="rp.id" :to="`/blog/${rp.id}`"
                            class="card-base p-5 group">
                            <p class="text-xs text-neutral-500 mb-2">{{ rp.date }} · {{ rp.readTime }}</p>
                            <h3 class="font-bold text-ink group-hover:text-accent transition-colors">{{ rp.title }}</h3>
                            <p class="text-sm text-neutral-600 mt-2 line-clamp-2">{{ rp.excerpt }}</p>
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-accent mt-3">
                                Read more
                                <ArrowRight class="w-3 h-3" />
                            </span>
                        </RouterLink>
                    </div>
                </div>
            </div>

            <!-- Post Not Found -->
            <div v-else class="text-center py-20 max-w-lg mx-auto">
                <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen class="w-8 h-8 text-neutral-400" />
                </div>
                <h2 class="text-2xl font-bold text-ink mb-2">Article not found</h2>
                <p class="text-neutral-500 mb-6">The article you are looking for does not exist or has been removed.</p>
                <RouterLink to="/blog" class="btn-accent inline-flex">
                    Browse all articles
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
            </div>
        </section>
    </div>
</template>
