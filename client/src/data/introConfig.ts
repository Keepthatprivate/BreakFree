export const introConfig = {
  // Video source - kindergarten children playing
  videoSrc: "/attached_assets/videos/intro-kids.mp4",
  
  // Initial zoom during video playback (2-3s before question)
  initialZoom: {
    scale: 1.3,
    duration: 2.5
  },
  
  // Focal points for deep zoom into child's head (mind plunge)
  boy: {
    zoom: 3.5,      // Deeper zoom into the mind
    x: -150,        // Adjust based on boy's position in video
    y: -80
  },
  girl: {
    zoom: 3.5,      // Deeper zoom into the mind
    x: 150,         // Adjust based on girl's position in video
    y: -80
  },
  
  // Timing configuration (in seconds)
  questionDelay: 2.5,         // Initial zoom duration before question appears
  mindPlungeDuration: 2.0,    // Deep zoom into selected child's mind
  
  // Performance settings
  preloadDelay: 0,         // Video preload delay
  maxVideoSize: 5          // Max MB for video file (for optimization checks)
};

export type Gender = 'boy' | 'girl';
