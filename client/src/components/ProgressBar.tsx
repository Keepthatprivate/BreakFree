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
    <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-card-border">
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
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index <= currentChapterIndex
                      ? 'bg-primary scale-125'
                      : 'bg-muted scale-100'
                  }`}
                />
                <span
                  className={`text-xs font-medium tracking-wide hidden sm:block transition-colors ${
                    index === currentChapterIndex
                      ? 'text-foreground'
                      : index < currentChapterIndex
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/60'
                  }`}
                >
                  {chapter.title}
                </span>
              </div>
              {index < chapters.length - 1 && (
                <div className="h-px bg-border flex-1 mx-2" />
              )}
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-600 ease-out"
            style={{ width: `${progressPercentage}%` }}
            data-testid="progress-fill"
          />
        </div>
      </div>
    </div>
  );
}
