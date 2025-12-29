import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { trackViewContent } from '@/lib/facebook-tracking';

// Import diverse profile images - these should NOT overlap with TestimonialsPage images
import lisaImage from '@assets/stock_images/professional_woman_s_d4fbbe22.jpg';
import annaImage from '@assets/stock_images/young_woman_casual_s_b2572404.jpg';
import rachelImage from '@assets/stock_images/young_woman_casual_s_cb2bd61f.jpg';
import jamesImage from '@assets/stock_images/professional_black_m_06705ed8.jpg';
import michaelImage from '@assets/stock_images/young_man_casual_sel_cfbef95c.jpg';
import emilyImage from '@assets/stock_images/young_woman_smiling__c268d950.jpg';
import davidImage from '@assets/stock_images/young_man_casual_sel_fecd2253.jpg';

interface LoadingPageProps {
  onComplete: () => void;
}

const testimonials = [
  { 
    quote: "In every relationship I had, there were the same patterns - same conflicts, same drama, same reactions. Now I get it. I am finally able to move on with my life.", 
    name: "Lisa Chen",
    image: lisaImage
  },
  { 
    quote: "Since my accident as a teenager, I've never been the same. Understanding the roots of my fears and the way I reacted was the only way for me to finally overcome this trauma.", 
    name: "Anna B.",
    image: annaImage
  },
  { 
    quote: "This app helped me realize that in my relationships my past traumas was a key component for the reasons we broke up. I wouldn't have guessed without it.", 
    name: "Rachel W.",
    image: rachelImage
  },
  { 
    quote: "I've always thought I had ADHD. My childhood in Kenya was rough, and I couldn't cope with what I saw. Therefore I always had this mental fog, this inability to focus because my mind was keeping me busy to avoid pain. Now it's gone for good.", 
    name: "James R.",
    image: jamesImage
  },
  { 
    quote: "I've always felt different. Didn't know why I was weird or perceived as such by most. This app helped me realize that my childhood traumas made me behave in certain ways that weren't normal. The clarity this app gave me is such a relief.", 
    name: "Michael T.",
    image: michaelImage
  },
  { 
    quote: "I am a very susceptible person. Always thought it was part of my identity, actually it was just a reaction to some childhood events. Now my anger is gone, and I can even joke about myself.", 
    name: "Emily K.",
    image: emilyImage
  },
  { 
    quote: "I have been in depression for over 10 years. Never thought of taking the step to meet with a psy. Now I discovered my triggers, I wish I had found this app sooner.", 
    name: "David P.",
    image: davidImage
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

  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 03 - Loading Analysis' });
  }, []);

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

    // Trigger haptic feedback when loading starts
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    const startTime = Date.now();
    const interval = 50; // Update every 50ms for smooth animation

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      
      if (elapsed >= totalDuration) {
        clearInterval(timer);
        // Trigger haptic feedback on completion
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 100]);
        }
        // Call onComplete after a brief delay when reaching 100%
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, imagesLoaded]);

  // Rotate testimonials in fixed order (no shuffling) every 8 seconds
  useEffect(() => {
    if (!imagesLoaded) return;

    const testimonialTimer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => {
        if (prev < testimonials.length - 1) {
          if (navigator.vibrate) {
            navigator.vibrate([30]);
          }
          return prev + 1;
        }
        return prev; // Stay on last testimonial
      });
    }, 8000);

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
              className="w-full h-4 rounded-full relative"
              style={{ backgroundColor: '#1a1a1a' }}
              data-testid="progress-bar-container"
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: 'hsl(165, 70%, 55%)',
                  boxShadow: '0 0 20px hsla(165, 70%, 55%, 0.5)'
                }}
                data-testid="progress-bar-fill"
              />
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
