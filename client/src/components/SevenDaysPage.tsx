interface SevenDaysPageProps {
  onContinue: () => void;
}

export default function SevenDaysPage({ onContinue }: SevenDaysPageProps) {
  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-8">
            Feel the difference in just 7 days
          </h1>
          
          <div className="space-y-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-card-border/20">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-3 flex-shrink-0 shadow-lg">
                  <div className="text-3xl">✨</div>
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-lg font-bold text-foreground mb-2">Day 1-3: Awareness</h2>
                  <p className="text-foreground/70 text-sm leading-snug">
                    Begin recognizing patterns and triggers as you start your healing journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-card-border/20">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-3 flex-shrink-0 shadow-lg">
                  <div className="text-3xl">🌱</div>
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-lg font-bold text-foreground mb-2">Day 4-5: Growth</h2>
                  <p className="text-foreground/70 text-sm leading-snug">
                    Experience improved emotional regulation and reduced anxiety.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-card-border/20">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-3 flex-shrink-0 shadow-lg">
                  <div className="text-3xl">🦋</div>
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-lg font-bold text-foreground mb-2">Day 6-7: Transformation</h2>
                  <p className="text-foreground/70 text-sm leading-snug">
                    Feel lighter, more at peace, and ready to continue your healing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-seven-days"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
