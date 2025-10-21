'use client';

import { useEffect } from 'react';
import '@/app/non-critical.css';

/**
 * Component that defers loading of non-critical CSS to improve initial page load performance.
 * This includes animations, custom effects, and other styles not needed for above-the-fold content.
 *
 * By importing CSS in a client component, Next.js creates a separate CSS chunk that's loaded
 * asynchronously, preventing it from blocking the initial render.
 */
export default function DeferredNonCriticalCSS() {
  return null; // This component doesn't render anything, but triggers CSS loading
}
