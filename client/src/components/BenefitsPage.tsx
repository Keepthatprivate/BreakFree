import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';
import { Shield, Heart, Sparkles } from 'lucide-react';

interface BenefitsPageProps {
  onContinue: () => void;
}

export default function BenefitsPage({ onContinue }: BenefitsPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 07 - Benefits' });
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: 'Feel Safe in Your Own Skin',
      description: 'Learn to calm your nervous system, understand your triggers, and finally feel at peace — even when life gets hard.',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400'
    },
    {
      icon: Heart,
      title: 'Build Trust & Let People In',
      description: 'Heal the wounds that keep you guarded. Create deeper, more fulfilling relationships without fear of being hurt again.',
      iconBg: 'bg-rose-500/15',
      iconColor: 'text-rose-400'
    },
    {
      icon: Sparkles,
      title: 'Release What Was Never Yours',
      description: "Let go of the shame, guilt, and patterns you inherited from childhood. It's time to write your own story.",
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-snug mb-3">
            Your Healing Journey Starts Here
          </h1>
          <p className="text-muted-foreground text-base">
            In 28 days, here's what becomes possible for you
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`benefit-card-${index}`}
              >
                <div className="flex items-center gap-4">
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

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-benefits"
          >
            Start My Healing Journey
          </button>
        </div>
      </div>
    </div>
  );
}
