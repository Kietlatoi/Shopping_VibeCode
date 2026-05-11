import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Cần import thư viện path của node

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      // Định nghĩa @ sẽ trỏ vào thư mục src
      "@": path.resolve(__dirname, "./src"),
    },
  },
})