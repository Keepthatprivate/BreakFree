import { Check, Lock, Bell, Shield } from 'lucide-react';

interface TrialTimelineProps {
  onStartTrial: () => void;
  onContinue?: () => void;
}

export default function TrialTimeline({ onStartTrial, onContinue }: TrialTimelineProps) {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      onStartTrial();
    }
  };
  const steps = [
    {
      icon: Check,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/20',
      title: 'Sign up for BreakFree App',
      titleColor: 'text-primary',
      description: 'You have successfully started your journey towards a more resilient and trauma-free version of yourself.'
    },
    {
      icon: Lock,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/20',
      title: 'Today',
      titleColor: 'text-primary',
      description: 'Enjoy full access to all the premium content.'
    },
    {
      icon: Bell,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/20',
      title: 'Day 5',
      titleColor: 'text-primary',
      description: 'Reminder about the end of a trial period. Cancel it anytime in a few seconds.'
    },
    {
      icon: Shield,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      title: 'Day 7',
      titleColor: 'text-blue-400',
      description: 'Your trial will be converted to a full price unless it is canceled'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="bg-card/50 rounded-3xl p-8 sm:p-10 border border-card-border/50 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            How your trial works
          </h2>

          {/* Timeline */}
          <div className="relative mb-10">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/30"></div>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative flex gap-4 animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`timeline-step-${index}`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center z-10`}>
                      <Icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h3 className={`text-lg font-bold ${step.titleColor} mb-1`}>
                        {step.title}
                      </h3>
                      <p className="text-foreground/80 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing sections */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Total today</h3>
              
              <div className="bg-background/50 rounded-xl p-4 border border-card-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-foreground">7-day trial</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">€0.14</span>
                    <span className="text-sm text-muted-foreground">/per day</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-blue-400">Billed at €1.00</span>
                </div>
              </div>

              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">
                You'll have a full <span className="font-semibold text-foreground">7 days</span> to experience how BreakFree App can improve your life.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Price after trial</h3>
              
              <div className="bg-background/50 rounded-xl p-4 border border-card-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-foreground">4-weeks plan</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">€0.99</span>
                    <span className="text-sm text-muted-foreground">/per day</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-blue-400">Billed at €29.99/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto min-w-[320px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-start-trial"
          >
            Get my result and plan
          </button>
        </div>
      </div>
    </div>
  );
}
