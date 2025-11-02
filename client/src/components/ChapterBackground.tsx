import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface ChapterBackgroundProps {
  chapter: number;
}

export default function ChapterBackground({ chapter }: ChapterBackgroundProps) {
  const [lottieData, setLottieData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Try to load Lottie animation for current chapter
    const lottieFiles = {
      1: '/lottie/chapter-bg-1-surface.json',
      2: '/lottie/chapter-bg-2-descend.json',
      3: '/lottie/chapter-bg-3-depth.json',
      4: '/lottie/chapter-bg-4-innerchild.json',
    };

    const file = lottieFiles[chapter as keyof typeof lottieFiles];
    
    if (!file || prefersReducedMotion) {
      setLottieData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(file)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setLottieData(data);
        setIsLoading(false);
      })
      .catch(() => {
        setLottieData(null);
        setIsLoading(false);
      });
  }, [chapter, prefersReducedMotion]);

  const getStaticGradient = () => {
    switch (chapter) {
      case 1:
        // Surface - still, reflective water
        return 'bg-gradient-to-b from-[#0a0a12] via-[#0d0d16] to-[#12121c]';
      case 2:
        // Descending - rippling, movement
        return 'bg-gradient-to-br from-[#0d0d16] via-[#141420] to-[#1a1a2a]';
      case 3:
        // Depth - darker, mysterious
        return 'bg-gradient-to-b from-[#08080e] via-[#0d0d16] to-[#0a0a12]';
      case 4:
        // Inner child - softer, glowing
        return 'bg-gradient-to-br from-[#12121c] via-[#0d0d16] to-[#181828]';
      default:
        return 'bg-gradient-to-b from-[#0a0a12] via-[#0d0d16] to-[#12121c]';
    }
  };

  return (
    <div 
      className="chapter-background fixed inset-0 transition-all duration-400 ease-out"
      data-testid="chapter-background"
      style={{
        zIndex: -1,
      }}
    >
      {!isLoading && lottieData && !prefersReducedMotion ? (
        // Lottie animation available
        <div 
          className="absolute inset-0 animate-in fade-in duration-400"
          style={{
            animation: 'parallaxZoom 30s ease-in-out infinite',
          }}
        >
          <Lottie
            animationData={lottieData}
            loop={true}
            className="w-full h-full object-cover"
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid slice'
            }}
          />
        </div>
      ) : (
        // Static gradient fallback
        <div className={`absolute inset-0 ${getStaticGradient()} animate-in fade-in duration-400`}>
          {/* Subtle animated overlay for depth (only if motion allowed) */}
          {!prefersReducedMotion && (
            <>
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'radial-gradient(circle at 30% 50%, rgba(84, 211, 187, 0.1) 0%, transparent 50%)',
                  animation: 'pulse 8s ease-in-out infinite',
                }}
              />
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  background: 'radial-gradient(circle at 70% 50%, rgba(84, 211, 187, 0.08) 0%, transparent 60%)',
                  animation: 'pulse 12s ease-in-out infinite reverse',
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
