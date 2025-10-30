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
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {userName}, you're closer to peace than you think
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div
            className="bg-card rounded-3xl p-8 border border-card-border/50"
            data-testid="before-section"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <span className="text-2xl">😔</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Before
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground mt-1">✦</span>
                <p className="text-base text-muted-foreground">
                  Unsure why your mood changes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground mt-1">✦</span>
                <p className="text-base text-muted-foreground">
                  Overthinking or feeling stuck
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground mt-1">✦</span>
                <p className="text-base text-muted-foreground">
                  No clear way to handle stress
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground mt-1">✦</span>
                <p className="text-base text-muted-foreground">
                  Struggling to build helpful habits
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card rounded-3xl p-8 border-2 border-primary/40 shadow-lg shadow-primary/10"
            data-testid="after-section"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                After
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-base text-foreground font-medium">
                  In tune with your emotions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-base text-foreground font-medium">
                  Aware of your patterns and triggers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-base text-foreground font-medium">
                  Equipped with tools to reset your mood
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-base text-foreground font-medium">
                  Building habits that support your mind
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
            People trust us
          </h2>
          <Card className="p-0 overflow-hidden rounded-3xl border border-card-border/50" data-testid="testimonial-card">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-foreground">James, 34</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/40 text-yellow-400/40'}`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-foreground ml-1">4.9</span>
                    </div>
                  </div>
                  <p className="text-base text-foreground mb-2 leading-relaxed">
                    "Breeze provided me with a safe space to explore and understand my true self."
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="max-w-md mx-auto text-center mb-8">
          <Button size="lg" className="w-full h-16 text-lg font-bold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40" data-testid="button-continue-plan">
            Get my result and plan
          </Button>
          <button className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip and continue
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-card rounded-3xl p-6 border border-card-border/50">
          <div className="flex items-center justify-center gap-4">
            <div className="text-3xl">🌿</div>
            <div className="text-center">
              <p className="text-base text-foreground">
                <span className="font-bold text-primary text-xl">92%</span> users report improved emotional well-being after reading the guide
              </p>
            </div>
            <div className="text-3xl">🌿</div>
          </div>
        </div>
      </div>
    </div>
  );
}
