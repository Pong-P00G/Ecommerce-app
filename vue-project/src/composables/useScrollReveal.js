import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for scroll-triggered reveal animations.
 * Attaches an IntersectionObserver to elements with a given selector.
 *
 * Usage:
 *   const { observe, unobserve } = useScrollReveal({
 *       selector: '.reveal',
 *       threshold: 0.15,
 *       rootMargin: '0px 0px -50px 0px'
 *   })
 *
 *   // Call observe() in onMounted
 *   onMounted(() => observe())
 *
 * HTML: <div class="reveal">...</div>
 */
export function useScrollReveal(options = {}) {
    const {
        selector = '.reveal',
        threshold = 0.1,
        rootMargin = '0px 0px -40px 0px',
        delay = 0,
    } = options

    let observer = null

    function observe() {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            // Fallback: show everything
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal-visible')
            })
            return
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target
                    // Add delay if specified
                    const delayMs = el.dataset.revealDelay || delay
                    if (delayMs) {
                        el.style.transitionDelay = delayMs + 'ms'
                    }
                    el.classList.add('reveal-visible')
                    observer.unobserve(el)
                }
            })
        }, { threshold, rootMargin })

        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el)
        })
    }

    function unobserve() {
        if (observer) {
            observer.disconnect()
            observer = null
        }
    }

    onUnmounted(() => {
        unobserve()
    })

    return { observe, unobserve }
}
