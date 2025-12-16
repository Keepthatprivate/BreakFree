import { Check, Shield, Heart, Brain, Users, BookOpen, Star, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface MasterclassBundlePageProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function MasterclassBundlePage({ onAccept, onDecline }: MasterclassBundlePageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 16 - Masterclass Bundle' });
  }, []);

  const masterclasses = [
    { icon: Heart, title: 'Inner Child Healing' },
    { icon: Users, title: 'Attachment Style Deep-Dive' },
    { icon: Brain, title: 'Emotional Regulation' },
    { icon: Star, title: 'Self-Worth Rebuilding' },
    { icon: Shield, title: 'Boundaries & Communication' },
  ];

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
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
            <span className="text-primary font-semibold text-xs sm:text-sm" data-testid="badge-exclusive-offer">
              EXCLUSIVE BUNDLE OFFER
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
            Break Free From What's Holding You Back
          </h1>
          <p className="text-foreground/70 text-sm sm:text-base">
            Transform pain into power with our complete masterclass bundle
          </p>
        </div>

        {/* Quote Card */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-card-border/30 mb-6">
          <p className="text-foreground/80 text-sm sm:text-base text-center italic leading-relaxed">
            "The patterns keeping you stuck were learned for survival. 
            Now it's time to unlearn them and <span className="text-primary font-semibold">reclaim your life</span>."
          </p>
        </div>

        {/* Masterclasses List */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-primary/30 relative mb-6">
          {/* Discount badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary rounded-full px-4 py-1">
            <span className="text-background font-bold text-xs">65% OFF</span>
          </div>

          <h2 className="text-lg font-bold text-foreground mb-4 text-center mt-2 flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            5 Transformative Masterclasses
          </h2>
          
          <ul className="space-y-3 mb-4">
            {masterclasses.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground text-sm sm:text-base font-medium flex-1">{item.title}</span>
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
              </li>
            ))}
          </ul>

          {/* Bonus */}
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-background" />
            </div>
            <span className="text-foreground text-sm sm:text-base font-medium flex-1">BONUS: Printable Workbook</span>
            <span className="text-xs font-bold bg-primary text-background px-2 py-1 rounded-full">FREE</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <p className="text-foreground/50 text-sm line-through mb-1">Total Value: $199+</p>
          <p className="text-foreground text-base mb-1">
            Today only for{' '}
            <span className="text-primary font-bold text-2xl sm:text-3xl">$69</span>
          </p>
          <p className="text-foreground/60 text-sm">One-time payment • Lifetime access</p>
        </div>

        {/* Guarantee */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-foreground/80 text-sm font-medium" data-testid="text-guarantee">
            30-Day Money-Back Guarantee
          </span>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <button
            onClick={onAccept}
            className="w-full bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2"
            data-testid="button-accept-masterclass"
          >
            YES — I Want the Bundle
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onDecline}
            className="w-full text-foreground/70 hover:text-foreground font-medium text-base transition-colors"
            data-testid="button-decline-masterclass"
          >
            No thanks, I'll pass
          </button>
        </div>

        <p className="text-xs text-foreground/40 text-center mt-6">
          Educational content only. Not a replacement for therapy.
        </p>
      </div>
    </div>
  );
}
