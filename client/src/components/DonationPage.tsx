import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface DonationPageProps {
  userName: string;
  onContinue: (donationAmount?: number) => void;
}

export default function DonationPage({ userName, onContinue }: DonationPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 05 - Donation' });
  }, []);

  const [selectedDonation, setSelectedDonation] = useState<number>(24.99);

  const donationAmounts = [
    { amount: 2.99, label: '$2.99' },
    { amount: 9.99, label: '$9.99' },
    { amount: 24.99, label: '$24.99' },
  ];

  const handleDonationClick = (amount: number) => {
    setSelectedDonation(amount);
  };

  const handleContinue = () => {
    console.log('Donation selected:', selectedDonation);
    // Pass the selected donation amount to trigger checkout
    onContinue(selectedDonation || undefined);
  };

  const handleSkip = () => {
    // Pass undefined to skip donation
    onContinue(undefined);
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-5 leading-snug">
            Contribute what feels right — and unlock:
          </h1>
          
          <ul className="space-y-2.5 mb-6">
            <li className="flex items-start gap-2.5">
              <span className="text-foreground text-base mt-0.5">•</span>
              <span className="text-foreground text-base font-normal">Your full Childhood trauma results</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-foreground text-base mt-0.5">•</span>
              <span className="text-foreground text-base font-normal">35+ expert-crafted personality tests</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-foreground text-base mt-0.5">•</span>
              <span className="text-foreground text-base font-normal">Personalized routine tailored to you</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-foreground text-base mt-0.5">•</span>
              <span className="text-foreground text-base font-normal">Calming games to ease your mind</span>
            </li>
          </ul>

          <p className="text-primary text-sm sm:text-base mb-3.5">
            Choose any amount you feel comfortable with
          </p>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-1.5">
            {donationAmounts.map((option) => {
              const isSelected = selectedDonation === option.amount;
              return (
                <button
                  key={option.amount}
                  onClick={() => handleDonationClick(option.amount)}
                  className={`py-3.5 px-2 rounded-2xl transition-all duration-200 font-bold text-base sm:text-lg ${
                    isSelected
                      ? 'bg-card border-2 border-primary text-foreground'
                      : 'bg-card border-2 border-card-border/50 text-foreground hover:border-muted'
                  }`}
                  data-testid={`donation-${option.amount}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          
          {selectedDonation === 3 && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center mb-2">
              It's less than a Starbucks coffee
            </p>
          )}

          <div className="text-right mb-5">
            <span className="text-xs sm:text-sm text-primary">Cost to cover our team's effort</span>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border-2 border-blue-500/30 mb-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-500/30 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              </div>
              <p className="text-foreground text-xs sm:text-sm leading-relaxed">
                We work to ensure our mental health resources are accessible for everyone. It costs us $24.99 to provide this trial offer, but we want you to choose what feels right for you.
              </p>
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
            Donate
          </Button>
          <button
            onClick={handleSkip}
            className="w-full text-foreground/70 hover:text-foreground font-medium text-base transition-colors py-2"
            data-testid="button-skip-donation"
          >
            Skip contribution
          </button>
        </div>
      </div>
    </div>
  );
}
