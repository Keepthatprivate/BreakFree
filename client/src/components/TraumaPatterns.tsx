import { useState, useEffect } from 'react';
import { Heart, Bird, Users, Moon } from 'lucide-react';

interface TraumaPatternsProps {
  onContinue: () => void;
}

export default function TraumaPatterns({ onContinue }: TraumaPatternsProps) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 12, seconds: 43 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Stop the timer when it reaches 00:00
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const patterns = [
    {
      title: 'Emotional Vulnerability:',
      icon: Heart,
      iconBg: 'bg-gradient-to-br from-pink-400 to-red-400',
      items: [
        'Difficulty sharing feelings openly and honestly',
        'Struggling with self-esteem and self-worth',
        'Dealing with the aftermath of toxic or abusive relationships',
        'Feeling a lack of support and understanding from others'
      ]
    },
    {
      title: 'Feeling Stuck in Growth:',
      icon: Bird,
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-400',
      items: [
        'Uncertainty and indecisiveness regarding career choices',
        'Difficulty finding passion and purpose in life',
        'Feeling trapped in a life situation that brings no fulfillment',
        'Fear of taking risks and stepping outside of comfort zones'
      ]
    },
    {
      title: 'Relationship Problems:',
      icon: Users,
      iconBg: 'bg-gradient-to-br from-orange-400 to-yellow-400',
      items: [
        'Toxic relationship dynamics and patterns',
        'Difficulty establishing and maintaining healthy boundaries',
        'Communication breakdowns and constant conflicts',
        'Feeling disconnected and emotionally distant from a partner'
      ]
    },
    {
      title: 'Insomnia and Stress:',
      icon: Moon,
      iconBg: 'bg-gradient-to-br from-cyan-400 to-teal-400',
      items: [
        'Chronic sleeplessness and difficulty falling or staying asleep',
        'Overwhelming stress from work, personal life, or both',
        'Anxiety and racing thoughts that interfere with rest and relaxation',
        'Inability to manage stress effectively, leading to physical and mental exhaustion'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Countdown Timer Banner */}
      <div className="bg-card/20 border-b border-primary/30 py-3">
        <div className="text-center">
          <p className="text-primary font-medium text-sm sm:text-base" data-testid="countdown-timer">
            7-day Trial offer expires in {timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 w-full">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 leading-tight">
              This plan will help if you experience
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {patterns.map((pattern, index) => {
              const Icon = pattern.icon;
              return (
                <div
                  key={index}
                  className="bg-card/60 backdrop-blur-sm rounded-2xl p-7 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-testid={`pattern-card-${index}`}
                >
                  <div className="flex flex-col items-center text-center mb-5">
                    {/* Icon Circle */}
                    <div className={`w-14 h-14 rounded-full ${pattern.iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{pattern.title}</h2>
                  </div>
                  
                  <ul className="space-y-3">
                    {pattern.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2.5">
                        <span className="text-foreground/50 text-xs mt-1.5">◆</span>
                        <span className="text-foreground/70 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={onContinue}
              className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
              data-testid="button-continue-patterns"
            >
              Get my result and plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
