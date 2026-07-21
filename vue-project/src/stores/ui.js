import { defineStore } from 'pinia'
import { ref } from 'vue'

const LS_KEY = 'alie_ui_v1'

function load() {
    try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return { expanded: true, sidebarVisible: false }
        return JSON.parse(raw)
    } catch {
        return { expanded: true, sidebarVisible: false }
    }
}

export const useUIStore = defineStore('ui', () => {
    const saved = load()
    const expanded = ref(saved.expanded ?? true)
    const sidebarVisible = ref(saved.sidebarVisible ?? false)
    const searchOpen = ref(false)

    function persist() {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ expanded: expanded.value, sidebarVisible: sidebarVisible.value }))
        } catch (e) { /* ignore */ }
    }

    function toggleExpanded() { expanded.value = !expanded.value; persist() }
    function toggleSidebarVisible() { sidebarVisible.value = !sidebarVisible.value; persist() }
    function setExpanded(v) { expanded.value = v; persist() }
    function setSidebarVisible(v) { sidebarVisible.value = v; persist() }

    function openSearch() { searchOpen.value = true }
    function closeSearch() { searchOpen.value = false }
    function toggleSearch() { searchOpen.value = !searchOpen.value }

    return {
        expanded, sidebarVisible, searchOpen,
        toggleExpanded, toggleSidebarVisible, setExpanded, setSidebarVisible,
        openSearch, closeSearch, toggleSearch,
    }
})
