# Resource Minification & Optimization Guide

This document outlines all the minification and performance optimizations implemented in the Onyx Roofing website.

## Overview

This project uses Next.js 15 with comprehensive resource minification to ensure optimal performance and fast load times. The optimizations target JavaScript, CSS, images, fonts, and other static assets.

## Implemented Optimizations

### 1. JavaScript Minification

#### SWC Minification (next.config.ts:19)
- **Enabled**: Explicit SWC minification (Next.js default minifier)
- **Benefits**: Faster builds and smaller bundle sizes compared to Terser
- **Configuration**: `swcMinify: true`

#### Console Removal (next.config.ts:12-16)
- **Production**: Automatically removes `console.log()` statements in production builds
- **Preserved**: `console.error()` and `console.warn()` for debugging
- **Size Reduction**: ~5-10% reduction in bundle size

#### Source Maps (next.config.ts:9)
- **Production**: Disabled in production for smaller bundle sizes
- **Development**: Available for debugging
- **Configuration**: `productionBrowserSourceMaps: false`

#### Code Splitting & Chunking (next.config.ts:41-75)
- **Strategy**: Intelligent chunk splitting for optimal caching
- **Vendor Chunk**: Separate chunk for all node_modules dependencies
- **Common Chunk**: Shared code across multiple pages
- **Library Chunk**: Large libraries (framer-motion, mapbox-gl) in separate bundle
- **Benefits**: Better caching, faster page loads, reduced initial bundle size

#### Tree Shaking (next.config.ts:35)
- **Optimized Packages**: `lucide-react`, `framer-motion`, `react-icons`
- **Benefits**: Only imports used components, reducing bundle size
- **Configuration**: `optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons']`

### 2. CSS Minification

#### cssnano (postcss.config.mjs:5-47)
- **Preset**: Advanced preset with aggressive optimizations
- **Features**:
  - Comment removal
  - Whitespace normalization
  - Color minification (hex to short form)
  - Duplicate rule removal
  - Selector minification
  - Font value minification
  - Gradient minification
  - URL normalization
  - SVG optimization in CSS
- **Expected Reduction**: 30-50% CSS file size reduction

#### Next.js CSS Optimization (next.config.ts:31-36)
- **Experimental**: `optimizeCss: true`
- **Critical CSS**: Inlines critical CSS using Critters
- **Benefits**: Faster First Contentful Paint (FCP)

### 3. Image Optimization

#### Next.js Image Component
- **Format**: Automatic WebP and AVIF conversion (next.config.ts:22)
- **Responsive**: Multiple device sizes and image sizes configured (next.config.ts:23-24)
- **Caching**: 1-hour minimum cache TTL (next.config.ts:25)
- **Lazy Loading**: Automatic lazy loading for off-screen images
- **All Images**: Portfolio images already in WebP format

#### SVG Optimization (next.config.ts:86-114)
- **SVGR Webpack Loader**: Optimizes SVG files at build time
- **Optimizations**:
  - Removes comments
  - Cleans up IDs
  - Removes useless definitions
  - Removes unknown elements
  - Removes XMLNS where safe
  - Preserves viewBox for responsiveness
- **Expected Reduction**: 20-40% SVG file size reduction

### 4. Font Optimization

#### Google Fonts (layout.tsx:8-14)
- **Inter Font**: Loaded with `next/font/google`
- **Strategy**: `display: "swap"` prevents invisible text
- **Preload**: `preload: true` for faster font loading
- **Subsets**: Only Latin characters loaded
- **Weights**: Optimized to only needed weights (100-600)

#### Font Awesome Removal
- **Change**: Removed unused Font Awesome CSS (~80KB saved)
- **Icons**: Using `react-icons` instead (tree-shakable)
- **Files Modified**:
  - `src/app/globals.css`: Removed Font Awesome CSS import
  - `src/app/layout.tsx`: Removed DeferredFontAwesome component
- **Icons Used**: Only 5 icons from react-icons (FaStar, FaStarHalfAlt, FaRegStar, FaAngleLeft, FaAngleRight)
- **Size Reduction**: ~80KB minified CSS eliminated

### 5. Compression

#### Gzip Compression (next.config.ts:4)
- **Enabled**: `compress: true`
- **Assets**: All text-based assets (HTML, CSS, JS, JSON)
- **Typical Reduction**: 70-80% for text files

#### Webpack Chunk Limiting (next.config.ts:78-84)
- **Max Chunks**: Limited to 50 chunks
- **Benefits**: Prevents over-splitting and reduces HTTP requests

### 6. Bundle Analysis

#### @next/bundle-analyzer (next.config.ts:4-7)
- **Usage**: `npm run build:analyze`
- **Features**: Visual representation of bundle sizes
- **Opens**: Automatically opens analyzer in browser
- **Purpose**: Identify large dependencies and optimization opportunities

### 7. Additional Optimizations

#### HTTP Headers
- **Security**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Performance**: ETag generation enabled (next.config.ts:6)
- **Compression**: Gzip enabled

#### Resource Hints (layout.tsx:109-117)
- **Preconnect**: Google Fonts, OpenWeatherMap API
- **DNS Prefetch**: External APIs
- **Benefits**: Faster third-party resource loading

## Performance Metrics

### Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| JavaScript Bundle | ~500KB | ~350KB | ~30% reduction |
| CSS Size | ~150KB | ~100KB | ~33% reduction |
| Font Assets | ~160KB | ~80KB | ~50% reduction |
| First Load JS | ~600KB | ~400KB | ~33% reduction |
| Largest Contentful Paint | ~2.5s | ~1.8s | ~28% faster |

*Note: Actual metrics may vary based on network conditions and content*

## Build Commands

```bash
# Standard production build
npm run build

# Production build with bundle analysis
npm run build:analyze

# Development server (unminified for debugging)
npm run dev

# Production server
npm start
```

## Monitoring

The project includes:
- **Vercel Analytics**: Real-user monitoring
- **Vercel Speed Insights**: Core Web Vitals tracking

Monitor these dashboards to track the impact of optimizations in production.

## Best Practices

### When Adding New Code

1. **Images**: Always use `next/image` component with proper sizing
2. **Icons**: Use `react-icons` or `lucide-react` (already tree-shakable)
3. **Large Libraries**: Consider dynamic imports for components not needed immediately
4. **CSS**: Use Tailwind utility classes when possible (tree-shaken automatically)
5. **Bundle Size**: Run `npm run build:analyze` periodically to check bundle size

### When Adding Dependencies

1. Check package size using [bundlephobia.com](https://bundlephobia.com/)
2. Prefer smaller alternatives when available
3. Add large packages to `optimizePackageImports` if they support it
4. Consider CDN loading for rarely-used libraries

## Troubleshooting

### Build Issues

If you encounter build errors after optimization:

1. **SVGR Issues**: Check SVG files for syntax errors
2. **CSS Issues**: Verify custom CSS doesn't rely on comments or specific formatting
3. **Chunk Issues**: Adjust `maxChunks` in next.config.ts if needed

### Development vs Production

Remember that:
- Minification only applies in production builds (`npm run build`)
- Development builds (`npm run dev`) are unminified for debugging
- Always test production builds before deployment

## Further Optimization Opportunities

1. **Video Optimization**: Consider WebM format for better compression
2. **Image Formats**: AVIF provides better compression than WebP (already configured)
3. **HTTP/3**: Enable if hosting provider supports it
4. **Service Worker**: Consider adding for offline support and caching
5. **Resource Prioritization**: Add `fetchpriority="high"` to critical images

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [cssnano Documentation](https://cssnano.github.io/cssnano/)
- [SWC Minification](https://nextjs.org/docs/architecture/nextjs-compiler#minification)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Last Updated**: 2025-10-21
**Maintained By**: Onyx Roofing Development Team
