import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 3000, allowedHosts: ['.e2b.app'] },
  preview: { host: '0.0.0.0', port: 3000, allowedHosts: ['.e2b.app'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
