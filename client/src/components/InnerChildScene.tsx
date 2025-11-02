import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import type { ChildEmotion } from '@/logic/ChildEmotionEngine';
import innerChildScenes from '@/data/innerChildScenes.json';

// Import Lottie animations
import darkCaveAnimation from '@/animations/bg-dark-cave.json';
import ripplesAnimation from '@/animations/bg-ripples.json';
import lightRaysAnimation from '@/animations/bg-light-rays.json';
import sunriseAnimation from '@/animations/bg-sunrise.json';

interface InnerChildSceneProps {
  chapterId: string;
  emotion: ChildEmotion;
  children: React.ReactNode;
  showEmpathyQuote?: boolean;
}

const animationMap: { [key: string]: any } = {
  'bg-dark-cave.json': darkCaveAnimation,
  'bg-ripples.json': ripplesAnimation,
  'bg-light-rays.json': lightRaysAnimation,
  'bg-sunrise.json': sunriseAnimation,
};

export default function InnerChildScene({
  chapterId,
  emotion,
  children,
  showEmpathyQuote = false,
}: InnerChildSceneProps) {
  const [showQuote, setShowQuote] = useState(showEmpathyQuote);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileSmall, setIsMobileSmall] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Find scene data for current chapter
  const sceneData = innerChildScenes.find((scene) => scene.chapterId === chapterId);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check for small mobile screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileSmall(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Show empathy quote for 2 seconds at chapter start
  useEffect(() => {
    if (showEmpathyQuote) {
      setShowQuote(true);
      const timer = setTimeout(() => {
        setShowQuote(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEmpathyQuote]);

  // Get animation based on scene data
  const animation = sceneData ? animationMap[sceneData.background] : null;

  // Emotion-based visual effects
  const getEmotionFilter = () => {
    switch (emotion) {
      case 'sad':
        return 'brightness(0.7) saturate(0.8)';
      case 'hopeful':
        return 'brightness(1.2) saturate(1.1)';
      default:
        return 'brightness(1) saturate(1)';
    }
  };

  const getEmotionOverlay = () => {
    switch (emotion) {
      case 'sad':
        return 'rgba(20, 20, 40, 0.3)';
      case 'hopeful':
        return 'rgba(84, 211, 187, 0.15)';
      default:
        return 'rgba(13, 13, 22, 0.1)';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Lottie Animation or Static Fallback */}
        {!prefersReducedMotion && !isMobileSmall && animation ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
            style={{ filter: getEmotionFilter() }}
          >
            <Lottie
              animationData={animation}
              loop={true}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </motion.div>
        ) : (
          // Static gradient fallback for reduced motion or small screens
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
            style={{
              background: sceneData
                ? `linear-gradient(135deg, ${sceneData.colors.primary} 0%, ${sceneData.colors.accent} 100%)`
                : 'linear-gradient(135deg, rgba(13, 13, 22, 0.95) 0%, rgba(84, 211, 187, 0.1) 100%)',
            }}
          />
        )}

        {/* Emotion-based overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: getEmotionOverlay(),
          }}
          transition={{ duration: 0.8 }}
        />

        {/* Base dark overlay for readability */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Empathy Quote Overlay */}
      <AnimatePresence>
        {showQuote && sceneData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="max-w-2xl mx-auto px-6 text-center">
              <p className="text-2xl sm:text-3xl font-medium text-white leading-relaxed italic drop-shadow-lg">
                {sceneData.quote}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Layer (Quiz Questions) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
