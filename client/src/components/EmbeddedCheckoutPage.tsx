import { useCallback, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { trackViewContent, trackInitiateCheckout } from '@/lib/facebook-tracking';
// Stripe-specific styles - loaded only on checkout pages
import '@/styles/stripe.css';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

export type EmbeddedCheckoutProductType = 'donation' | 'subscription' | 'upsell' | 'masterclass' | 'journal';

interface EmbeddedCheckoutPageProps {
  amount: number;
  productType: EmbeddedCheckoutProductType;
  productName: string;
  email: string;
  name?: string;
  onBack?: () => void;
  returnUrl?: string;
}

export default function EmbeddedCheckoutPage({
  amount,
  productType,
  productName,
  email,
  name,
  onBack,
  returnUrl,
}: EmbeddedCheckoutPageProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackViewContent({ contentName: `Checkout - ${productName}` });
    trackInitiateCheckout({
      email,
      firstName: name,
      value: amount,
      currency: 'USD',
      contentName: productName,
    });
  }, [productName, email, name, amount]);

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await apiRequest('POST', '/api/create-embedded-checkout', {
        amount,
        email,
        name,
        productType,
        productName,
        returnUrl: returnUrl || `${window.location.origin}/quiz?state=results&payment_success=true`,
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data.clientSecret;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize checkout');
      throw err;
    }
  }, [amount, email, name, productType, productName, returnUrl]);

  if (!stripePublicKey || !stripePromise) {
    return (
      <div className="min-h-screen bg-background py-6 sm:py-10">
        <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-card-border/50">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Configuration Error</h2>
              <p className="text-muted-foreground">
                Payment system is not properly configured. Please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-6 sm:py-10">
        <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-card-border/50">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Checkout Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} data-testid="button-retry">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="max-w-lg mx-auto px-5 sm:px-6 w-full">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back</span>
          </button>
        )}

        <div className="bg-card rounded-3xl p-5 sm:p-8 shadow-xl border border-card-border/50 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Secure Checkout
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Complete your purchase of {productName}
          </p>

          <div className="bg-background/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">{productName}</span>
              <span className="text-primary font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>

          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout className="stripe-embedded-checkout" />
          </EmbeddedCheckoutProvider>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}
