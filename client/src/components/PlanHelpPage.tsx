import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface PlanHelpPageProps {
  onContinue: () => void;
}

export default function PlanHelpPage({ onContinue }: PlanHelpPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 09 - Plan Help' });
  }, []);
  const experiences = [
    { emoji: '😰', text: 'Anxiety and panic attacks' },
    { emoji: '💔', text: 'Abandonment and trust issues' },
    { emoji: '😔', text: 'Low self-worth and self-doubt' },
    { emoji: '😡', text: 'Difficulty managing emotions' },
    { emoji: '🌊', text: 'Feeling overwhelmed easily' },
    { emoji: '🔒', text: 'Trouble opening up to others' },
  ];

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
            This plan will help if you experience
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-card-border/20 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`experience-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{exp.emoji}</div>
                  <p className="text-foreground font-medium text-sm text-left">
                    {exp.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-2xl p-5 border border-primary/30">
            <p className="text-foreground text-sm leading-relaxed">
              Our evidence-based program has helped thousands identify and heal from childhood trauma patterns. You deserve peace and freedom from these struggles.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-plan-help"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
