import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import vercel from 'solid-start-vercel'
export default defineConfig({
  plugins: [
    solidPlugin(),
  ],
  server: {
    port: 3001,
  },
  build: {
    target: 'esnext',
  },
  base: "/toronto_rental_prediction/",
});
