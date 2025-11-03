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
  // Desktop (horizontal image) - Boy on left, Girl on right
  boy: {
    zoom: 3.0,      // Deeper zoom into the boy's mind
    x: 220,         // Boy on left side (move image right to see left)
    y: -100         // Focus on upper part (head/face area)
  },
  girl: {
    zoom: 3.0,      // Deeper zoom into the girl's mind
    x: -220,        // Girl on right side (move image left to see right)
    y: -100         // Focus on upper part (head/face area)
  },
  
  // Mobile (vertical image) - Boy on left, Girl on right (closer together in portrait)
  boyMobile: {
    zoom: 2.8,      // Slightly less zoom for mobile
    x: 120,         // Boy on left (move image right to see left)
    y: -80          // Focus on upper part (head/face area)
  },
  girlMobile: {
    zoom: 2.8,      // Slightly less zoom for mobile
    x: -120,        // Girl on right (move image left to see right)
    y: -80          // Focus on upper part (head/face area)
  },
  
  // Timing configuration (in seconds)
  questionDelay: 2.5,         // Initial zoom duration before question appears
  mindPlungeDuration: 2.0,    // Deep zoom into selected child's mind
  
  // Performance settings
  preloadDelay: 0,         // Video preload delay
  maxVideoSize: 5          // Max MB for video file (for optimization checks)
};

export type Gender = 'boy' | 'girl';
