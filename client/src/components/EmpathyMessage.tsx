import { Heart } from 'lucide-react';

interface EmpathyMessageProps {
  message: string;
  onContinue: () => void;
}

export default function EmpathyMessage({ message, onContinue }: EmpathyMessageProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div
        className="bg-card/60 backdrop-blur-sm border border-card-border rounded-2xl p-8 sm:p-12 text-center animate-in fade-in duration-500"
        data-testid="empathy-message"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
        </div>
        <p className="text-lg sm:text-xl font-serif italic text-foreground leading-relaxed">
          {message}
        </p>
        <button
          onClick={onContinue}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-continue-empathy"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
