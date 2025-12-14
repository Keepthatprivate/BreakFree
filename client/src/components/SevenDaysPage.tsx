import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';
import { Eye, TrendingUp, Sunrise } from 'lucide-react';

interface SevenDaysPageProps {
  onContinue: () => void;
}

export default function SevenDaysPage({ onContinue }: SevenDaysPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 08 - Seven Days Preview' });
  }, []);

  const timeline = [
    {
      icon: Eye,
      days: 'Day 1-3',
      title: 'Awareness',
      description: 'Recognize patterns and triggers that have been holding you back.',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400'
    },
    {
      icon: TrendingUp,
      days: 'Day 4-5',
      title: 'Growth',
      description: 'Experience improved emotional regulation and reduced anxiety.',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400'
    },
    {
      icon: Sunrise,
      days: 'Day 6-7',
      title: 'Transformation',
      description: 'Feel lighter, more at peace, and ready to continue healing.',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            Feel the difference in 7 days
          </h1>
          <p className="text-muted-foreground text-base">
            Your transformation timeline
          </p>
        </div>
          
        <div className="space-y-4 mb-8">
          {timeline.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`timeline-step-${index}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${step.iconBg} rounded-xl p-3 flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${step.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{step.days}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
