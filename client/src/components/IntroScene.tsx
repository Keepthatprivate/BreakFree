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

  const hasVideo = introConfig.videoSrc && introConfig.videoSrc.length > 0;

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden bg-[#0d0d16]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Video Background - Only if video source is provided */}
      {hasVideo && !prefersReducedMotion && (
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

      {/* Static Background Scene - Shown when no video or reduced motion */}
      {(!hasVideo || prefersReducedMotion) && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d16] via-[#1a1a2e] to-[#0d0d16]">
          {/* Ambient animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#54d3bb]/10"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-center text-white max-w-md mx-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-lora mb-4">Welcome to Break Free Quiz</h2>
              <p className="text-white/70 text-lg">An interactive journey through your childhood patterns</p>
            </motion.div>
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
