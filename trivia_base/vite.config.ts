import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/trivia_base/',
    server: {
        cors: {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://alphapokedex.github.io', 'https://chiragahlawat.in'],
            credentials: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    }
})
