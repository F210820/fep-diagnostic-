import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Utilise des chemins relatifs pour que le fichier marche en double-clic
})