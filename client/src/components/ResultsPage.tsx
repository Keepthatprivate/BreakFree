import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface ResultsPageProps {
  userName: string;
}

export default function ResultsPage({ userName }: ResultsPageProps) {
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const donationAmounts = [
    { amount: 1, label: 'Support us' },
    { amount: 10, label: 'Thank you' },
    { amount: 17.34, label: 'Generous' },
  ];

  const handleDonationClick = (amount: number) => {
    setSelectedDonation(amount);
    console.log('Donation selected:', amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 sm:p-12 flex flex-col justify-center"
            data-testid="before-section"
          >
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Before
            </h3>
            <div className="space-y-4">
              <p className="text-lg text-foreground/80">
                Carrying the weight of unprocessed patterns
              </p>
              <p className="text-lg text-foreground/80">
                Feeling stuck in familiar cycles
              </p>
              <p className="text-lg text-foreground/80">
                Wondering if peace is truly possible
              </p>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 sm:p-12 flex flex-col justify-center border border-primary/20"
            data-testid="after-section"
          >
            <h3 className="text-sm uppercase tracking-wider text-primary mb-4">
              After
            </h3>
            <div className="space-y-4">
              <p className="text-lg text-foreground font-medium">
                Understanding your patterns with clarity
              </p>
              <p className="text-lg text-foreground font-medium">
                Breaking free from old cycles
              </p>
              <p className="text-lg text-foreground font-medium">
                Living with the peace you deserve
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {userName}, you're closer to peace than you think.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your answers reveal patterns that can be transformed. The journey to healing starts
            with awareness, and you've already taken that brave first step.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-6 sm:p-8 mb-12" data-testid="testimonial-card">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-primary">J</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-foreground">James, 34</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'fill-primary text-primary' : 'fill-primary/30 text-primary/30'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">4.9</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-foreground/90 italic mb-2 font-serif">
                "I spent years feeling the effects of childhood neglect without understanding why.
                This quiz helped me see my patterns clearly, and the healing program gave me
                practical tools to break free. I finally feel at peace."
              </p>
              <p className="text-xs text-muted-foreground">
                Healed from childhood neglect
              </p>
            </div>
          </div>
        </Card>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Choose what feels right
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {donationAmounts.map(({ amount, label }) => (
              <button
                key={amount}
                onClick={() => handleDonationClick(amount)}
                className={`rounded-2xl border-2 p-6 transition-all duration-200 hover-elevate active-elevate-2 ${
                  selectedDonation === amount
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card/40'
                }`}
                data-testid={`donation-${amount}`}
              >
                <div className="text-3xl font-bold text-foreground mb-1">
                  €{amount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground mb-8">
            We work to keep mental health resources accessible to everyone.
          </p>
        </div>

        <div className="text-center">
          <Button size="lg" className="px-12 h-12 text-base" data-testid="button-continue-plan">
            Continue to your personalized healing plan
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">92%</span> of users feel better after
            completing their healing journey
          </p>
        </div>
      </div>
    </div>
  );
}
