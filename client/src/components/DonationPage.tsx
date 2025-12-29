import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { trackViewContent } from '@/lib/facebook-tracking';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { apiRequest } from '@/lib/queryClient';

interface DonationPageProps {
  userName: string;
  email?: string;
  onContinue: (donationAmount?: number) => void;
}

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

export default function DonationPage({ userName, email, onContinue }: DonationPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 05 - Donation' });
  }, []);

  const [selectedDonation, setSelectedDonation] = useState<number>(9.99);
  const [showCheckout, setShowCheckout] = useState(false);

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

  const handleBack = () => {
    setShowCheckout(false);
  };

  const fetchClientSecret = useCallback(async () => {
    const response = await apiRequest('POST', '/api/create-embedded-checkout', {
      amount: selectedDonation,
      email: email || '',
      productType: 'donation',
      returnUrl: `${window.location.origin}/quiz?state=results&donation_success=true`,
    });
    const data = await response.json();
    return data.clientSecret;
  }, [selectedDonation, email]);

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-background py-6 sm:py-10">
        <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm"
            data-testid="button-back-to-donation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change donation amount</span>
          </button>

          <div className="bg-card rounded-3xl p-5 sm:p-8 shadow-xl border border-card-border/50 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Complete Your Donation
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Donating ${selectedDonation.toFixed(2)} to unlock your results
            </p>

            {stripePromise ? (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
              >
                <EmbeddedCheckout className="stripe-embedded-checkout" />
              </EmbeddedCheckoutProvider>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
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
          
          <div className="text-right mb-5">
            <span className="text-xs sm:text-sm text-primary">
              {selectedDonation === 9.99 
                ? "Cost to cover our team's effort" 
                : "Less than a Starbucks' coffee"}
            </span>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border-2 border-blue-500/30 mb-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-500/30 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              </div>
              <p className="text-foreground text-xs sm:text-sm leading-relaxed">
                We work to ensure our mental health resources are accessible for everyone. It costs us $9.99 to provide this trial offer, but we want you to choose what feels right for you.
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
        </div>
      </div>
    </div>
  );
}
