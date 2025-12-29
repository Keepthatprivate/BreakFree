import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';
import EmbeddedCheckoutPage from './EmbeddedCheckoutPage';

interface DonationPageProps {
  userName: string;
  email?: string;
  onContinue: (donationAmount?: number) => void;
}

export default function DonationPage({ userName, email, onContinue }: DonationPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 05 - Donation' });
  }, []);

  const [selectedDonation, setSelectedDonation] = useState<number>(9.99);
  const [showCheckout, setShowCheckout] = useState(false);

  const firstName = userName?.split(' ')[0] || 'there';

  const donationAmounts = [
    { amount: 1, label: '$1' },
    { amount: 4.99, label: '$4.99' },
    { amount: 9.99, label: '$9.99' },
  ];

  const handleDonationClick = (amount: number) => {
    setSelectedDonation(amount);
  };

  const handleContinue = () => {
    console.log('Donation selected:', selectedDonation);
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <EmbeddedCheckoutPage
        amount={selectedDonation}
        productType="donation"
        productName="Donation"
        email={email || ''}
        name={userName}
        onBack={() => setShowCheckout(false)}
        returnUrl={`${window.location.origin}/quiz?state=results&donation_success=true`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
        <div className="mb-6">
          {/* Personal greeting */}
          <p className="text-primary text-sm sm:text-base mb-2">
            One last step, {firstName}
          </p>

          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-snug">
            Your results are ready.
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
            We've analyzed your answers and prepared a personalized breakdown of your childhood trauma patterns — including what's holding you back and how to start healing.
          </p>

          {/* What's included - more benefit-focused */}
          <div className="bg-card/50 rounded-2xl p-4 mb-6 border border-card-border/30">
            <p className="text-foreground text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              What you'll get access to:
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <span className="text-primary text-sm mt-0.5">✓</span>
                <span className="text-foreground/90 text-sm">Your complete trauma profile with actionable insights</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary text-sm mt-0.5">✓</span>
                <span className="text-foreground/90 text-sm">35+ psychology-backed assessments to understand yourself deeper</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary text-sm mt-0.5">✓</span>
                <span className="text-foreground/90 text-sm">A daily routine designed around your specific needs</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary text-sm mt-0.5">✓</span>
                <span className="text-foreground/90 text-sm">Calming exercises for when anxiety hits</span>
              </li>
            </ul>
          </div>

          <p className="text-foreground text-sm sm:text-base font-medium mb-3">
            Pay what feels right to you:
          </p>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-2">
            {donationAmounts.map((option) => {
              const isSelected = selectedDonation === option.amount;
              return (
                <button
                  key={option.amount}
                  onClick={() => handleDonationClick(option.amount)}
                  className={`py-4 px-3 rounded-2xl transition-all duration-200 font-bold text-lg sm:text-xl ${
                    isSelected
                      ? 'bg-card border-2 border-primary text-foreground scale-105'
                      : 'bg-card border-2 border-card-border/50 text-foreground hover:border-muted'
                  }`}
                  data-testid={`donation-${option.amount}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-5 text-center">
            {selectedDonation === 1 && "Every bit helps us keep going"}
            {selectedDonation === 4.99 && "The price of a coffee — thank you"}
            {selectedDonation === 9.99 && "Covers our costs — you're amazing"}
          </p>

          {/* Story-driven trust box */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20 mb-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              </div>
              <div>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  <span className="font-medium">A note from our team:</span> We built BreakFree because we've been where you are. Therapy was too expensive, apps felt impersonal.
                </p>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Your contribution — whatever you choose — helps us keep this accessible for everyone who needs it. No judgment, no pressure.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!selectedDonation}
            size="lg"
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
            data-testid="button-continue"
          >
            Unlock My Results
          </Button>

          <p className="text-xs text-muted-foreground">
            Secure payment • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
