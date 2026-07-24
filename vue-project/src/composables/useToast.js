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
            duration: opts.duration ?? 3000,
            // Optional action (e.g. { label: 'Undo', handler: () => {...} })
            action: opts.action || null,
        }

        state.toasts.push(toast)

        // Auto-remove after timeout
        const timer = setTimeout(() => remove(id), toast.duration)

        // Store the timer so we can clear it if the user clicks the action
        toast._timer = timer
    }

    // ✅ Remove a toast manually (and clear its auto-remove timer)
    function remove(id) {
        const index = state.toasts.findIndex(t => t.id === id)
        if (index !== -1) {
            const toast = state.toasts[index]
            if (toast._timer) clearTimeout(toast._timer)
            state.toasts.splice(index, 1)
        }
    }

    // ✅ Execute a toast's action handler (if any), then dismiss the toast
    function executeAction(id) {
        const index = state.toasts.findIndex(t => t.id === id)
        if (index !== -1) {
            try {
                state.toasts[index].action?.handler?.()
            } catch (e) {
                console.error('Toast action failed:', e)
            }
        }
        remove(id)
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

    return { toasts: state.toasts, push, remove, executeAction, success, error, info, warning }
}
