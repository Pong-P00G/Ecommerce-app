import { ref, onMounted } from "vue"

export function useTheme() {
    const theme = ref("light")

    const applyTheme = () => {
        if (theme.value === "dark") {
        document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
        document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }

    const toggleTheme = () => {
        theme.value = theme.value === "light" ? "dark" : "light"
        applyTheme()
    }

    onMounted(() => {
        const saved = localStorage.getItem("theme") || "light"
        theme.value = saved
        applyTheme()
    })

    return { theme, toggleTheme }
}
