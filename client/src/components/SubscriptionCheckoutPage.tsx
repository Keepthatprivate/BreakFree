import { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Check, Loader2, AlertCircle, Shield, Clock, Zap, Heart } from 'lucide-react';
import { trackInitiateCheckout, getFbc, getFbp, getFacebookCookies } from '@/lib/facebook-tracking';

interface SubscriptionCheckoutPageProps {
  email: string;
  name?: string;
  quizAnalysis?: {
    traumaScore: number;
    primaryPattern: string;
    recommendations: string[];
  };
}

export default function SubscriptionCheckoutPage({ 
  email, 
  name, 
  quizAnalysis 
}: SubscriptionCheckoutPageProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      trackInitiateCheckout({
        email,
        firstName: name,
        value: 1,
        currency: 'USD',
        contentName: '7-Day Trial Subscription',
      });

      // Get Facebook tracking cookies using the consolidated function
      const { fbc, fbp } = getFacebookCookies();
      const clientUserAgent = navigator.userAgent;

      const response = await apiRequest("POST", "/api/create-subscription-checkout", {
        email,
        name,
        fbc,
        fbp,
        clientUserAgent,
        quizAnalysis,
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Error creating subscription checkout:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-5 sm:px-6 w-full">
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-card-border/50">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                onClick={() => {
                  setError(null);
                  handleStartTrial();
                }} 
                data-testid="button-retry-subscription"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-10 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background" />
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Quiz Complete</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-primary"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-xs sm:text-sm">2</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Start Trial</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-foreground/30"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-card-border flex items-center justify-center">
              <span className="text-foreground/50 font-bold text-xs sm:text-sm">3</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground/50 font-medium hidden sm:block">Get Results</span>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-5 sm:p-8 shadow-xl border border-card-border/50">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Start Your Healing Journey
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Get full access to your results and personalized healing plan
            </p>
          </div>

          <div className="bg-primary/10 rounded-2xl p-4 sm:p-6 mb-6 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg sm:text-xl font-bold text-foreground">7-Day Trial</span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold text-primary">$1</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Then $29.99/month after trial. Cancel anytime.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Your Complete Trauma Assessment</p>
                <p className="text-xs text-muted-foreground">Detailed analysis of your patterns and triggers</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Heart className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Personalized Healing Plan</p>
                <p className="text-xs text-muted-foreground">Step-by-step guidance tailored to your needs</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Daily Healing Exercises</p>
                <p className="text-xs text-muted-foreground">Proven techniques to support your recovery</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartTrial}
            disabled={isProcessing}
            className="w-full h-12 sm:h-14 text-base sm:text-lg rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
            data-testid="button-start-trial"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Preparing checkout...
              </>
            ) : (
              'Start 7-Day Trial for $1'
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Secure payment. Cancel anytime during trial.
            </p>
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            By starting your trial, you agree to be charged $1 now and $29.99/month after 7 days unless you cancel. You can cancel anytime in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
