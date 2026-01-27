import { useState, useEffect } from 'react';
import { animations } from '@/lib/animationAssets';
import { isAssetLoaded, preloadImage } from '@/lib/progressivePreloader';

interface AnimatedBreakScreenProps {
  animationIndex: number;
  onContinue: () => void;
}

export default function AnimatedBreakScreen({ animationIndex, onContinue }: AnimatedBreakScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const gender = (localStorage.getItem('gender') || 'boy') as 'boy' | 'girl';
  const animationSequence = animations[gender][animationIndex];

  // Check if images are already loaded (from progressive preloader) or load them
  useEffect(() => {
    if (!animationSequence) {
      onContinue();
      return;
    }

    const allLoaded = animationSequence.images.every((src) => isAssetLoaded(src));
    if (allLoaded) {
      setImagesLoaded(true);
      return;
    }

    Promise.all(animationSequence.images.map((src) => preloadImage(src))).then(() => {
      setImagesLoaded(true);
    });
  }, [animationSequence, onContinue]);

  // Start animation sequence after images are loaded
  useEffect(() => {
    if (!animationSequence || !imagesLoaded) {
      return;
    }

    // Trigger haptic feedback on mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    const displayTimings = [
      400,  // Image 1: 0.4s display
      400,  // Image 2: 0.4s display
      400,  // Image 3: 0.4s display
    ];

    const imageTimers: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    displayTimings.forEach((displayTime, index) => {
      if (index > 0) {
        const timer = setTimeout(() => {
          setCurrentImageIndex(index);
        }, accumulatedTime);
        imageTimers.push(timer);
      }
      accumulatedTime += displayTime;
    });

    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, accumulatedTime);

    const completeTimer = setTimeout(() => {
      onContinue();
    }, accumulatedTime + 100);

    return () => {
      imageTimers.forEach(clearTimeout);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [animationSequence, imagesLoaded, onContinue]);

  // Don't render if animation sequence doesn't exist
  if (!animationSequence) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
      {!imagesLoaded ? (
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      ) : (
        <div
          className={`relative w-[85vw] max-w-md aspect-[3/4] transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          data-testid="animated-break-screen"
        >
          {animationSequence.images.map((imageSrc, index) => (
            <img
              key={index}
              src={imageSrc}
              alt={`Animation frame ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-100 ${
                currentImageIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
              data-testid={`animation-image-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
