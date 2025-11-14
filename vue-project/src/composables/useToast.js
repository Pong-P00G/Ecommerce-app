import { reactive } from 'vue'

const state = reactive({
    toasts: []
})

export function useToast() {
    // ✅ Add a toast
    function push(message = '', opts = {}) {
        const id = Date.now() + Math.random()

        const toast = {
            id,
            message,
            type: opts.type || 'info', // 'success' | 'error' | 'warning' | 'info'
            duration: opts.duration ?? 3000
        }

        state.toasts.push(toast)

        // Auto-remove after timeout
        setTimeout(() => remove(id), toast.duration)
    }

    // ✅ Remove a toast manually
    function remove(id) {
        const index = state.toasts.findIndex(t => t.id === id)
        if (index !== -1) state.toasts.splice(index, 1)
    }

    // ✅ Shortcut methods for convenience
    function success(message, opts = {}) {
        push(message, { ...opts, type: 'success' })
    }

    function error(message, opts = {}) {
        push(message, { ...opts, type: 'error' })
    }

    function info(message, opts = {}) {
        push(message, { ...opts, type: 'info' })
    }

    function warning(message, opts = {}) {
        push(message, { ...opts, type: 'warning' })
    }

    return { toasts: state.toasts, push, remove, success, error, info, warning }
}
