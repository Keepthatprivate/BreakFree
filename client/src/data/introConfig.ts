export const introConfig = {
  // Video source - can be replaced with your own video file
  // Place video in attached_assets/videos/ and update this path
  videoSrc: "https://cdn.pixabay.com/video/2024/01/03/195431-899934854_large.mp4",
  
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
