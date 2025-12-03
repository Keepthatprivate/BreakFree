import { BookOpen, Heart, Feather, Calendar, BarChart3, Shield, FileText, Download, Check } from 'lucide-react';

interface HealingJournalPageProps {
  onAccept: () => void;
  onSkip: () => void;
}

export default function HealingJournalPage({ onAccept, onSkip }: HealingJournalPageProps) {
  const journalContents = [
    { icon: Feather, text: '30 Guided Prompts' },
    { icon: Heart, text: 'Grounding Pages' },
    { icon: FileText, text: 'Letter to Younger Self' },
    { icon: Calendar, text: 'Weekly Check-ins' },
    { icon: BarChart3, text: 'Emotional Tracking' },
    { icon: Shield, text: 'Boundary Templates' },
  ];

  const whyJournaling = [
    "Unlocks emotions that stay hidden",
    "Removes the overwhelm of 'where to start'",
    "10 minutes a day creates lasting change"
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

        {/* Wait badge */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-primary/20 border border-primary/50 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            <span className="text-primary font-semibold text-xs sm:text-sm" data-testid="badge-wait">
              WAIT — BEFORE YOU GO
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
            Start Healing With One Simple Step
          </h1>
          <p className="text-foreground/70 text-sm sm:text-base">
            A gentle, guided journal to reconnect with yourself
          </p>
        </div>

        {/* Journal Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-primary/30 relative mb-6">
          {/* Header with icon */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg">Inner Child Journal</h2>
              <p className="text-foreground/60 text-sm">Printable PDF • Use Forever</p>
            </div>
          </div>
          
          {/* Journal Contents Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {journalContents.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 p-2.5 bg-card/60 rounded-xl border border-card-border/30"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground text-xs sm:text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Instant Download */}
          <div className="flex items-center gap-2.5 p-3 bg-primary/10 rounded-xl border border-primary/30">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-background" />
            </div>
            <span className="text-foreground text-sm font-medium flex-1">Instant Download</span>
            <Check className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Why Journaling Section */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-card-border/30 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Why Journaling Heals
          </h3>
          <ul className="space-y-2.5">
            {whyJournaling.map((reason, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-foreground/80 text-sm leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <p className="text-foreground text-base mb-1">
            One-time offer for{' '}
            <span className="text-primary font-bold text-xl">$14.99</span>
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <button
            onClick={onAccept}
            className="w-full bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2"
            data-testid="button-accept-journal"
          >
            <BookOpen className="w-5 h-5" />
            Get the Journal — $14.99
          </button>
          
          <button
            onClick={onSkip}
            className="w-full text-foreground/70 hover:text-foreground font-medium text-base transition-colors"
            data-testid="button-skip-journal"
          >
            Skip this offer
          </button>
        </div>
      </div>
    </div>
  );
}
