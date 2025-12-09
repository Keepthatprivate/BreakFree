import { ArrowRight, Check, X } from 'lucide-react';
import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface UpsellPageProps {
  onAccept: () => void;
  onSkip: () => void;
}

export default function UpsellPage({ onAccept, onSkip }: UpsellPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 15 - Upsell Guides' });
  }, []);

  const beforeItems = [
    'Unsure why your mood changes',
    'Overthinking or feeling stuck',
    'No clear way to handle stress or anxiety',
    'Struggling to build helpful habits'
  ];

  const afterItems = [
    'In tune with your emotions',
    'Aware of your patterns and triggers',
    'Equipped with tools to reset your mood',
    'Building habits that support your mind'
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background" />
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Buy Plan</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-primary"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-xs sm:text-sm">2</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Add Offer</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-foreground/30"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-card-border flex items-center justify-center">
              <span className="text-foreground/50 font-bold text-xs sm:text-sm">3</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground/50 font-medium hidden sm:block">Sign Up</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-foreground/30"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-card-border flex items-center justify-center">
              <span className="text-foreground/50 font-bold text-xs sm:text-sm">4</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground/50 font-medium hidden sm:block">Enjoy Breeze</span>
          </div>
        </div>

        {/* One-time offer badge */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-primary/20 border border-primary/50 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            <span className="text-primary font-semibold text-xs sm:text-sm" data-testid="badge-one-time-offer">
              ONE-TIME OFFER
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Get Your Personal Mental Well-Being Guides
          </h1>
        </div>

        {/* Before/After Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative">
          {/* Before Card */}
          <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-6 border border-card-border/30" data-testid="card-before">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">😔</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-foreground text-center mb-4">Before</h3>
            
            <ul className="space-y-3">
              {beforeItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80 text-sm leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow - Hidden on mobile */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <ArrowRight className="w-5 h-5 text-background" />
            </div>
          </div>

          {/* After Card */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-primary/30 relative" data-testid="card-after">
            {/* Discount badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary rounded-full px-4 py-1">
              <span className="text-background font-bold text-xs">42% OFF / 2 GUIDES</span>
            </div>

            <div className="flex justify-center mb-6 mt-2">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">🌸</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-foreground text-center mb-4">After</h3>
            
            <ul className="space-y-3">
              {afterItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80 text-sm leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lifetime access */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-foreground/80 text-sm font-medium" data-testid="text-lifetime-access">
            Lifetime access
          </span>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <p className="text-foreground text-base mb-1">
            One-time offer for{' '}
            <span className="text-primary font-bold text-xl">$14.99</span>{' '}
            <span className="text-foreground/50 line-through text-sm">$25.98</span>
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-card-border/30 mb-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="text-2xl sm:text-4xl">🌿</div>
            <div className="text-center flex-1">
              <p className="text-primary font-bold text-lg sm:text-2xl mb-1">92% users</p>
              <p className="text-foreground/70 text-xs sm:text-sm">
                report improved emotional well-being after reading the guide
              </p>
            </div>
            <div className="text-2xl sm:text-4xl">🌿</div>
          </div>
        </div>

        {/* First CTA */}
        <div className="mb-6">
          <button
            onClick={onAccept}
            className="w-full bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-get-now"
          >
            Get Now
          </button>
        </div>

        {/* Guide Benefits Section */}
        <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-5 border border-card-border/20 mb-6">
          <p className="text-foreground/90 text-sm sm:text-base text-center mb-4 font-medium">
            Inside, you'll discover:
          </p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground/80 text-sm leading-relaxed">
                Why certain triggers keep repeating in your life
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground/80 text-sm leading-relaxed">
                How childhood patterns shape adult behavior
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground/80 text-sm leading-relaxed">
                Simple exercises to start healing today
              </span>
            </li>
          </ul>
          <p className="text-foreground/60 text-xs sm:text-sm text-center italic">
            It's the exact roadmap most people wish they had years earlier.
          </p>
        </div>

        {/* Second CTAs */}
        <div className="space-y-4">
          <button
            onClick={onAccept}
            className="w-full bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-get-now-bottom"
          >
            Get Now
          </button>
          
          <button
            onClick={onSkip}
            className="w-full text-foreground/70 hover:text-foreground font-medium text-base transition-colors"
            data-testid="button-skip"
          >
            Skip and continue
          </button>
        </div>
      </div>
    </div>
  );
}
