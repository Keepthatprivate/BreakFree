import { Star, Users, Shield, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface TrustPageProps {
  onContinue: () => void;
}

export default function TrustPage({ onContinue }: TrustPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 10 - Trust & Stats' });
  }, []);

  const trustStats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'People healing',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400'
    },
    {
      icon: Star,
      number: '4.9/5',
      label: 'Average rating',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400'
    },
    {
      icon: Heart,
      number: '94%',
      label: 'Feel better in 7 days',
      iconBg: 'bg-rose-500/15',
      iconColor: 'text-rose-400'
    },
    {
      icon: Shield,
      number: '100%',
      label: 'Privacy guaranteed',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400'
    },
  ];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            Trusted by thousands
          </h1>
          <p className="text-muted-foreground text-base">
            Join others on their healing journey
          </p>
        </div>
          
        <div className="grid grid-cols-2 gap-3 mb-8">
          {trustStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-card-border/30 text-center animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`trust-stat-${index}`}
              >
                <div className={`${stat.iconBg} rounded-xl p-3 inline-flex mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-sm">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border/30 mb-8">
          <p className="text-foreground text-sm leading-relaxed italic text-center">
            "I never thought I could feel this free from my past. The 28-day plan changed everything."
          </p>
          <p className="text-muted-foreground text-xs mt-3 text-center font-medium">
            — Sarah M.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-trust"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
