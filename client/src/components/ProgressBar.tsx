import { memo } from 'react';
import { chapters } from '@shared/quiz-data';

interface ProgressBarProps {
  currentChapter: string;
  currentQuestionIndex: number;
  totalQuestions: number;
}

// Memoized ProgressBar to prevent unnecessary re-renders (INP optimization)
const ProgressBar = memo(function ProgressBar({ currentChapter, currentQuestionIndex, totalQuestions }: ProgressBarProps) {
  const currentChapterIndex = chapters.findIndex((c) => c.id === currentChapter);

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex items-center"
              data-testid={`chapter-indicator-${chapter.id}`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                      index < currentChapterIndex
                        ? 'bg-primary border-primary text-primary-foreground'
                        : index === currentChapterIndex
                          ? 'bg-transparent border-primary text-primary'
                          : 'bg-transparent border-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentChapterIndex ? '✓' : index + 1}
                  </div>
                  {/* Replaced animate-ping with opacity animation to prevent CLS */}
                  {index < currentChapterIndex && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-glow" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block transition-colors ${
                    index <= currentChapterIndex
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {chapter.title}
                </span>
              </div>
              {index < chapters.length - 1 && (
                <div
                  className={`h-0.5 w-8 sm:w-16 mx-2 transition-all duration-300 ${
                    index < currentChapterIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProgressBar;
