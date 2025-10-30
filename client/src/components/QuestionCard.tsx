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
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div
        className="bg-card/60 backdrop-blur-sm border border-card-border rounded-2xl p-6 sm:p-12 shadow-xl min-h-[400px] flex flex-col"
        data-testid="question-card"
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium">
            {chapterTitle}
          </p>
          <h2 className="text-2xl sm:text-3xl font-medium text-foreground leading-snug">
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
                className={`w-full p-4 sm:p-6 rounded-xl border-2 text-left transition-all duration-200 hover-elevate active-elevate-2 ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card/40'
                }`}
                data-testid={`option-${option.value}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                  <span className={`text-base sm:text-lg font-normal ${isSelected ? 'font-medium' : ''}`}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mt-auto">
          {canGoBack ? (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="px-6"
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={selectedValues.length === 0}
            className="px-8"
            data-testid="button-next"
          >
            {isLastQuestion ? 'Complete' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
