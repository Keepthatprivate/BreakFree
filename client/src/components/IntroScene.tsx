import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import VideoOverlayQuestion from './VideoOverlayQuestion';
import { introConfig, Gender } from '@/data/introConfig';
import kidsImageDesktop from '@assets/ChatGPT Image 3 nov. 2025, 15_52_05_1762181570565.png';
import kidsImageMobile from '@assets/ChatGPT Image 3 nov. 2025, 15_56_30_1762181821528.png';

export default function IntroScene() {
  const [, setLocation] = useLocation();
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Wait for mind plunge animation to complete, then navigate to quiz
    setTimeout(() => {
      setLocation('/quiz');
    }, introConfig.mindPlungeDuration * 1000);
  };

  // Skip intro and go directly to quiz
  const handleSkipIntro = () => {
    setLocation('/quiz');
  };

  // Get zoom animation values based on selected gender (mind plunge)
  const getMindPlungeAnimation = () => {
    if (!selectedGender) return {};
    
    // Use different focal points for mobile (vertical image) vs desktop (horizontal image)
    const config = isMobile 
      ? (selectedGender === 'boy' ? introConfig.boyMobile : introConfig.girlMobile)
      : (selectedGender === 'boy' ? introConfig.boy : introConfig.girl);
    
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
      {/* Animated Image Background - Cinematic effect */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={isMobile ? kidsImageMobile : kidsImageDesktop}
            alt="Children playing"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover brightness-90"
            initial={{ scale: 1 }}
            animate={
              isZooming 
                ? getMindPlungeAnimation() // Deep zoom into child's mind after selection
                : { 
                    scale: introConfig.initialZoom.scale // Initial gentle zoom during playback
                  }
            }
            transition={
              isZooming
                ? { 
                    // Mind plunge animation - dramatic zoom into selected child
                    scale: { duration: introConfig.mindPlungeDuration, ease: "easeIn" },
                    x: { duration: introConfig.mindPlungeDuration, ease: "easeIn" },
                    y: { duration: introConfig.mindPlungeDuration, ease: "easeIn" }
                  }
                : {
                    // Initial zoom during playback
                    scale: { duration: introConfig.initialZoom.duration, ease: "easeInOut" }
                  }
            }
            data-testid="intro-image"
          />
          {/* Animated overlay for depth */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#54d3bb]/10 via-transparent to-[#0d0d16]/30"
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
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

    </motion.div>
  );
}
