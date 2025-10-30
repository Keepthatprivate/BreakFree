import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Info } from 'lucide-react';
import type { Question } from '@shared/quiz-data';
import AudioPlayer from './AudioPlayer';
import { createDoorClosingAudio } from '@/utils/audioEffects';
import footstepsAudio from '@assets/footsteps_1761858527619.mp3';

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
  const [sliderValue, setSliderValue] = useState<number>(
    question.type === 'slider' ? (savedAnswer[0] ? Number(savedAnswer[0]) : question.defaultValue || 50) : 50
  );
  const isGenderQuestion = question.id === 'q1';
  const previousAudioUrlRef = useRef<string>('');

  // Generate audio URL for audio-test questions (must be at top level per Rules of Hooks)
  const audioUrl = useMemo(() => {
    if (question.type !== 'audio-test') return '';
    if (question.id === 'q4') {
      // Use the uploaded MP3 file for footsteps
      return footstepsAudio;
    } else if (question.id === 'q8') {
      // Use procedurally generated audio for door closing
      return createDoorClosingAudio();
    }
    return '';
  }, [question.type, question.id]);

  // Clean up blob URLs when switching questions
  useEffect(() => {
    const prevUrl = previousAudioUrlRef.current;
    
    // Revoke previous blob URL if it exists and is different from current
    if (prevUrl && prevUrl !== audioUrl && prevUrl.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrl);
    }
    
    // Store current URL for next cleanup
    previousAudioUrlRef.current = audioUrl;

    // Cleanup on unmount
    return () => {
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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

  // Gender Question (Special Visual Treatment)
  if (isGenderQuestion) {
    const genderOptions = [
      { value: 'male', label: 'Male', emoji: '👨', gradient: 'from-blue-500 to-cyan-500' },
      { value: 'female', label: 'Female', emoji: '👩', gradient: 'from-purple-500 to-pink-500' },
    ];

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            What is your gender identity?
          </h2>
          <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
            <span>Why we ask</span>
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
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

        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <Button
            onClick={handleNext}
            disabled={selectedValues.length === 0}
            className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
            data-testid="button-next"
          >
            Continue
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
    );
  }

  // Slider Question
  if (question.type === 'slider') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px] flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
              {question.text}
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center mb-8 px-2">
            <div className="mb-8">
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

          <div className="flex flex-col gap-3 mt-auto">
            <Button
              onClick={handleNext}
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

  // Emoji Grid Question
  if (question.type === 'emoji-grid') {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px] flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
              {question.text}
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {question.emojis.map((emoji) => {
              const isSelected = selectedValues.includes(emoji.value);
              return (
                <button
                  key={emoji.value}
                  onClick={() => handleOptionClick(emoji.value)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-accent bg-accent/15 shadow-lg shadow-accent/20 scale-105'
                      : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                  }`}
                  data-testid={`option-${emoji.value}`}
                >
                  <span className="text-5xl">{emoji.emoji}</span>
                  <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                    {emoji.label}
                  </span>
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

  // Image Choice Question
  if (question.type === 'image-choice') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px] flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
              {question.text}
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {question.options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-accent bg-accent/15 shadow-lg shadow-accent/20 scale-105'
                      : 'border-muted/50 bg-muted/30 hover:border-muted hover:bg-muted/40'
                  }`}
                  data-testid={`option-${option.value}`}
                >
                  <span className="text-6xl">{option.emoji}</span>
                  <div className="text-center">
                    <p className={`text-lg font-bold mb-1 ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                      {option.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
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

  // Quote Reflection Question
  if (question.type === 'quote-reflection') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px] flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="flex-1 flex flex-col justify-center mb-8">
            <div className="text-center mb-12">
              <h2 className="text-xl sm:text-2xl font-normal text-foreground mb-6">
                Do you relate to this quote?
              </h2>
              <p className="text-2xl sm:text-3xl font-medium text-primary leading-relaxed italic">
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
                        ? 'border-accent bg-accent/15 shadow-lg shadow-accent/20'
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

  // Popup Question
  if (question.type === 'popup') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
        <div
          className="relative z-50 bg-card rounded-3xl p-6 sm:p-10 shadow-2xl min-h-[400px] flex flex-col border-2 border-primary/30"
          data-testid="question-card"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2 text-center">
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

  // Audio Test Question
  if (question.type === 'audio-test') {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[500px] flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
              {question.text}
            </h2>
            
            {/* Audio Player */}
            <AudioPlayer audioSrc={audioUrl} label={question.soundDescription.replace('🔊 ', '')} />

            <p className="text-sm text-muted-foreground text-center mb-4 mt-6">
              What does this sound make you think of?
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {question.options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-accent bg-accent/15 shadow-lg shadow-accent/20 scale-105'
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

  // Visual Test Question
  if (question.type === 'visual-test') {
    const visualPatterns: { [key: string]: string } = {
      waves: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 150 Q 50 100, 100 150 T 200 150 T 300 150 T 400 150" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7"/>
          <path d="M0 180 Q 50 130, 100 180 T 200 180 T 300 180 T 400 180" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5"/>
          <path d="M0 120 Q 50 70, 100 120 T 200 120 T 300 120 T 400 120" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6"/>
          <path d="M0 210 Q 50 160, 100 210 T 200 210 T 300 210 T 400 210" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
        </svg>
      `,
      tree: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="180" y="200" width="40" height="100" fill="currentColor" opacity="0.6"/>
          <circle cx="200" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5"/>
          <circle cx="160" cy="120" r="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
          <circle cx="240" cy="120" r="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
          <circle cx="200" cy="90" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        </svg>
      `,
    };

    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[500px] flex flex-col border border-card-border/50"
          data-testid="question-card"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
              {question.text}
            </h2>
            
            {/* Visual pattern display */}
            <div className="bg-muted/20 border-2 border-muted/40 rounded-2xl p-8 mb-6 flex items-center justify-center min-h-[240px]">
              <div className="w-full max-w-md h-48 text-primary/70" dangerouslySetInnerHTML={{ __html: visualPatterns[question.visualPattern] || '' }} />
            </div>

            <p className="text-sm text-muted-foreground text-center mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">{question.imageDescription.split(' ')[0]}</span>
              <span>Look closely and choose what resonates</span>
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {question.options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-accent bg-accent/15 shadow-lg shadow-accent/20 scale-105'
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

  // Standard Radio/Multi Question
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px] flex flex-col border border-card-border/50"
        data-testid="question-card"
      >
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            {'text' in question ? question.text : ''}
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-3 mb-8">
          {'options' in question && question.options.map((option: { value: string; label: string }) => {
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
