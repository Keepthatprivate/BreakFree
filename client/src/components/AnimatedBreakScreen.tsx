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

    const timings = [
      700,  // Image 1: 0.7s
      700,  // Image 2: 0.7s
      1000, // Image 3: 1.0s
    ];

    const imageTimers: NodeJS.Timeout[] = [];
    let accumulatedTime = 300; // Initial fade-in time

    timings.forEach((duration, index) => {
      const timer = setTimeout(() => {
        if (index < timings.length - 1) {
          setCurrentImageIndex(index + 1);
        }
      }, accumulatedTime);
      
      imageTimers.push(timer);
      accumulatedTime += duration;
    });

    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, accumulatedTime);

    const completeTimer = setTimeout(() => {
      onContinue();
    }, accumulatedTime + 300); // Wait for fade-out

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
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid={`animation-image-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
