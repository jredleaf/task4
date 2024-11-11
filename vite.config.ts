import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Security headers middleware
const securityHeaders = () => ({
  name: 'security-headers',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log(`Request URL: ${req.url}`);
      
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', `
        default-src 'self' https://gxkiubkgtkgvyidvuagh.supabase.co https://appssdk.zoom.us https://static.elfsight.com https://fonts.googleapis.com https://fonts.gstatic.com;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appssdk.zoom.us https://static.elfsight.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https://stackblitz.com https://*.unsplash.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://gxkiubkgtkgvyidvuagh.supabase.co wss://gxkiubkgtkgvyidvuagh.supabase.co;
        frame-src 'self' https://elfsight.com;
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim());
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', `
        default-src 'self' https://gxkiubkgtkgvyidvuagh.supabase.co https://appssdk.zoom.us https://static.elfsight.com https://fonts.googleapis.com https://fonts.gstatic.com;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appssdk.zoom.us https://static.elfsight.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https://stackblitz.com https://*.unsplash.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://gxkiubkgtkgvyidvuagh.supabase.co wss://gxkiubkgtkgvyidvuagh.supabase.co;
        frame-src 'self' https://elfsight.com;
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim());
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
      next();
    });
  }
});

export default defineConfig({
  plugins: [
    react(),
    securityHeaders()
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});