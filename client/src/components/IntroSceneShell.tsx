/**
 * IntroSceneShell - Lightweight shell for instant first paint and LCP optimization
 *
 * Key LCP optimizations:
 * - Uses <picture> element with media queries (no JS detection needed)
 * - Explicit width/height attributes for proper LCP detection
 * - Static positioning in visual flow (not absolute) for LCP candidate
 * - Preloaded in index.html with fetchpriority="high"
 * - Aggressive WebP compression (~70-116KB vs original 3MB)
 */
import { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load the full animated version
const IntroSceneAnimated = lazy(() => import('./IntroSceneAnimated'));

// Minimal shell styles (inlined to avoid CSS blocking)
const shellStyles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#0d0d16',
  },
  // Image wrapper ensures proper sizing while allowing object-fit
  imageWrapper: {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    filter: 'brightness(0.9)',
  },
  gradient: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)',
    pointerEvents: 'none' as const,
  },
};

export default function IntroSceneShell() {
  const [isHydrated, setIsHydrated] = useState(false);

  // Small delay to let the shell paint first, then hydrate with animations
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setTimeout(() => setIsHydrated(true), 16); // One frame delay
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Once hydrated, render the full animated version
  if (isHydrated) {
    return (
      <Suspense fallback={<ShellContent />}>
        <IntroSceneAnimated />
      </Suspense>
    );
  }

  // Initial shell - renders instantly without JS animations
  return <ShellContent />;
}

// Pure CSS shell that paints immediately with proper LCP element
function ShellContent() {
  return (
    <div style={shellStyles.container}>
      {/* Image wrapper for proper positioning */}
      <div style={shellStyles.imageWrapper}>
        {/*
          <picture> element for responsive images without JS
          - Media queries select correct image at CSS level
          - Explicit dimensions help Lighthouse identify LCP
          - fetchPriority="high" ensures early loading
        */}
        <picture>
          {/* Mobile image (portrait, optimized for smaller screens) */}
          <source
            media="(max-width: 767px)"
            srcSet="/assets/hero-mobile.webp"
            type="image/webp"
            width={800}
            height={1200}
          />
          {/* Desktop image (landscape, optimized for larger screens) */}
          <source
            media="(min-width: 768px)"
            srcSet="/assets/hero-desktop.webp"
            type="image/webp"
            width={1536}
            height={1024}
          />
          {/* Fallback img element (required for <picture>) */}
          <img
            src="/assets/hero-desktop.webp"
            alt="Children playing"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={1536}
            height={1024}
            style={shellStyles.image}
          />
        </picture>
      </div>
      {/* Gradient overlay for text readability */}
      <div style={shellStyles.gradient} />
    </div>
  );
}
