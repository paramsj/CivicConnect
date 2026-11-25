import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // When served behind the Nginx gateway the admin is at /admin/
  base: process.env.VITE_BASE_PATH || '/',
  preview: {
    allowedHosts: [
      'civic-admin.onrender.com'
    ]
  }
})
