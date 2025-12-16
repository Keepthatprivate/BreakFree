import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';
import { AlertCircle, HeartCrack, UserX, Flame, Waves, Lock, Check } from 'lucide-react';

interface PlanHelpPageProps {
  onContinue: () => void;
}

export default function PlanHelpPage({ onContinue }: PlanHelpPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 09 - Plan Help' });
  }, []);

  const experiences = [
    { icon: AlertCircle, text: 'Anxiety and panic attacks', color: 'text-orange-400' },
    { icon: HeartCrack, text: 'Abandonment and trust issues', color: 'text-rose-400' },
    { icon: UserX, text: 'Low self-worth and self-doubt', color: 'text-slate-400' },
    { icon: Flame, text: 'Difficulty managing emotions', color: 'text-red-400' },
    { icon: Waves, text: 'Feeling overwhelmed easily', color: 'text-blue-400' },
    { icon: Lock, text: 'Trouble opening up to others', color: 'text-violet-400' },
  ];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            This plan helps with
          </h1>
          <p className="text-muted-foreground text-base">
            Common signs of childhood trauma
          </p>
        </div>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`experience-${index}`}
              >
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-foreground font-medium text-sm text-left">
                    {exp.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-2xl p-5 border border-primary/20 mb-8">
          <p className="text-muted-foreground text-sm leading-relaxed text-center">
            Our evidence-based program has helped <span className="text-foreground font-medium">thousands</span> heal from childhood trauma patterns.
          </p>
        </div>

        <div className="text-center">
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
