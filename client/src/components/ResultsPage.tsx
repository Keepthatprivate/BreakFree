import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';
import { useState } from 'react';

interface ResultsPageProps {
  userName: string;
}

export default function ResultsPage({ userName }: ResultsPageProps) {
  const handleGetNow = () => {
    console.log('Get Now clicked');
  };

  const handleSkip = () => {
    console.log('Skip clicked');
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <div className="inline-block bg-primary/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <span className="text-primary font-bold text-sm tracking-wide">ONE-TIME OFFER</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
            Get Your Personal Mental<br />Well-Being Guides
          </h1>
          
          <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-purple-500/30">
            <span className="text-foreground font-bold text-sm">42% OFF / 2 GUIDES</span>
          </div>
        </div>

        <div className="relative mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            <div
              className="bg-gradient-to-br from-rose-100/10 to-orange-100/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-rose-200/20"
              data-testid="before-section"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-card/20 backdrop-blur-sm" />
                  <span className="text-6xl sm:text-7xl relative z-10">😔</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Before</h3>
              </div>
              <div className="space-y-3 bg-rose-50/5 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unsure why your mood changes
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overthinking or feeling stuck
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No clear way to handle stress or anxiety
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Struggling to build helpful habits
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                <ArrowRight className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <div
              className="bg-gradient-to-br from-purple-100/10 to-blue-100/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-purple-200/30 shadow-lg shadow-purple-500/10"
              data-testid="after-section"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-card/20 backdrop-blur-sm" />
                  <span className="text-6xl sm:text-7xl relative z-10">🌸</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">After</h3>
              </div>
              <div className="space-y-3 bg-purple-50/5 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    In tune with your emotions
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Aware of your patterns and triggers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Equipped with tools to reset your mood
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Building habits that support your mind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">Lifetime access</span>
          </div>
          <p className="text-base text-foreground mb-1">
            One-time offer for{' '}
            <span className="text-2xl font-bold text-primary">€14.99</span>{' '}
            <span className="text-muted-foreground line-through">€25.98</span>
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-card-border/50 mb-8">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="text-3xl sm:text-4xl">🌿</div>
            <div className="text-center flex-1">
              <p className="text-sm sm:text-base text-foreground">
                <span className="font-bold text-primary text-xl sm:text-2xl">92%</span> users<br className="sm:hidden" /> report improved emotional well-being after reading the guide
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">🌿</div>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            data-testid="button-skip"
          >
            Skip and continue
          </button>
          
          <Button 
            onClick={handleGetNow}
            size="lg" 
            className="w-full h-16 text-lg font-bold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40" 
            data-testid="button-get-now"
          >
            Get Now
          </Button>
        </div>
      </div>
    </div>
  );
}
