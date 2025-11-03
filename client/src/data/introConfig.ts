export const introConfig = {
  // Video source - Add your own video file here
  // Place video in attached_assets/videos/ and update this path
  // Example: "/attached_assets/videos/intro-kids.mp4"
  videoSrc: "", // Leave empty to use static scene
  
  // Focal points for zoom animation when gender is selected
  // These coordinates determine where the camera zooms to
  boy: {
    zoom: 2.8,
    x: -120,
    y: 60
  },
  girl: {
    zoom: 2.8,
    x: 140,
    y: 40
  },
  
  // Timing configuration (in seconds)
  questionDelay: 2.5,      // How long to wait before showing question
  transitionDuration: 1.2, // How long the zoom animation takes
  
  // Performance settings
  preloadDelay: 0,         // Video preload delay
  maxVideoSize: 5          // Max MB for video file (for optimization checks)
};

export type Gender = 'boy' | 'girl';
