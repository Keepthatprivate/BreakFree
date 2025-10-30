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

        <div className="relative bg-card/50 rounded-3xl p-8 sm:p-12 border border-card-border/50 mb-8">
          {/* Graph Container */}
          <div className="relative h-80 sm:h-96">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-t border-muted/20"></div>
              <div className="border-t border-muted/20"></div>
              <div className="border-t border-muted/20"></div>
              <div className="border-t border-muted/20"></div>
            </div>

            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-muted/30"></div>
            <div className="absolute right-0 top-8 bottom-16 w-px border-l-2 border-dashed border-primary/40"></div>

            {/* SVG Curves */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
              {/* Trauma Impact - Decreasing curve (Purple) */}
              <path
                d="M 0 60 Q 100 80 200 140 T 400 240"
                fill="none"
                stroke="rgb(168, 85, 247)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              
              {/* Self-acceptance - Increasing curve (Mint Green) */}
              <path
                d="M 0 260 Q 100 240 200 180 T 400 60"
                fill="none"
                stroke="rgb(74, 222, 128)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Start point */}
              <circle cx="0" cy="260" r="8" fill="white" stroke="rgb(74, 222, 128)" strokeWidth="2" />
              
              {/* Intersection point */}
              <circle cx="200" cy="160" r="8" fill="rgb(168, 85, 247)" />
              
              {/* End point */}
              <circle cx="400" cy="60" r="10" fill="rgb(74, 222, 128)" />
            </svg>

            {/* Labels */}
            <div className="absolute right-4 top-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-card-border/50">
              <p className="text-sm font-medium text-foreground">Self-acceptance</p>
              <p className="text-sm font-medium text-foreground">and inner peace</p>
            </div>

            <div className="absolute right-4 bottom-20 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-card-border/50">
              <p className="text-sm font-medium text-foreground">Trauma</p>
              <p className="text-sm font-medium text-foreground">impact</p>
            </div>

            {/* You are here marker */}
            <div className="absolute left-0 bottom-8">
              <p className="text-xs text-muted-foreground">You are here</p>
            </div>

            {/* Day 30 marker */}
            <div className="absolute right-0 bottom-8 text-right">
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
