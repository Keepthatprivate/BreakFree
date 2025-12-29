import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';
import { ScanEye, Repeat, KeyRound, Clock } from 'lucide-react';

interface SevenDaysPageProps {
  onContinue: () => void;
}

export default function SevenDaysPage({ onContinue }: SevenDaysPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 08 - 28 Day Plan Preview' });
  }, []);

  const benefits = [
    {
      icon: ScanEye,
      title: 'Understand your reactions',
      description: 'Why a small comment can ruin your whole day. Where that sudden anger really comes from.',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Repeat,
      title: 'Break the patterns you keep repeating',
      description: 'Why you attract the same relationships. Why you self-sabotage when things go well.',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400'
    },
    {
      icon: KeyRound,
      title: 'Become who you were meant to be',
      description: 'Stop replaying old scenes. Become the adult your inner child needed.',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>10 min/day</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
            Healing the wounds you've carried since childhood
          </h1>
          <p className="text-muted-foreground text-base">
            A 28-day path to finally understand — and release — what's been holding you back
          </p>
        </div>
          
        <div className="space-y-4 mb-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`benefit-block-${index}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${benefit.iconBg} rounded-xl p-3 flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${benefit.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card/50 rounded-xl p-4 border border-card-border/20 mb-8">
          <p className="text-muted-foreground text-sm text-center italic">
            Day 1 starts with an 8-minute exercise to identify your core wound
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-start-healing-journey"
          >
            Start my healing journey
          </button>
        </div>
      </div>
    </div>
  );
}
