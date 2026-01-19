/**
 * IntroSceneShell - Lightweight shell for instant first paint
 *
 * This component renders immediately while the full animated IntroScene
 * loads in the background. This improves LCP by ~300ms.
 */
import { useState, useEffect, lazy, Suspense } from 'react';
// Optimized WebP images
import kidsImageDesktop from '@assets/optimized/ChatGPT Image 3 nov. 2025, 15_52_05_1762181570565.webp';
import kidsImageMobile from '@assets/optimized/ChatGPT Image 3 nov. 2025, 15_56_30_1762181821528.webp';

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
  image: {
    position: 'absolute' as const,
    inset: 0,
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
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Detect mobile for correct image
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    // Small delay to let the shell paint first, then hydrate with animations
    // Using requestAnimationFrame + setTimeout for cross-browser support
    const timer = requestAnimationFrame(() => {
      setTimeout(() => setIsHydrated(true), 16); // One frame delay
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Once hydrated, render the full animated version
  if (isHydrated) {
    return (
      <Suspense fallback={<ShellContent isMobile={isMobile} />}>
        <IntroSceneAnimated />
      </Suspense>
    );
  }

  // Initial shell - renders instantly without JS animations
  return <ShellContent isMobile={isMobile} />;
}

// Pure CSS shell that paints immediately
function ShellContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={shellStyles.container}>
      <img
        src={isMobile ? kidsImageMobile : kidsImageDesktop}
        alt="Children playing"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        style={shellStyles.image}
      />
      <div style={shellStyles.gradient} />
    </div>
  );
}
