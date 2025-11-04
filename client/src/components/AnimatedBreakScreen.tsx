import { useState, useEffect } from 'react';
import { animations } from '@/lib/animationAssets';

interface AnimatedBreakScreenProps {
  animationIndex: number;
  onContinue: () => void;
}

export default function AnimatedBreakScreen({ animationIndex, onContinue }: AnimatedBreakScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const gender = (localStorage.getItem('selectedGender') || 'boy') as 'boy' | 'girl';
  const animationSequence = animations[gender][animationIndex];

  useEffect(() => {
    setIsVisible(true);

    const transitionDuration = 200; // Quick transition time
    const displayTimings = [
      1500,  // Image 1: 1.5s display
      1500,  // Image 2: 1.5s display
      2000,  // Image 3: 2.0s display
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
      accumulatedTime += displayTime + transitionDuration;
    });

    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, accumulatedTime - transitionDuration);

    const completeTimer = setTimeout(() => {
      onContinue();
    }, accumulatedTime);

    return () => {
      imageTimers.forEach(clearTimeout);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [animationIndex, gender, onContinue]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div
        className={`relative w-full max-w-2xl aspect-square transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        data-testid="animated-break-screen"
      >
        {animationSequence.images.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={`Animation frame ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid={`animation-image-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
