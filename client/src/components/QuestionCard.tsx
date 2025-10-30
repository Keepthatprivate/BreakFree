import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Question } from '@shared/quiz-data';

interface QuestionCardProps {
  question: Question;
  chapterTitle: string;
  onAnswer: (answer: string[]) => void;
  onPrevious?: () => void;
  onNext: () => void;
  savedAnswer?: string[];
  canGoBack: boolean;
  isLastQuestion: boolean;
}

export default function QuestionCard({
  question,
  chapterTitle,
  onAnswer,
  onPrevious,
  onNext,
  savedAnswer = [],
  canGoBack,
  isLastQuestion,
}: QuestionCardProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(savedAnswer);

  useEffect(() => {
    setSelectedValues(savedAnswer);
  }, [question.id, savedAnswer]);

  const handleOptionClick = (value: string) => {
    if (question.type === 'radio') {
      setSelectedValues([value]);
      onAnswer([value]);
    } else {
      const newSelection = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelection);
      onAnswer(newSelection);
    }
  };

  const handleNext = () => {
    if (selectedValues.length > 0) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div
        className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px] flex flex-col border border-card-border/50"
        data-testid="question-card"
      >
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            {question.text}
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-3 mb-8">
          {question.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-accent bg-accent/15 shadow-lg shadow-accent/20'
                    : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                }`}
                data-testid={`option-${option.value}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'border-accent bg-accent'
                        : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-base sm:text-lg ${isSelected ? 'font-semibold text-foreground' : 'font-normal text-foreground/90'}`}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <Button
            onClick={handleNext}
            disabled={selectedValues.length === 0}
            className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
            data-testid="button-next"
          >
            {isLastQuestion ? 'Complete Quiz' : 'Continue'}
          </Button>
          {canGoBack && (
            <button
              onClick={onPrevious}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              data-testid="button-previous"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
