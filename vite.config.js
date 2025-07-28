import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://apiconsolaadmqa.vantrustcapital.cl/',
        changeOrigin: true,
        secure: false,  // Si tu servidor es HTTP en vez de HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''),
        // Otras configuraciones, si es necesario:
        // headers: {
        //   'X-Api-Key': 'N3v3rG0nnaG1v3Y0uUp-9f8e42b7-4c21-420a-b71f-bc2e13f9b1ca'
        // }
      },
    },
  },
});
