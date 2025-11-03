import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import VideoOverlayQuestion from './VideoOverlayQuestion';
import { introConfig, Gender } from '@/data/introConfig';

export default function IntroScene() {
  const [, setLocation] = useLocation();
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Show question after delay
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip video, show question immediately
      setShowQuestion(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowQuestion(true);
    }, introConfig.questionDelay * 1000);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Handle gender selection
  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
    setIsZooming(true);

    // Store gender in localStorage
    localStorage.setItem('gender', gender);

    // Wait for zoom animation to complete, then navigate to quiz
    setTimeout(() => {
      setLocation('/quiz');
    }, introConfig.transitionDuration * 1000);
  };

  // Skip intro and go directly to quiz
  const handleSkipIntro = () => {
    setLocation('/quiz');
  };

  // Get zoom animation values based on selected gender
  const getZoomAnimation = () => {
    if (!selectedGender) return {};
    
    const config = selectedGender === 'boy' ? introConfig.boy : introConfig.girl;
    return {
      scale: config.zoom,
      x: config.x,
      y: config.y,
    };
  };

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden bg-[#0d0d16]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Video Background */}
      {!prefersReducedMotion && (
        <motion.video
          ref={videoRef}
          src={introConfig.videoSrc}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={isZooming ? getZoomAnimation() : { opacity: 1 }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: introConfig.transitionDuration, ease: "easeInOut" },
            x: { duration: introConfig.transitionDuration, ease: "easeInOut" },
            y: { duration: introConfig.transitionDuration, ease: "easeInOut" }
          }}
          data-testid="intro-video"
        />
      )}

      {/* Fallback for reduced motion preference */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d16]">
          <div className="text-center text-white max-w-md mx-4">
            <h2 className="text-2xl font-lora mb-4">Welcome to Break Free Quiz</h2>
            <p className="text-white/70 mb-6">An interactive journey through your childhood patterns</p>
          </div>
        </div>
      )}

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Gender Question Overlay */}
      <AnimatePresence>
        {showQuestion && !isZooming && (
          <VideoOverlayQuestion 
            onSelect={handleGenderSelect}
            show={true}
          />
        )}
      </AnimatePresence>

      {/* Zoom transition overlay */}
      <AnimatePresence>
        {isZooming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute inset-0 bg-black z-20"
          />
        )}
      </AnimatePresence>

      {/* Skip Intro Button */}
      {!isZooming && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleSkipIntro}
          data-testid="button-skip-intro"
          className="absolute bottom-6 right-6 text-white/60 hover:text-white/90 text-sm font-inter transition-colors duration-200 px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40"
        >
          Skip Intro →
        </motion.button>
      )}
    </motion.div>
  );
}
