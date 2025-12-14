import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface QuizAnswers {
  [questionId: string]: string[];
}

interface ResultsPageProps {
  userName: string;
  answers: QuizAnswers;
  onContinue: () => void;
}

export default function ResultsPage({ userName, answers, onContinue }: ResultsPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 06 - Results' });
  }, []);

  const handleGetNow = () => {
    onContinue();
  };

  const handleSkip = () => {
    console.log('Skip clicked');
  };

  // Calculate dynamic results based on answers
  const calculatePattern = () => {
    const patterns = {
      abandonment: 0,
      control: 0,
      emotional: 0,
      trust: 0,
    };

    Object.entries(answers).forEach(([questionId, values]) => {
      // Iterate through all selected values (handles multi-select questions)
      values.forEach(answer => {
        if (questionId === 'q2' && answer === 'yes') patterns.emotional += 1;
        if (questionId === 'q4') {
          if (answer === 'running-away') patterns.abandonment += 1;
          if (answer === 'crying-alone') patterns.emotional += 1;
          if (answer === 'hiding') patterns.trust += 1;
        }
        if (questionId === 'q6') {
          if (answer?.includes('overwhelmed')) patterns.emotional += 1;
          if (answer?.includes('stuck')) patterns.control += 1;
          if (answer?.includes('disconnected')) patterns.abandonment += 1;
          if (answer?.includes('numb')) patterns.trust += 1;
        }
        if (questionId === 'q8') {
          if (answer === 'scared') patterns.trust += 1;
          if (answer === 'relieved') patterns.abandonment += 1;
          if (answer === 'anxious') patterns.emotional += 1;
        }
        if (questionId === 'q9') {
          if (answer === 'waves') patterns.emotional += 1;
          if (answer === 'chaos') patterns.control += 1;
          if (answer === 'tree') patterns.trust += 1;
        }
      });
    });

    const primary = Object.entries(patterns).reduce((a, b) => 
      patterns[a[0] as keyof typeof patterns] > patterns[b[0] as keyof typeof patterns] ? a : b
    )[0];

    return primary;
  };

  const primaryPattern = calculatePattern();

  // Customize "before" states based on pattern
  const beforeStates = {
    abandonment: [
      'Fear of being left behind',
      'Difficulty trusting relationships',
      'Constant need for reassurance',
      'Panic when alone',
    ],
    control: [
      'Need to control everything',
      'Difficulty letting go',
      'Anxiety about uncertainty',
      'Rigid thinking patterns',
    ],
    emotional: [
      'Mood swings that don\'t make sense',
      'Stuck in loops of overthinking',
      'Stress and anxiety feel hard to manage',
      'Struggling to build helpful habits',
    ],
    trust: [
      'Difficulty opening up',
      'Hypervigilance in relationships',
      'Feeling unsafe in your body',
      'Walls up, even with loved ones',
    ],
  };

  const afterStates = {
    abandonment: [
      'Understanding your attachment style',
      'Building secure connections',
      'Finding comfort in solitude',
      'Trusting yourself and others',
    ],
    control: [
      'Embracing uncertainty with ease',
      'Letting go of what you can\'t control',
      'Flexible thinking patterns',
      'Peace with imperfection',
    ],
    emotional: [
      'Recognizing what affects your mood',
      'Thoughts feel easier to navigate',
      'Tools to soothe yourself',
      'Follow routines that feel doable',
    ],
    trust: [
      'Feeling safe in relationships',
      'Opening up at your own pace',
      'Reconnecting with your body',
      'Building trust step by step',
    ],
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Feel the difference
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            in just 7 days
          </p>
        </div>

        {/* Mobile: Stack cards vertically */}
        <div className="block sm:hidden mb-6 space-y-4">
          <div
            className="w-full bg-card/95 backdrop-blur-sm rounded-3xl p-5 border border-card-border/50"
            data-testid="before-section"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14 mb-2">
                <span className="text-4xl">🥀</span>
              </div>
              <h3 className="text-base font-bold text-foreground">Before</h3>
            </div>
            <div className="space-y-2">
              {beforeStates[primaryPattern as keyof typeof beforeStates].map((state, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-muted/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {state}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 rotate-90">
              <ArrowRight className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          <div
            className="w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-5 border-2 border-primary/30 shadow-xl shadow-primary/10"
            data-testid="after-section"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14 mb-2">
                <span className="text-4xl">🌷</span>
              </div>
              <h3 className="text-base font-bold text-black">After</h3>
            </div>
            <div className="space-y-2">
              {afterStates[primaryPattern as keyof typeof afterStates].map((state, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-2 h-2 text-primary" />
                  </div>
                  <p className="text-xs text-black font-medium leading-snug">
                    {state}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Side-by-side cards */}
        <div className="hidden sm:block relative mb-8 max-w-3xl mx-auto">
          <div className="relative flex items-center justify-center min-h-[480px]">
            <div
              className="absolute left-8 top-1/2 -translate-y-1/2 w-[300px] bg-card/95 backdrop-blur-sm rounded-3xl p-5 border border-card-border/50 z-10"
              data-testid="before-section-desktop"
            >
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 mb-3">
                  <span className="text-6xl">🥀</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Before</h3>
              </div>
              <div className="space-y-2.5">
                {beforeStates[primaryPattern as keyof typeof beforeStates].map((state, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-muted/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {state}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                <ArrowRight className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 w-[300px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-5 border-2 border-primary/30 shadow-xl shadow-primary/10 z-30"
              data-testid="after-section-desktop"
            >
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 mb-3">
                  <span className="text-6xl">🌷</span>
                </div>
                <h3 className="text-lg font-bold text-black">After</h3>
              </div>
              <div className="space-y-2.5">
                {afterStates[primaryPattern as keyof typeof afterStates].map((state, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <p className="text-sm text-black font-medium leading-snug">
                      {state}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm rounded-3xl p-5 sm:p-8 border border-card-border/50 mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="text-2xl sm:text-4xl">🌿</div>
            <div className="text-center flex-1">
              <p className="text-xs sm:text-base text-foreground leading-relaxed">
                <span className="font-bold text-primary text-lg sm:text-2xl block mb-1">92% users</span>
                of users report feeling better after reading our guides
              </p>
            </div>
            <div className="text-2xl sm:text-4xl">🌿</div>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Button 
            onClick={handleGetNow}
            size="lg" 
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40" 
            data-testid="button-get-now"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
