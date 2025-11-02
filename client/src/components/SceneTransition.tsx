import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SceneTransitionProps {
  empathyMessage: string;
  onComplete: () => void;
}

export default function SceneTransition({
  empathyMessage,
  onComplete,
}: SceneTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/10"
      onAnimationComplete={() => {
        // Auto-advance after 2 seconds
        setTimeout(onComplete, 2000);
      }}
    >
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card/80 backdrop-blur-sm rounded-3xl p-10 sm:p-14 text-center border border-card-border/50"
          data-testid="scene-transition"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4, type: 'spring' }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" fill="currentColor" />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed italic"
          >
            {empathyMessage}
          </motion.p>

          {/* Subtle breathing animation */}
          <motion.div
            className="mt-8 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.6,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
