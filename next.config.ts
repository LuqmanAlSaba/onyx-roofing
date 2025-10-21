import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: true, // Enable source maps in production for debugging
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // improved cache for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    // Note: Next.js 15.4.2 still requires 'critters' internally
    // 'beasties' is the modern fork but not yet supported by Next.js
  },
  headers: async () => {
    // Content Security Policy
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com https://va.vercel-scripts.com https://api.mapbox.com https://cdn.maptiler.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://api.mapbox.com;
      font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
      img-src 'self' data: blob: https: http:;
      connect-src 'self' https://vercel.live https://*.vercel-insights.com https://vitals.vercel-insights.com https://api.openweathermap.org https://formspree.io https://api.mapbox.com https://events.mapbox.com;
      frame-src 'self' https://vercel.live;
      worker-src 'self' blob:;
      child-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://formspree.io;
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
