<script setup>
import { ref } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const theme = ref(localStorage.getItem('theme') || 'light')

const applyTheme = (t) => {
    if (t === 'dark') {
        document.documentElement.classList.add('dark')
    } else if (t === 'light') {
        document.documentElement.classList.remove('dark')
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', prefersDark)
    }
    localStorage.setItem('theme', t)
}

// Apply saved theme on mount
applyTheme(theme.value)

const cycleTheme = () => {
    const modes = ['light', 'dark', 'system']
    const idx = modes.indexOf(theme.value)
    theme.value = modes[(idx + 1) % modes.length]
    applyTheme(theme.value)
}

const iconMap = { light: Sun, dark: Moon, system: Monitor }
</script>

<template>
    <button @click="cycleTheme"
        class="w-10 h-10 rounded-full hover:bg-neutral-100 transition-all duration-300 text-ink flex items-center justify-center group relative"
        :aria-label="'Current theme: ' + theme + '. Click to change.'">
        <component :is="iconMap[theme] || Sun" class="w-5 h-5" />
        <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-ink text-paper text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {{ theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System' }}
        </span>
    </button>
</template>
