import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import type { BreakScreen } from '@shared/quiz-data';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import jamesProfileImage from '@assets/454999ec56229c3ff192fccf33fccb62_1761863003013.jpg';

interface BreakScreenProps {
  breakScreen: BreakScreen;
  onContinue: () => void;
}

export default function BreakScreenComponent({ breakScreen, onContinue }: BreakScreenProps) {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Show continue button after 2 seconds delay for breathing room
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [breakScreen.id]);

  // Data Break
  if (breakScreen.type === 'data-break') {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-primary/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">{breakScreen.emoji}</div>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-4">
              {breakScreen.statistic}
            </p>
            <p className="text-sm text-muted-foreground mb-2">— {breakScreen.source}</p>
            <p className="text-base sm:text-lg text-primary font-medium mt-6">
              {breakScreen.subtext}
            </p>
          </div>
          
          {showContinue && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Button
                onClick={onContinue}
                size="lg"
                className="h-14 px-12 text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 font-bold"
                data-testid="button-continue"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quote Break
  if (breakScreen.type === 'quote-break') {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-card rounded-3xl p-8 sm:p-12 border border-card-border/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl text-primary mb-8">"</div>
            <h2 className="text-2xl sm:text-4xl font-medium text-foreground leading-relaxed italic mb-6">
              {breakScreen.quote}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">— {breakScreen.author}</p>
            <p className="text-base sm:text-lg text-primary font-medium">
              {breakScreen.subtext}
            </p>
          </div>
          
          {showContinue && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Button
                onClick={onContinue}
                size="lg"
                className="h-14 px-12 text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 font-bold"
                data-testid="button-continue"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Testimonial Break
  if (breakScreen.type === 'testimonial-break') {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-primary/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24" data-testid="avatar-james-testimonial">
                <AvatarImage src={jamesProfileImage} alt="James profile picture" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < Math.floor(breakScreen.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
                />
              ))}
              <span className="ml-2 text-lg font-bold text-foreground">{breakScreen.rating}</span>
            </div>
            <p className="text-xl sm:text-2xl text-foreground leading-relaxed italic mb-6">
              "{breakScreen.quote}"
            </p>
            <p className="text-base text-muted-foreground">— {breakScreen.author}</p>
          </div>
          
          {showContinue && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Button
                onClick={onContinue}
                size="lg"
                className="h-14 px-12 text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 font-bold"
                data-testid="button-continue"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Visual Pause
  if (breakScreen.type === 'visual-pause') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30" />
          <div className="relative z-10 text-center p-8">
            <div className="text-8xl sm:text-9xl mb-8">{breakScreen.emoji}</div>
            <p className="text-2xl sm:text-4xl font-bold text-foreground leading-tight">
              {breakScreen.text}
            </p>
          </div>
        </div>
        
        {showContinue && (
          <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Button
              onClick={onContinue}
              size="lg"
              className="h-14 px-12 text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 font-bold"
              data-testid="button-continue"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
