import { useEffect } from 'react';
import { Heart } from 'lucide-react';

interface EmpathyMessageProps {
  message: string;
  onContinue: () => void;
}

export default function EmpathyMessage({ message, onContinue }: EmpathyMessageProps) {
  // Trigger haptic feedback on mobile devices when empathy message appears
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([40, 20, 40]);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div
        className="bg-card rounded-3xl p-10 sm:p-14 text-center animate-in fade-in duration-150 border border-card-border/50"
        data-testid="empathy-message"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" fill="currentColor" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-8">
          {message}
        </p>
        <button
          onClick={onContinue}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-semibold"
          data-testid="button-continue-empathy"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
