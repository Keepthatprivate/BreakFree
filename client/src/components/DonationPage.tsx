import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface DonationPageProps {
  userName: string;
  onContinue: () => void;
}

export default function DonationPage({ userName, onContinue }: DonationPageProps) {
  const [selectedDonation, setSelectedDonation] = useState<number>(10);

  const donationAmounts = [
    { amount: 1, label: '€1' },
    { amount: 2, label: '€2' },
    { amount: 10, label: '€10' },
    { amount: 17.34, label: '€17.34' },
  ];

  const handleDonationClick = (amount: number) => {
    setSelectedDonation(amount);
  };

  const handleContinue = () => {
    console.log('Donation selected:', selectedDonation);
    onContinue();
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 leading-tight">
            Contribute what feels right — and unlock:
          </h1>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-foreground mt-0.5">•</span>
              <span className="text-foreground font-medium">Your full Childhood trauma results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-foreground mt-0.5">•</span>
              <span className="text-foreground font-medium">35+ expert-crafted personality tests</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-foreground mt-0.5">•</span>
              <span className="text-foreground font-medium">Personalized routine tailored to you</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-foreground mt-0.5">•</span>
              <span className="text-foreground font-medium">Calming games to ease your mind</span>
            </li>
          </ul>

          <p className="text-primary font-medium mb-4">
            Choose any amount you feel comfortable with
          </p>

          <div className="flex gap-3 mb-2">
            {donationAmounts.map((option) => {
              const isSelected = selectedDonation === option.amount;
              const isHighlighted = option.amount === 10;
              return (
                <button
                  key={option.amount}
                  onClick={() => handleDonationClick(option.amount)}
                  className={`flex-1 py-4 px-4 rounded-2xl transition-all duration-200 font-bold text-lg ${
                    isSelected && isHighlighted
                      ? 'bg-foreground text-background border-2 border-foreground'
                      : isSelected
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
          
          <div className="text-right mb-6">
            <span className="text-sm text-primary">Cost to cover our team's effort</span>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-blue-500/30 mb-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              </div>
              <p className="text-foreground leading-relaxed">
                We work to ensure our mental health resources are accessible for everyone. It costs us €17.34 to provide this trial offer, but we want you to choose what feels right for you.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full h-16 text-xl font-bold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
            data-testid="button-continue"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
