import { chapters } from '@shared/quiz-data';

interface ProgressBarProps {
  currentChapter: string;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function ProgressBar({ currentChapter, currentQuestionIndex, totalQuestions }: ProgressBarProps) {
  const currentChapterIndex = chapters.findIndex((c) => c.id === currentChapter);
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b-2 border-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex items-center flex-1"
              data-testid={`chapter-indicator-${chapter.id}`}
            >
              <div className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index <= currentChapterIndex
                      ? 'bg-primary scale-125 shadow-lg shadow-primary/50'
                      : 'bg-muted scale-100'
                  }`}
                />
                <span
                  className={`text-xs font-semibold tracking-wide hidden sm:block transition-colors ${
                    index === currentChapterIndex
                      ? 'text-foreground'
                      : index < currentChapterIndex
                        ? 'text-accent'
                        : 'text-muted-foreground/60'
                  }`}
                >
                  {chapter.title}
                </span>
              </div>
              {index < chapters.length - 1 && (
                <div className="h-px bg-secondary/20 flex-1 mx-2" />
              )}
            </div>
          ))}
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden border border-secondary/20">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-600 ease-out shadow-lg shadow-primary/30"
            style={{ width: `${progressPercentage}%` }}
            data-testid="progress-fill"
          />
        </div>
      </div>
    </div>
  );
}
