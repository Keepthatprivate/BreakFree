import { Star, Users, Shield, Heart } from 'lucide-react';

interface TrustPageProps {
  onContinue: () => void;
}

export default function TrustPage({ onContinue }: TrustPageProps) {
  const trustStats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'People healing',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Star,
      number: '4.9/5',
      label: 'Average rating',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Heart,
      number: '94%',
      label: 'Feel better in 7 days',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: Shield,
      number: '100%',
      label: 'Privacy guaranteed',
      color: 'from-green-400 to-emerald-500'
    },
  ];

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-8">
            People trust us
          </h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {trustStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card/80 backdrop-blur-sm rounded-3xl p-5 border border-card-border/20 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-testid={`trust-stat-${index}`}
                >
                  <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-3 inline-flex mb-3 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {stat.number}
                  </div>
                  <p className="text-foreground/70 text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-5 border border-purple-500/30">
            <p className="text-foreground text-sm leading-relaxed italic">
              "I never thought I could feel this free from my past. The 28-day plan changed everything for me."
            </p>
            <p className="text-primary text-xs mt-2 font-medium">
              - Sarah M., verified user
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
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
