import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DonationPageProps {
  userName: string;
  onContinue: () => void;
}

export default function DonationPage({ userName, onContinue }: DonationPageProps) {
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const donationAmounts = [
    { amount: 1, label: '€1', description: 'Support us' },
    { amount: 10, label: '€10', description: 'Thank you' },
    { amount: 17.34, label: '€17.34', description: 'Generous' },
  ];

  const handleDonationClick = (amount: number) => {
    setSelectedDonation(amount);
  };

  const handleContinue = () => {
    if (selectedDonation) {
      console.log('Donation selected:', selectedDonation);
    }
    onContinue();
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {userName}, thank you for completing the quiz
          </h1>
          <p className="text-lg text-muted-foreground">
            Your support helps us continue providing mental wellness resources
          </p>
        </div>

        <div className="bg-card rounded-3xl p-8 sm:p-10 border border-card-border/50 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            Support our mission (optional)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {donationAmounts.map((option) => {
              const isSelected = selectedDonation === option.amount;
              return (
                <button
                  key={option.amount}
                  onClick={() => handleDonationClick(option.amount)}
                  className={`p-6 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20 scale-105'
                      : 'border-card-border/50 bg-card hover:border-primary/50'
                  }`}
                  data-testid={`donation-${option.amount}`}
                >
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${
                      isSelected ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center text-sm text-muted-foreground mb-6">
            Your contribution helps us provide free resources to those in need
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
            data-testid="button-continue"
          >
            {selectedDonation ? `Continue with €${selectedDonation}` : 'Continue without donating'}
          </Button>
        </div>
      </div>
    </div>
  );
}
