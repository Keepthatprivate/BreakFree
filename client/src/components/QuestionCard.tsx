import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';
import type { Question } from '@shared/quiz-data';
import AudioPlayer from './AudioPlayer';
import VisualPattern from './VisualPattern';
import footstepsAudio from '@assets/footsteps_short.mp3';
import doorClosingAudio from '@assets/doors_PZuanhr_1761859927075.mp3';
import geometricPattern from '@assets/pexels-golnar-sabzpoush-rashidi-1317651-2530383_1761955317513.jpg';

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

interface QuizButtonAreaProps {
  onNext: () => void;
  onPrevious?: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
  disabled?: boolean;
}

function QuizButtonArea({ onNext, onPrevious, canGoBack, isLastQuestion, disabled = false }: QuizButtonAreaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-2">
          <Button
            onClick={onNext}
            disabled={disabled}
            className="w-full h-12 sm:h-14 text-base sm:text-lg rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
            data-testid="button-next"
          >
            {isLastQuestion ? 'Complete Quiz' : 'Continue'}
          </Button>
          {canGoBack && (
            <button
              onClick={onPrevious}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
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
  const [sliderValue, setSliderValue] = useState<number>(
    question.type === 'slider' ? (savedAnswer[0] ? Number(savedAnswer[0]) : question.defaultValue || 50) : 50
  );
  const isGenderQuestion = question.id === 'q1';
  const previousAudioUrlRef = useRef<string>('');

  const audioUrl = useMemo(() => {
    if (question.type !== 'audio-test') return '';
    if (question.id === 'q4') {
      return footstepsAudio;
    } else if (question.id === 'q8') {
      return doorClosingAudio;
    }
    return '';
  }, [question.type, question.id]);

  useEffect(() => {
    setSelectedValues(savedAnswer);
    if (question.type === 'slider' && savedAnswer[0]) {
      setSliderValue(Number(savedAnswer[0]));
    }
  }, [question.id, savedAnswer, question.type]);

  const handleOptionClick = (value: string) => {
    if (question.type === 'radio' || question.type === 'popup' || question.type === 'quote-reflection' || question.type === 'audio-test' || question.type === 'visual-test') {
      setSelectedValues([value]);
      onAnswer([value]);
    } else if (question.type === 'multi') {
      const newSelection = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelection);
      onAnswer(newSelection);
    } else if (question.type === 'emoji-grid' || question.type === 'image-choice') {
      setSelectedValues([value]);
      onAnswer([value]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    onAnswer([value[0].toString()]);
  };

  const handleNext = () => {
    if (question.type === 'slider' || selectedValues.length > 0) {
      onNext();
    }
  };

  const buttonDisabled = question.type !== 'slider' && selectedValues.length === 0;

  if (isGenderQuestion) {
    const genderOptions = [
      { value: 'male', label: 'Male', emoji: '👨', gradient: 'from-blue-500 to-cyan-500' },
      { value: 'female', label: 'Female', emoji: '👩', gradient: 'from-purple-500 to-pink-500' },
    ];

    return (
      <>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              What is your gender identity?
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                  <span>Why we ask</span>
                  <Info className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-card border-card-border">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Why we ask about gender</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Understanding your gender identity helps us personalize your healing journey. Research shows that trauma patterns and coping mechanisms can differ based on gender experiences and socialization.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {genderOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-primary shadow-2xl shadow-primary/30 scale-[1.02]'
                      : 'border-card-border/50 hover:border-card-border hover:scale-[1.01]'
                  }`}
                  data-testid={`option-${option.value}`}
                >
                  <div className="bg-card p-8 sm:p-10">
                    <div className="flex flex-col items-center gap-6">
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center text-6xl sm:text-7xl relative`}>
                        <div className="absolute inset-0 rounded-full bg-card/20 backdrop-blur-sm" />
                        <span className="relative z-10">{option.emoji}</span>
                        {isSelected && (
                          <>
                            <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-20">
                              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/40 animate-ping" />
                          </>
                        )}
                      </div>
                      <p className={`text-xl sm:text-2xl font-bold transition-colors ${
                        isSelected ? 'text-foreground' : 'text-foreground/80'
                      }`}>
                        {option.label}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  if (question.type === 'slider') {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div
            className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
            data-testid="question-card"
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
                {question.text}
              </h2>
            </div>

            <div className="flex-1 flex flex-col justify-center px-2">
              <div className="mb-4">
                <Slider
                  value={[sliderValue]}
                  onValueChange={handleSliderChange}
                  min={question.min}
                  max={question.max}
                  step={1}
                  className="w-full"
                  data-testid="slider-input"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{question.minLabel}</span>
                <span className="font-bold text-primary text-xl">{sliderValue}</span>
                <span>{question.maxLabel}</span>
              </div>
            </div>
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={false}
        />
      </>
    );
  }

  if (question.type === 'emoji-grid') {
    return (
      <>
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div
            className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
            data-testid="question-card"
          >
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
                {question.text}
              </h2>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {question.emojis.map((emoji) => {
                const isSelected = selectedValues.includes(emoji.value);
                return (
                  <button
                    key={emoji.value}
                    onClick={() => handleOptionClick(emoji.value)}
                    className={`flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20 scale-105'
                        : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                    }`}
                    data-testid={`option-${emoji.value}`}
                  >
                    <span className="text-4xl sm:text-5xl">{emoji.emoji}</span>
                    <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                      {emoji.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  if (question.type === 'image-choice') {
    return (
      <>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div
            className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
            data-testid="question-card"
          >
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
                {question.text}
              </h2>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
              {question.options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20 scale-105'
                        : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                    }`}
                    data-testid={`option-${option.value}`}
                  >
                    <span className="text-4xl sm:text-6xl">{option.emoji}</span>
                    <div className="text-center">
                      <p className={`text-base sm:text-lg font-bold mb-1 ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                        {option.label}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  if (question.type === 'quote-reflection') {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div
            className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
            data-testid="question-card"
          >
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-normal text-foreground mb-3 sm:mb-4">
                  Do you relate to this quote?
                </h2>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-primary leading-relaxed italic px-2">
                  "{question.quote}"
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {question.options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                      className={`w-full p-5 rounded-2xl text-center transition-all duration-200 border-2 ${
                        isSelected
                          ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                          : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                      }`}
                      data-testid={`option-${option.value}`}
                    >
                      <span className={`text-base sm:text-lg ${isSelected ? 'font-semibold text-foreground' : 'font-normal text-foreground/90'}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  if (question.type === 'popup') {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in zoom-in-95 duration-500">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" />
          <div
            className="relative z-35 bg-card rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col border-2 border-primary/30"
            data-testid="question-card"
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2 text-center">
                {question.text}
              </h2>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {question.options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                        : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                    }`}
                    data-testid={`option-${option.value}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary'
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
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  if (question.type === 'audio-test') {
    return (
      <>
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div
            className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
            data-testid="question-card"
          >
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
                {question.text}
              </h2>
              
              <AudioPlayer audioSrc={audioUrl} label={question.soundDescription.replace('🔊 ', '')} />

              <p className="text-sm text-muted-foreground text-center mb-4 mt-6">
                What does this sound make you think of?
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {question.options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20 scale-105'
                        : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                    }`}
                    data-testid={`option-${option.value}`}
                  >
                    <span className={`text-base sm:text-lg font-semibold ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <p className="text-xs sm:text-sm text-primary/80 italic leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        {option.interpretation}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  if (question.type === 'visual-test') {
    return (
      <>
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 pb-32 animate-in fade-in duration-150">
          <div
            className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
            data-testid="question-card"
          >
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-3">
                {question.text}
              </h2>

              <div className="w-full max-w-md mx-auto mb-3">
                <img 
                  src={geometricPattern}
                  alt="Geometric pattern"
                  className="w-full h-32 sm:h-40 object-cover rounded-xl"
                  loading="eager"
                />
              </div>
              
              <p className="text-center text-muted-foreground text-xs sm:text-sm">
                What do you see first?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`flex flex-col gap-1.5 p-3 rounded-2xl transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                        : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                    }`}
                    data-testid={`option-${option.value}`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                      {option.label}
                    </span>
                    {isSelected && option.interpretation && (
                      <p className="text-[10px] sm:text-xs text-primary/80 italic leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        {option.interpretation}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <QuizButtonArea
          onNext={handleNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
          isLastQuestion={isLastQuestion}
          disabled={buttonDisabled}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-32 animate-in fade-in duration-150">
        <div
          className="bg-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
              {'text' in question ? question.text : ''}
            </h2>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 sm:gap-3">
            {'options' in question && question.options.map((option: { value: string; label: string }) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                      : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                  }`}
                  data-testid={`option-${option.value}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/40'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm sm:text-base lg:text-lg ${isSelected ? 'font-semibold text-foreground' : 'font-normal text-foreground/90'}`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <QuizButtonArea
        onNext={handleNext}
        onPrevious={onPrevious}
        canGoBack={canGoBack}
        isLastQuestion={isLastQuestion}
        disabled={buttonDisabled}
      />
    </>
  );
}
