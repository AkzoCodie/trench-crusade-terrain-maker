import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @vitejs/plugin-react devDependency’sini eklemeden de çalışır (fast refresh olmadan).
// İstersen ekleyebilirsin; şimdilik vanilla kalsın:
export default defineConfig({
  plugins: [],
})
