import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Chapter } from '@shared/quiz-data';

interface ChapterTransitionProps {
  chapter: Chapter;
  onContinue: () => void;
}

export default function ChapterTransition({ chapter, onContinue }: ChapterTransitionProps) {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Show continue button after animation completes
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [chapter.id]);

  // Color themes for each chapter
  const chapterThemes = {
    past: {
      gradient: 'from-amber-500/20 via-orange-500/20 to-yellow-500/20',
      textColor: 'text-amber-400',
      emoji: '🌅',
    },
    patterns: {
      gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      textColor: 'text-cyan-400',
      emoji: '🔄',
    },
    healing: {
      gradient: 'from-green-500/20 via-emerald-500/20 to-lime-500/20',
      textColor: 'text-emerald-400',
      emoji: '🌱',
    },
    future: {
      gradient: 'from-purple-500/20 via-pink-500/20 to-fuchsia-500/20',
      textColor: 'text-purple-400',
      emoji: '✨',
    },
  };

  const theme = chapterThemes[chapter.id as keyof typeof chapterThemes] || chapterThemes.past;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-4xl">
        <div
          className={`relative rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center bg-gradient-to-br ${theme.gradient} border border-primary/20 animate-in fade-in zoom-in-95 duration-700`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm" />
          
          <div className="relative z-10 text-center p-8 sm:p-12 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="text-8xl sm:text-9xl mb-8 animate-in zoom-in duration-500 delay-500">
              {theme.emoji}
            </div>
            
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider font-medium">
                Chapter {Object.keys(chapterThemes).indexOf(chapter.id) + 1}
              </p>
              <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold ${theme.textColor} mb-4`}>
                {chapter.title}
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
                {chapter.subtitle}
              </p>
            </div>
          </div>
        </div>

        {showContinue && (
          <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Button
              onClick={onContinue}
              size="lg"
              className="h-14 px-12 text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 font-bold"
              data-testid="button-continue-chapter"
            >
              Begin
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
