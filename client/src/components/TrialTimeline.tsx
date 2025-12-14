import { Check, Unlock, Bell, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface TrialTimelineProps {
  onStartTrial: () => void;
}

export default function TrialTimeline({ onStartTrial }: TrialTimelineProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 12 - Trial Timeline' });
  }, []);

  const steps = [
    {
      icon: Check,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      title: 'Sign up',
      description: 'Start your journey towards healing.'
    },
    {
      icon: Unlock,
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
      title: 'Today',
      description: 'Full access to all premium content.'
    },
    {
      icon: Bell,
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      title: 'Day 5',
      description: 'Reminder before trial ends. Cancel anytime.'
    },
    {
      icon: Calendar,
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      title: 'Day 7',
      description: 'Trial converts to full plan if not canceled.'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            How your trial works
          </h1>
          <p className="text-muted-foreground text-base">
            Simple and transparent
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 sm:p-6 border border-card-border/30 mb-6">
          <div className="relative">
            <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-card-border/50"></div>

            <div className="space-y-5">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative flex gap-4 animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`timeline-step-${index}`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center z-10`}>
                      <Icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h3 className="text-base font-semibold text-foreground mb-0.5">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-card rounded-2xl p-5 border border-card-border/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-foreground">Today</h3>
                <p className="text-sm text-muted-foreground">7-day trial</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">$1</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Full access for 7 days
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-card-border/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-foreground">After trial</h3>
                <p className="text-sm text-muted-foreground">Monthly plan</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">$29.99</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Cancel anytime before Day 7
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartTrial}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-start-trial"
          >
            Start my 7-day trial
          </button>
        </div>
      </div>
    </div>
  );
}
