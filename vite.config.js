import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src', // This makes 'src' the root directory
  envDir: '../', // This allows Vite to find the .env file in the project root
  build: {
    outDir: '../dist', // This ensures your build goes to the right place
  }
})