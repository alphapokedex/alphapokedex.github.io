import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
    // Determine base path based on environment
    const basePath = process.env.VITE_BASE_PATH || '/trivia_base/'

    return {
        plugins: [vue()],
        base: basePath,
        server: {
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
            }
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets'
        }
    }
})
