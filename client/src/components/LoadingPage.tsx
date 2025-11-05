import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LoadingPageProps {
  onComplete: () => void;
}

const testimonials = [
  { 
    quote: "It helped me save 10 years of therapy", 
    name: "Sarah M.",
    initials: "SM",
    color: "bg-primary/20"
  },
  { 
    quote: "My mental fog finally disappeared, such a relief", 
    name: "James R.",
    initials: "JR",
    color: "bg-accent/20"
  },
  { 
    quote: "I finally understand why I react the way I do", 
    name: "Emily K.",
    initials: "EK",
    color: "bg-secondary/20"
  },
  { 
    quote: "This clarity changed everything for me", 
    name: "Michael T.",
    initials: "MT",
    color: "bg-primary/20"
  },
  { 
    quote: "The patterns suddenly made sense", 
    name: "Lisa Chen",
    initials: "LC",
    color: "bg-accent/20"
  },
  { 
    quote: "I wish I had found this sooner", 
    name: "David P.",
    initials: "DP",
    color: "bg-secondary/20"
  },
  { 
    quote: "Finally feeling like myself again", 
    name: "Anna B.",
    initials: "AB",
    color: "bg-primary/20"
  },
  { 
    quote: "This explained so much about my relationships", 
    name: "Chris W.",
    initials: "CW",
    color: "bg-accent/20"
  }
];

const loadingStages = [
  { min: 0, max: 25, text: "Collecting your answers" },
  { min: 25, max: 50, text: "Deep trauma analysis to assess your childhood profile" },
  { min: 50, max: 75, text: "Comparing your profile to our +40 million trauma analysis" },
  { min: 75, max: 100, text: "Finalizing results and conclusion" }
];

// Non-linear easing function for more captivating progress
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  const [rawProgress, setRawProgress] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Apply easing to create non-linear progress
  const progress = easeInOutCubic(rawProgress / 100) * 100;

  useEffect(() => {
    // Progress bar animation over 60 seconds (1 minute)
    const totalDuration = 60000; // 60 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const increment = (100 / totalDuration) * interval;

    const timer = setInterval(() => {
      setRawProgress((prev) => {
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
  const currentTestimonial = testimonials[currentTestimonialIndex];

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
              className="w-full h-3 bg-background rounded-full overflow-hidden border border-border"
              data-testid="progress-bar-container"
            >
              <motion.div
                className="h-full bg-primary rounded-full shadow-lg shadow-primary/50"
                style={{ width: `${progress}%` }}
                initial={{ width: '0%' }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
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
            <div className="relative min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4"
                  data-testid={`testimonial-${currentTestimonialIndex}`}
                >
                  {/* Avatar */}
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarFallback className={`${currentTestimonial.color} text-foreground font-semibold text-base`}>
                      {currentTestimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Quote */}
                  <div className="text-center max-w-md">
                    <p className="text-base sm:text-lg text-foreground/90 mb-2">
                      "{currentTestimonial.quote}"
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      — {currentTestimonial.name}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
