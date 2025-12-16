interface PersonalizedJourneyProps {
  onContinue: () => void;
}

export default function PersonalizedJourney({ onContinue }: PersonalizedJourneyProps) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            We prepared a personalized plan to empower your healing journey
          </h1>
        </div>

        <div className="relative bg-card/30 rounded-3xl p-6 sm:p-12 border border-card-border/30 mb-8">
          {/* Graph Container */}
          <div className="relative h-[400px] sm:h-[480px]">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4">
              <div className="border-t border-muted/8"></div>
              <div className="border-t border-muted/8"></div>
              <div className="border-t border-muted/8"></div>
              <div className="border-t border-muted/8"></div>
              <div className="border-t border-muted/8"></div>
            </div>

            {/* Vertical dashed line at Day 30 */}
            <div className="absolute right-12 top-4 bottom-20 w-px border-l-2 border-dashed border-primary/40"></div>

            {/* SVG Curves */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" preserveAspectRatio="none">
              <defs>
                {/* Purple gradient for trauma curve glow */}
                <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(139, 92, 246)" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                </linearGradient>
                
                {/* Cyan gradient for acceptance curve glow */}
                <linearGradient id="cyanGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                  <stop offset="100%" stopColor="rgb(6, 182, 212)" />
                </linearGradient>
              </defs>

              {/* Trauma Impact - Purple curve (starts HIGH left, ends LOW right) */}
              <path
                d="M 40 80 C 120 85, 180 125, 250 200 C 300 250, 360 300, 420 340"
                fill="none"
                stroke="url(#purpleGlow)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
              
              {/* Self-acceptance - Cyan curve (starts LOW left, ends HIGH right) */}
              <path
                d="M 40 340 C 120 325, 180 275, 250 200 C 300 150, 360 100, 420 60"
                fill="none"
                stroke="url(#cyanGlow)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Start markers (Day 0) */}
              <circle cx="40" cy="340" r="6" fill="white" stroke="rgb(6, 182, 212)" strokeWidth="2" />
              
              {/* Intersection point - where curves actually cross */}
              <circle cx="250" cy="200" r="8" fill="white" stroke="rgb(139, 92, 246)" strokeWidth="2" />
              
              {/* End markers (Day 30) */}
              <circle cx="420" cy="60" r="10" fill="rgb(6, 182, 212)" stroke="white" strokeWidth="2" />
              <circle cx="420" cy="340" r="8" fill="rgb(139, 92, 246)" stroke="white" strokeWidth="2" />
            </svg>

            {/* Label boxes */}
            <div className="absolute right-16 top-12 bg-card/95 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-card-border/60 shadow-lg animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
              <p className="text-sm font-medium text-foreground whitespace-nowrap">Self-acceptance</p>
              <p className="text-sm font-medium text-foreground whitespace-nowrap">and inner peace</p>
            </div>

            <div className="absolute right-16 bottom-32 bg-card/95 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-card-border/60 shadow-lg animate-in fade-in slide-in-from-right-4 duration-500 delay-500">
              <p className="text-sm font-medium text-foreground whitespace-nowrap">Trauma</p>
              <p className="text-sm font-medium text-foreground whitespace-nowrap">impact</p>
            </div>

            {/* "You are here" marker at bottom left */}
            <div className="absolute left-6 bottom-12">
              <p className="text-xs text-muted-foreground">You are here</p>
            </div>

            {/* Day 30 marker at bottom right - aligned with dashed line */}
            <div className="absolute right-12 bottom-12 flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary mb-1.5"></div>
              <p className="text-sm font-bold text-primary">Day 30</p>
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
