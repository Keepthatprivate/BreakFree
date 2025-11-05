import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Import profile images
import profile1 from '@assets/stock_images/professional_headsho_9f3936ae.jpg';
import profile2 from '@assets/stock_images/professional_headsho_34fce9db.jpg';
import profile3 from '@assets/stock_images/professional_headsho_d53920cc.jpg';
import profile4 from '@assets/stock_images/professional_headsho_dd8bf494.jpg';
import profile5 from '@assets/stock_images/professional_headsho_9ebfa56d.jpg';
import profile6 from '@assets/stock_images/professional_headsho_05ec7d78.jpg';
import profile7 from '@assets/stock_images/professional_headsho_5d9d8553.jpg';
import profile8 from '@assets/stock_images/professional_headsho_1406407a.jpg';

interface LoadingPageProps {
  onComplete: () => void;
}

const testimonials = [
  { 
    quote: "It helped me save 10 years of therapy", 
    name: "Sarah M.",
    image: profile1
  },
  { 
    quote: "My mental fog finally disappeared, such a relief", 
    name: "James R.",
    image: profile5
  },
  { 
    quote: "I finally understand why I react the way I do", 
    name: "Emily K.",
    image: profile2
  },
  { 
    quote: "This clarity changed everything for me", 
    name: "Michael T.",
    image: profile6
  },
  { 
    quote: "The patterns suddenly made sense", 
    name: "Lisa Chen",
    image: profile3
  },
  { 
    quote: "I wish I had found this sooner", 
    name: "David P.",
    image: profile7
  },
  { 
    quote: "Finally feeling like myself again", 
    name: "Anna B.",
    image: profile4
  },
  { 
    quote: "This explained so much about my relationships", 
    name: "Chris W.",
    image: profile8
  }
];

const loadingStages = [
  { min: 0, max: 25, text: "Collecting your answers" },
  { min: 25, max: 50, text: "Deep trauma analysis to assess your childhood profile" },
  { min: 50, max: 75, text: "Comparing your profile to our +40 million trauma analysis" },
  { min: 75, max: 100, text: "Finalizing results and conclusion" }
];

// Custom non-linear progression: 0→9% (fast), 9→32%, 32→69%, 69→100%
const getProgressForTime = (elapsedMs: number, totalDuration: number): number => {
  const t = elapsedMs / totalDuration; // 0 to 1
  
  // Define keyframes: [time%, progress%]
  const keyframes = [
    [0, 0],       // Start at 0%
    [0.05, 9],    // Reach 9% at 5% of time (3 seconds)
    [0.25, 32],   // Reach 32% at 25% of time (15 seconds)
    [0.55, 69],   // Reach 69% at 55% of time (33 seconds)
    [1, 100]      // Reach 100% at 60 seconds
  ];
  
  // Find which segment we're in
  for (let i = 0; i < keyframes.length - 1; i++) {
    const [t1, p1] = keyframes[i];
    const [t2, p2] = keyframes[i + 1];
    
    if (t >= t1 && t <= t2) {
      // Linear interpolation between keyframes with easing
      const segmentProgress = (t - t1) / (t2 - t1);
      // Apply ease-in-out to each segment
      const eased = segmentProgress < 0.5 
        ? 2 * segmentProgress * segmentProgress 
        : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;
      return p1 + (p2 - p1) * eased;
    }
  }
  
  return 100;
};

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const totalDuration = 60000; // 60 seconds
  const progress = getProgressForTime(elapsedTime, totalDuration);

  // Preload all testimonial images
  useEffect(() => {
    const imagePromises = testimonials.map((testimonial) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to prevent hanging
        img.src = testimonial.image;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  useEffect(() => {
    // Only start the timer once images are loaded
    if (!imagesLoaded) return;

    const startTime = Date.now();
    const interval = 50; // Update every 50ms for smooth animation

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      
      if (elapsed >= totalDuration) {
        clearInterval(timer);
        // Call onComplete after a brief delay when reaching 100%
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, imagesLoaded]);

  useEffect(() => {
    // Only start rotating testimonials once images are loaded
    if (!imagesLoaded) return;

    // Rotate testimonials every 4 seconds
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialTimer);
  }, [imagesLoaded]);

  // Get current stage based on progress
  const getCurrentStage = () => {
    return loadingStages.find(stage => progress >= stage.min && progress < stage.max) || loadingStages[loadingStages.length - 1];
  };

  const currentStage = getCurrentStage();
  const currentTestimonial = testimonials[currentTestimonialIndex];

  // Show a simple loading state while images preload
  if (!imagesLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Generate random floating elements for visual effect
  const generateFloatingElements = () => {
    const elements = [];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '%', '+', '=', '∞', '∑', '∆'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 15; i++) {
      const isNumber = Math.random() > 0.4;
      const type = isNumber ? 'number' : shapes[Math.floor(Math.random() * shapes.length)];
      const delay = Math.random() * 3;
      const duration = 4 + Math.random() * 4;
      const xStart = Math.random() * 100;
      const xEnd = xStart + (Math.random() - 0.5) * 30;
      
      elements.push({
        id: i,
        type,
        content: isNumber ? numbers[Math.floor(Math.random() * numbers.length)] : type,
        delay,
        duration,
        xStart,
        xEnd,
        size: isNumber ? 20 + Math.random() * 20 : 15 + Math.random() * 15
      });
    }
    return elements;
  };

  const floatingElements = generateFloatingElements();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Main content container */}
        <div className="space-y-12">
          {/* Dynamic calculation animation */}
          <div className="relative h-32 overflow-hidden">
            {floatingElements.map((element) => (
              <motion.div
                key={element.id}
                className="absolute"
                style={{
                  left: `${element.xStart}%`,
                }}
                initial={{ y: 130, opacity: 0 }}
                animate={{
                  y: -30,
                  x: `${element.xEnd - element.xStart}%`,
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{
                  duration: element.duration,
                  delay: element.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {element.type === 'number' ? (
                  <span 
                    className="text-primary/40 font-mono font-bold"
                    style={{ fontSize: `${element.size}px` }}
                  >
                    {element.content}
                  </span>
                ) : element.type === 'circle' ? (
                  <div 
                    className="rounded-full border-2 border-primary/30"
                    style={{ width: `${element.size}px`, height: `${element.size}px` }}
                  />
                ) : element.type === 'square' ? (
                  <div 
                    className="border-2 border-accent/30"
                    style={{ width: `${element.size}px`, height: `${element.size}px` }}
                  />
                ) : (
                  <div 
                    className="border-2 border-secondary/30"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: `${element.size / 2}px solid transparent`,
                      borderRight: `${element.size / 2}px solid transparent`,
                      borderBottom: `${element.size}px solid hsl(var(--secondary) / 0.3)`,
                      borderTop: 'none',
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Loading stage text */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentStage.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-xl sm:text-2xl font-semibold text-foreground px-4"
                data-testid="text-loading-stage"
              >
                {currentStage.text}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Progress bar container */}
          <div className="space-y-4">
            <div 
              className="w-full h-4 bg-card rounded-full overflow-hidden border border-card-border relative"
              data-testid="progress-bar-container"
            >
              <motion.div
                className="h-full rounded-full relative"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: 'hsl(var(--primary))'
                }}
                initial={{ width: '0%' }}
                animate={{ 
                  boxShadow: [
                    '0 0 10px hsl(var(--primary) / 0.3)',
                    '0 0 20px hsl(var(--primary) / 0.5)',
                    '0 0 10px hsl(var(--primary) / 0.3)'
                  ]
                }}
                transition={{ 
                  boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }}
                data-testid="progress-bar-fill"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                     style={{
                       backgroundSize: '200% 100%',
                       animation: 'shimmer 2s infinite'
                     }}
                />
              </motion.div>
            </div>
            
            {/* Progress percentage */}
            <div className="text-center">
              <motion.span 
                className="text-base font-semibold text-primary" 
                data-testid="text-progress-percentage"
                key={Math.floor(progress)}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>

          {/* Testimonials section */}
          <div className="pt-8">
            <div className="relative min-h-[160px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4"
                  data-testid={`testimonial-${currentTestimonialIndex}`}
                >
                  {/* Avatar */}
                  <Avatar className="w-16 h-16 border-2 border-primary/30 shadow-lg">
                    <AvatarImage src={currentTestimonial.image} alt={currentTestimonial.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 text-foreground font-semibold">
                      {currentTestimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Quote */}
                  <div className="text-center max-w-md px-4">
                    <p className="text-base sm:text-lg text-foreground/90 mb-3 leading-relaxed">
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
