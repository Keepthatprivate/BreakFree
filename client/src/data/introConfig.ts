export const introConfig = {
  // Video source - kindergarten children playing
  // The actual video is imported in IntroScene.tsx using: import introVideo from '@assets/videos/intro-kids.mp4'
  videoSrc: "intro-kids.mp4", // Just used as a flag to check if video exists
  
  // Initial zoom during video playback (2-3s before question)
  initialZoom: {
    scale: 1.3,
    duration: 2.5
  },
  
  // Focal points for deep zoom into child's head (mind plunge)
  // Boy is on the left side of the cartoon image
  boy: {
    zoom: 3.0,      // Deeper zoom into the mind
    x: -200,        // Boy on left side
    y: -40
  },
  // Girl is on the right side of the cartoon image
  girl: {
    zoom: 3.0,      // Deeper zoom into the mind
    x: 200,         // Girl on right side
    y: -40
  },
  
  // Timing configuration (in seconds)
  questionDelay: 2.5,         // Initial zoom duration before question appears
  mindPlungeDuration: 2.0,    // Deep zoom into selected child's mind
  
  // Performance settings
  preloadDelay: 0,         // Video preload delay
  maxVideoSize: 5          // Max MB for video file (for optimization checks)
};

export type Gender = 'boy' | 'girl';
