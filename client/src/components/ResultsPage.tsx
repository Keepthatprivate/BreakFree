import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';
import { useState } from 'react';

interface QuizAnswers {
  [questionId: string]: string[];
}

interface ResultsPageProps {
  userName: string;
  answers: QuizAnswers;
  onContinue: () => void;
}

export default function ResultsPage({ userName, onContinue }: ResultsPageProps) {
  const handleGetNow = () => {
    onContinue();
  };

  const handleSkip = () => {
    console.log('Skip clicked');
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Feel the difference
          </h1>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            in just 7 days
          </p>
        </div>

        <div className="relative mb-12 max-w-3xl mx-auto">
          <div className="relative flex items-center justify-center min-h-[480px]">
            <div
              className="absolute left-0 sm:left-8 top-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] bg-card/95 backdrop-blur-sm rounded-3xl p-6 border border-card-border/50 z-10"
              data-testid="before-section"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4">
                  <span className="text-7xl">🥀</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Before</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Mood swings that don't make sense
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Stuck in loops of overthinking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Stress and anxiety feel hard to manage
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Struggling to build helpful habits
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                <ArrowRight className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <div
              className="absolute right-0 sm:right-8 top-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border-2 border-primary/30 shadow-xl shadow-primary/10 z-30"
              data-testid="after-section"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4">
                  <span className="text-7xl">🌷</span>
                </div>
                <h3 className="text-xl font-bold text-black">After</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-black font-medium leading-snug">
                    Recognizing what affects your mood
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-black font-medium leading-snug">
                    Thoughts feel easier to navigate
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-black font-medium leading-snug">
                    Have with tools to sooth yourself
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-black font-medium leading-snug">
                    Follow routines that feel doable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-card-border/50 mb-10">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="text-3xl sm:text-4xl">🌿</div>
            <div className="text-center flex-1">
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                <span className="font-bold text-primary text-xl sm:text-2xl block mb-1">92% users</span>
                of users report feeling better after<br className="hidden sm:block" /> reading our guides
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">🌿</div>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Button 
            onClick={handleGetNow}
            size="lg" 
            className="w-full h-16 text-xl font-bold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40" 
            data-testid="button-get-now"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
