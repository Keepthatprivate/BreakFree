import { Heart } from 'lucide-react';

interface EmpathyMessageProps {
  message: string;
  onContinue: () => void;
}

export default function EmpathyMessage({ message, onContinue }: EmpathyMessageProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div
        className="bg-card/90 backdrop-blur-sm border-2 border-accent/40 rounded-3xl p-8 sm:p-12 text-center animate-in fade-in duration-500 shadow-2xl shadow-accent/20"
        data-testid="empathy-message"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </div>
        <p className="text-lg sm:text-xl font-serif italic text-foreground leading-relaxed">
          {message}
        </p>
        <button
          onClick={onContinue}
          className="mt-8 px-6 py-2 text-sm text-accent hover:text-foreground transition-colors font-semibold tracking-wide border-2 border-accent/30 rounded-xl hover:border-accent/60"
          data-testid="button-continue-empathy"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
