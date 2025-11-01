import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Check, Loader2, AlertCircle } from 'lucide-react';

// Stripe integration: Load Stripe outside of component to avoid recreation
// Only load if the key is available (runtime check instead of throwing)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface CheckoutFormProps {
  amount: number;
  productName: string;
  onSuccess: () => void;
}

function CheckoutForm({ amount, productName, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/quiz`,
      },
      redirect: 'if_required',
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: `Thank you for your purchase of ${productName}!`,
      });
      // Mark payment as complete and continue flow
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'accordion',
          // Stripe integration: Preselect Apple Pay by prioritizing wallets
          paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-12 text-base rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Access my result and plan'
        )}
      </Button>
    </form>
  );
}

interface CheckoutPageProps {
  amount: number;
  productType: 'upsell' | 'donation' | 'trial';
  productName: string;
  email: string;
  onComplete: () => void;
}

export default function CheckoutPage({ amount, productType, productName, email, onComplete }: CheckoutPageProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Stripe is properly configured
  if (!stripePublicKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-5 sm:px-6 w-full">
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-card-border/50">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Configuration Error</h2>
              <p className="text-muted-foreground">
                Stripe payment system is not properly configured. Please contact support or try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Stripe integration: Create PaymentIntent as soon as the page loads
    const endpoint = productType === 'upsell' 
      ? '/api/create-upsell-payment'
      : productType === 'trial'
      ? '/api/create-trial-payment'
      : '/api/create-payment-intent';

    const payload = productType === 'donation' 
      ? { amount: amount / 100, email }
      : { email };

    apiRequest("POST", endpoint, payload)
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setError(error.message || 'Failed to initialize payment. Please try again.');
        setIsLoading(false);
      });
  }, [amount, productType, email]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-5 sm:px-6 w-full">
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-card-border/50">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Payment Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} data-testid="button-retry">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-foreground text-base">Preparing secure checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 text-background" />
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Select Plan</span>
          </div>
          
          <div className="w-8 sm:w-12 h-0.5 bg-primary"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-sm">2</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Checkout</span>
          </div>
          
          <div className="w-8 sm:w-12 h-0.5 bg-foreground/30"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-card border border-card-border flex items-center justify-center">
              <span className="text-foreground/50 font-bold text-sm">3</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground/50 font-medium hidden sm:block">Access Results</span>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-card-border/50">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Secure Checkout
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Complete your purchase to unlock {productName}
          </p>

          <div className="bg-background/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground font-medium">Order Summary</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-foreground">{productName}</span>
              <span className="text-primary">€{(amount / 100).toFixed(2)}</span>
            </div>
            {productType === 'trial' && (
              <p className="text-xs text-muted-foreground mt-2">
                €29.99 after trial
              </p>
            )}
          </div>

          {/* Stripe integration: Wrap form in Elements provider */}
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: 'hsl(var(--primary))',
                  colorBackground: 'hsl(var(--card))',
                  colorText: 'hsl(var(--foreground))',
                  colorDanger: 'hsl(var(--destructive))',
                  borderRadius: '12px',
                },
              },
            }}
          >
            <CheckoutForm amount={amount} productName={productName} onSuccess={onComplete} />
          </Elements>

          <p className="text-xs text-muted-foreground text-center mt-4">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
