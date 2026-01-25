import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
        '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [vue()],
    server: {
        port: 3001,
        open: false, // set to true if you want browser auto-open
    },
})
