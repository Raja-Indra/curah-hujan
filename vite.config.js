import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        // 1. Izinkan akses Network (0.0.0.0)
        host: '0.0.0.0', 
        
        // 2. TAMBAHKAN INI: Matikan proteksi CORS agar IP 192.168.xx bisa akses
        cors: true, 

        // 3. Pastikan HMR mengarah ke IP Hotspot Anda
        hmr: {
            host: '192.168.137.1'
        },
        
        // Opsional: Kadang Vite butuh origin yang jelas
        origin: 'http://192.168.137.1:5173',
    },
});