interface PersonalizedJourneyProps {
  onContinue: () => void;
}

export default function PersonalizedJourney({ onContinue }: PersonalizedJourneyProps) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            We prepared a personalized plan to empower your healing journey
          </h1>
        </div>

        <div className="relative bg-card/50 rounded-3xl p-6 sm:p-10 border border-card-border/50 mb-8">
          {/* Graph Container */}
          <div className="relative h-96 sm:h-[450px]">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-8">
              <div className="border-t border-muted/10"></div>
              <div className="border-t border-muted/10"></div>
              <div className="border-t border-muted/10"></div>
              <div className="border-t border-muted/10"></div>
              <div className="border-t border-muted/10"></div>
            </div>

            {/* Y-axis */}
            <div className="absolute left-0 top-8 bottom-14 w-px bg-muted/40"></div>

            {/* X-axis */}
            <div className="absolute left-0 right-0 bottom-14 h-px bg-muted/40"></div>

            {/* SVG Curves with Area Fills */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 450 400" preserveAspectRatio="none">
              <defs>
                {/* Gradient for Trauma Impact area */}
                <linearGradient id="traumaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.03" />
                </linearGradient>
                
                {/* Gradient for Self-acceptance area */}
                <linearGradient id="acceptanceGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Trauma Impact - Decreasing curve (starts HIGH, ends LOW) */}
              <path
                d="M 30 60 C 100 65, 150 90, 200 135 C 250 180, 300 240, 350 285 C 380 310, 400 320, 420 330 L 420 350 L 30 350 Z"
                fill="url(#traumaGradient)"
              />
              <path
                d="M 30 60 C 100 65, 150 90, 200 135 C 250 180, 300 240, 350 285 C 380 310, 400 320, 420 330"
                fill="none"
                stroke="rgb(168, 85, 247)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              
              {/* Self-acceptance - Increasing curve (starts LOW, ends HIGH) */}
              <path
                d="M 30 330 C 100 325, 150 305, 200 260 C 250 215, 300 155, 350 100 C 380 70, 400 55, 420 45 L 420 350 L 30 350 Z"
                fill="url(#acceptanceGradient)"
              />
              <path
                d="M 30 330 C 100 325, 150 305, 200 260 C 250 215, 300 155, 350 100 C 380 70, 400 55, 420 45"
                fill="none"
                stroke="rgb(74, 222, 128)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Day 0 markers */}
              <circle cx="30" cy="60" r="7" fill="rgb(168, 85, 247)" stroke="white" strokeWidth="2" />
              <circle cx="30" cy="330" r="7" fill="rgb(74, 222, 128)" stroke="white" strokeWidth="2" />
              
              {/* Day 30 markers */}
              <circle cx="420" cy="330" r="6" fill="rgb(168, 85, 247)" />
              <circle cx="420" cy="45" r="7" fill="rgb(74, 222, 128)" stroke="white" strokeWidth="2" />
            </svg>

            {/* Curve Labels */}
            <div className="absolute left-12 top-16 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <p className="text-xs sm:text-sm font-semibold text-purple-400">Trauma impact</p>
            </div>

            <div className="absolute left-12 bottom-24 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <p className="text-xs sm:text-sm font-semibold text-green-400">Self-acceptance</p>
            </div>

            {/* Day 0 marker */}
            <div className="absolute left-0 bottom-8">
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-muted/50 mb-1"></div>
                <p className="text-xs sm:text-sm font-bold text-foreground">Day 0</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">You are here</p>
              </div>
            </div>

            {/* Day 30 marker */}
            <div className="absolute right-0 bottom-8">
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-primary/50 mb-1"></div>
                <p className="text-xs sm:text-sm font-bold text-primary">Day 30</p>
                <p className="text-[10px] sm:text-xs text-primary/70 mt-0.5">Your goal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-journey"
          >
            Get my result and plan
          </button>
        </div>
      </div>
    </div>
  );
}
