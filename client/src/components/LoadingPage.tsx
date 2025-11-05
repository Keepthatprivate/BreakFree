import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingPageProps {
  onComplete: () => void;
}

const testimonials = [
  "It helped me save 10 years of therapy",
  "My mental fog finally disappeared, such a relief",
  "I finally understand why I react the way I do",
  "This clarity changed everything for me",
  "The patterns suddenly made sense",
  "I wish I had found this sooner",
  "Finally feeling like myself again",
  "This explained so much about my relationships"
];

const loadingStages = [
  { min: 0, max: 25, text: "Collecting your answers" },
  { min: 25, max: 50, text: "Deep trauma analysis to assess your childhood profile" },
  { min: 50, max: 75, text: "Comparing your profile to our +40 million trauma analysis" },
  { min: 75, max: 100, text: "Finalizing results and conclusion" }
];

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    // Progress bar animation over 60 seconds (1 minute)
    const totalDuration = 60000; // 60 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const increment = (100 / totalDuration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          // Call onComplete after a brief delay when reaching 100%
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    // Rotate testimonials every 4 seconds
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialTimer);
  }, []);

  // Get current stage based on progress
  const getCurrentStage = () => {
    return loadingStages.find(stage => progress >= stage.min && progress < stage.max) || loadingStages[loadingStages.length - 1];
  };

  const currentStage = getCurrentStage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Main content container */}
        <div className="space-y-12">
          {/* Loading stage text */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentStage.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl font-semibold text-foreground"
                data-testid="text-loading-stage"
              >
                {currentStage.text}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Progress bar container */}
          <div className="space-y-3">
            <div 
              className="w-full h-3 bg-muted rounded-full overflow-hidden"
              data-testid="progress-bar-container"
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: '0%' }}
                transition={{ duration: 0.05, ease: 'linear' }}
                data-testid="progress-bar-fill"
              />
            </div>
            
            {/* Progress percentage */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground" data-testid="text-progress-percentage">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Testimonials section */}
          <div className="pt-8">
            <div className="relative min-h-[80px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                  data-testid={`testimonial-${currentTestimonialIndex}`}
                >
                  <p className="text-base sm:text-lg italic text-foreground/80 max-w-md mx-auto">
                    "{testimonials[currentTestimonialIndex]}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
