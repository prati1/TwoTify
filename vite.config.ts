import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),

  ],
  server: {
    host: "0.0.0.0"
  }
})
