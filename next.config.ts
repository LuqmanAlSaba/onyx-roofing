import type { NextConfig } from "next";

// Bundle analyzer for analyzing bundle sizes
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles

  // Compiler optimizations (SWC minification is enabled by default in Next.js 13+)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // improved cache for images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizeCss: true,
    // Note: Next.js 15.4.2 still requires 'critters' internally
    // 'beasties' is the modern fork but not yet supported by Next.js
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons'], // Tree-shake these packages
  },

  // Webpack customization for advanced minification
  webpack: (config, { webpack, isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: isServer ? undefined : 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for node_modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk for code used across multiple pages
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate chunk for large libraries
          lib: {
            test: /[\\/]node_modules[\\/](framer-motion|mapbox-gl)[\\/]/,
            name: 'lib',
            chunks: 'all',
            priority: 30,
          },
        },
      },
    };

    // Compression plugins for better minification
    if (!isServer) {
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 50, // Limit chunks to prevent over-splitting
        })
      );
    }

    // Minify SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      cleanupIds: true,
                      removeUselessDefs: true,
                      removeUnknownElements: true,
                    },
                  },
                },
                'removeComments',
                'removeXMLNS',
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
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

export default withBundleAnalyzer(nextConfig);
