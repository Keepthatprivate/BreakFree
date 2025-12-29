import { useStripe, Elements, PaymentElement, useElements, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { loadStripe, StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Check, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { trackViewContent, trackInitiateCheckout, trackAddPaymentInfo, getFacebookCookies } from '@/lib/facebook-tracking';
import {
  PaymentMethodType,
  getOrderedPaymentMethods,
  setStoredPaymentPreference,
  getDefaultPaymentMethod
} from '@/lib/payment-preferences';

// Stripe integration: Load Stripe outside of component to avoid recreation
// Only load if the key is available (runtime check instead of throwing)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface CheckoutFormProps {
  amount: number;
  productName: string;
  email: string;
  name?: string;
  preferredPaymentMethod?: PaymentMethodType;
  onSuccess: () => void;
}

// Express Checkout Form for Apple Pay and Google Pay
function ExpressCheckoutForm({ amount, productName, email, name, preferredPaymentMethod, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [hasTrackedPaymentInfo, setHasTrackedPaymentInfo] = useState(false);
  const [walletAvailable, setWalletAvailable] = useState<boolean | null>(null);

  const handleReady = (event: { availablePaymentMethods?: { applePay?: boolean; googlePay?: boolean } }) => {
    // Check if the desired wallet is available
    const isApplePayAvailable = event.availablePaymentMethods?.applePay === true;
    const isGooglePayAvailable = event.availablePaymentMethods?.googlePay === true;
    
    if (preferredPaymentMethod === 'apple_pay') {
      setWalletAvailable(isApplePayAvailable);
    } else if (preferredPaymentMethod === 'google_pay' || preferredPaymentMethod === 'samsung_pay') {
      // Samsung Pay uses Google Pay on web
      setWalletAvailable(isGooglePayAvailable);
    } else {
      setWalletAvailable(isApplePayAvailable || isGooglePayAvailable);
    }

    if (!hasTrackedPaymentInfo) {
      setHasTrackedPaymentInfo(true);
      trackAddPaymentInfo({
        email,
        firstName: name,
      });
    }
  };

  const handleConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/quiz`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (preferredPaymentMethod) {
        setStoredPaymentPreference(preferredPaymentMethod);
      }
      toast({
        title: "Payment Successful",
        description: `Thank you for your purchase of ${productName}!`,
      });
      onSuccess();
    }
  };

  // Filter which wallets to show based on user's selection
  const getWalletButtonsConfig = () => {
    if (preferredPaymentMethod === 'apple_pay') {
      return { applePay: 'always' as const, googlePay: 'never' as const };
    } else if (preferredPaymentMethod === 'google_pay' || preferredPaymentMethod === 'samsung_pay') {
      // Samsung Pay uses Google Pay button on web
      return { applePay: 'never' as const, googlePay: 'always' as const };
    }
    return { applePay: 'always' as const, googlePay: 'always' as const };
  };

  // Get wallet name for display
  const getWalletName = () => {
    if (preferredPaymentMethod === 'apple_pay') return 'Apple Pay';
    if (preferredPaymentMethod === 'samsung_pay') return 'Samsung Pay';
    return 'Google Pay';
  };

  // If wallet is explicitly not available (after onReady fired), show a message
  if (walletAvailable === false) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {getWalletName()} is not available on this device or browser.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please go back and select a different payment method.
          </p>
        </div>
      </div>
    );
  }

  // Always render ExpressCheckoutElement immediately - Stripe handles its own loading state
  // This makes wallet loading instantaneous instead of showing our own loading spinner
  return (
    <div className="space-y-6">
      <ExpressCheckoutElement
        onReady={handleReady}
        onConfirm={handleConfirm}
        options={{
          buttonType: {
            applePay: 'buy',
            googlePay: 'buy',
          },
          buttonTheme: {
            applePay: 'black',
            googlePay: 'black',
          },
          buttonHeight: 48,
          wallets: getWalletButtonsConfig(),
        }}
      />
      <p className="text-xs text-muted-foreground text-center">
        Click the button above to complete your payment
      </p>
    </div>
  );
}

// Standard Payment Element Form for Card, Link, Amazon Pay
function StandardCheckoutForm({ amount, productName, email, name, preferredPaymentMethod, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasTrackedPaymentInfo, setHasTrackedPaymentInfo] = useState(false);

  // Hide Link when user selected a different payment method
  // Stripe's PaymentElement shows Link for saved accounts, but we want to respect user's choice
  const shouldHideLink = preferredPaymentMethod && preferredPaymentMethod !== 'link';

  // For Amazon Pay, we want to hide card options completely - only show Amazon Pay
  const isAmazonPayOnly = preferredPaymentMethod === 'amazon_pay';

  const handlePaymentElementReady = () => {
    if (!hasTrackedPaymentInfo) {
      setHasTrackedPaymentInfo(true);
      trackAddPaymentInfo({
        email,
        firstName: name,
      });
    }
  };

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
      if (preferredPaymentMethod) {
        setStoredPaymentPreference(preferredPaymentMethod);
      }
      toast({
        title: "Payment Successful",
        description: `Thank you for your purchase of ${productName}!`,
      });
      onSuccess();
    }
  };

  // Get payment method display name
  const getPaymentMethodName = () => {
    switch (preferredPaymentMethod) {
      case 'amazon_pay': return 'Amazon Pay';
      case 'link': return 'Link';
      case 'revolut_pay': return 'Revolut Pay';
      case 'card': return 'Card';
      default: return 'Payment';
    }
  };

  // Configure PaymentElement to show ONLY the selected payment method
  // The actual payment methods available come from the PaymentIntent's payment_method_types
  // We also need to disable Link detection when user explicitly chose another method
  const getPaymentElementOptions = () => {
    // For Link, allow Link to show (it's what they selected)
    if (preferredPaymentMethod === 'link') {
      return {
        wallets: { applePay: 'never' as const, googlePay: 'never' as const },
        layout: {
          type: 'accordion' as const,
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: false,
        },
      };
    }

    // For Amazon Pay, use a simple tabs layout that shows only amazon_pay
    // Since payment_method_types only includes 'amazon_pay', this should show just that
    if (preferredPaymentMethod === 'amazon_pay') {
      return {
        wallets: { applePay: 'never' as const, googlePay: 'never' as const },
        layout: {
          type: 'tabs' as const,
          defaultCollapsed: false,
        },
        // Disable any saved payment methods or Link
        defaultValues: {
          billingDetails: {
            email: undefined, // Don't pre-fill email to avoid Link detection
          },
        },
      };
    }

    // For card payments, disable wallets and Link autofill
    // to prevent Stripe from showing saved Link accounts
    return {
      wallets: { applePay: 'never' as const, googlePay: 'never' as const },
      layout: {
        type: 'accordion' as const,
        defaultCollapsed: false,
        radios: false,
        spacedAccordionItems: false,
      },
    };
  };

  // Build CSS classes to hide unwanted payment options
  const getContainerClasses = () => {
    const classes: string[] = [];
    if (shouldHideLink) classes.push('hide-stripe-link');
    if (isAmazonPayOnly) classes.push('amazon-pay-only');
    return classes.join(' ');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Container with CSS to hide unwanted payment methods - show only selected method */}
      <div className={getContainerClasses()}>
        <PaymentElement
          onReady={handlePaymentElementReady}
          options={getPaymentElementOptions()}
        />
      </div>
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-11 sm:h-12 text-sm sm:text-base rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay with ${getPaymentMethodName()}`
        )}
      </Button>
    </form>
  );
}

// Main CheckoutForm that routes to the appropriate form based on payment method
function CheckoutForm({ amount, productName, email, name, preferredPaymentMethod, onSuccess }: CheckoutFormProps) {
  // Use Express Checkout for Apple Pay, Google Pay, and Samsung Pay
  // Samsung Pay uses the Google Pay button on web (handled by Stripe's ExpressCheckoutElement)
  const isWalletPayment = preferredPaymentMethod === 'apple_pay' || 
                          preferredPaymentMethod === 'google_pay' || 
                          preferredPaymentMethod === 'samsung_pay';
  
  if (isWalletPayment) {
    return (
      <ExpressCheckoutForm
        amount={amount}
        productName={productName}
        email={email}
        name={name}
        preferredPaymentMethod={preferredPaymentMethod}
        onSuccess={onSuccess}
      />
    );
  }

  // Use standard PaymentElement for Card, Link, Amazon Pay
  return (
    <StandardCheckoutForm
      amount={amount}
      productName={productName}
      email={email}
      name={name}
      preferredPaymentMethod={preferredPaymentMethod}
      onSuccess={onSuccess}
    />
  );
}

interface CheckoutPageProps {
  amount: number;
  productType: 'upsell' | 'donation' | 'trial' | 'masterclass' | 'journal';
  productName: string;
  email: string;
  name?: string;
  answers?: Record<string, string[]>;
  preferredPaymentMethod?: PaymentMethodType;
  prefetchedClientSecret?: string | null;
  onComplete: () => void;
  onBack?: () => void;
}

export default function CheckoutPage({ amount, productType, productName, email, name, answers, preferredPaymentMethod, prefetchedClientSecret, onComplete, onBack }: CheckoutPageProps) {
  const [clientSecret, setClientSecret] = useState(prefetchedClientSecret || "");
  const [isLoading, setIsLoading] = useState(!prefetchedClientSecret);
  const [error, setError] = useState<string | null>(null);

  // Use provided payment method or get smart default
  const effectivePaymentMethod = preferredPaymentMethod || getDefaultPaymentMethod();

  // Sync prefetchedClientSecret prop to state when it becomes available
  // This handles the case where Quiz.tsx prefetch completes after CheckoutPage mounts
  useEffect(() => {
    if (prefetchedClientSecret && !clientSecret) {
      setClientSecret(prefetchedClientSecret);
      setIsLoading(false);
    }
  }, [prefetchedClientSecret, clientSecret]);

  useEffect(() => {
    trackViewContent({ contentName: `Funnel Step - Checkout ${productName}` });
  }, [productName]);

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
    // Skip if we have a prefetched client secret
    if (prefetchedClientSecret) {
      return;
    }

    // Stripe integration: Create PaymentIntent as soon as the page loads
    // Masterclass and journal use the upsell endpoint with custom amount
    const getEndpoint = () => {
      switch (productType) {
        case 'trial': return '/api/create-trial-payment';
        case 'donation': return '/api/create-donation-payment';
        case 'upsell':
        case 'masterclass':
        case 'journal':
        default: return '/api/create-upsell-payment';
      }
    };
    const endpoint = getEndpoint();

    // Capture Facebook tracking data for attribution
    const { fbc, fbp } = getFacebookCookies();
    const clientUserAgent = navigator.userAgent;
    const sourceUrl = window.location.href;

    // Build payload based on product type
    const getBasePayload = () => {
      switch (productType) {
        case 'donation':
          return { amount: amount / 100, email, name };
        case 'masterclass':
        case 'journal':
          return { amount: amount / 100, email, name, productName };
        case 'trial':
          return { email, name, answers };
        case 'upsell':
        default:
          return { email, name };
      }
    };

    // Include Facebook tracking data for proper campaign attribution
    // Include preferredPaymentMethod so server restricts to only relevant payment types
    const payload = {
      ...getBasePayload(),
      fbc,
      fbp,
      clientUserAgent,
      sourceUrl,
      preferredPaymentMethod: effectivePaymentMethod,
    };

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
  }, [amount, productType, email, prefetchedClientSecret]);

  // Track InitiateCheckout when checkout page loads
  useEffect(() => {
    trackInitiateCheckout({
      email,
      firstName: name,
      value: amount / 100,
      currency: 'EUR',
      contentName: productName,
    });
  }, []);

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
    <div className="min-h-screen bg-background py-4 sm:py-10">
      <div className="max-w-lg mx-auto px-4 sm:px-6 w-full">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background" />
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Select Plan</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-primary"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-xs sm:text-sm">2</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Checkout</span>
          </div>
          
          <div className="w-6 sm:w-12 h-0.5 bg-foreground/30"></div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-card-border flex items-center justify-center">
              <span className="text-foreground/50 font-bold text-xs sm:text-sm">3</span>
            </div>
            <span className="text-xs sm:text-sm text-foreground/50 font-medium hidden sm:block">Access Results</span>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-5 sm:p-8 shadow-xl border border-card-border/50">
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm"
            data-testid="button-back-to-payment-selection"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Choose different payment method</span>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Secure Checkout
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-5 sm:mb-6">
            Complete your purchase to unlock {productName}
          </p>

          <div className="bg-background/50 rounded-2xl p-3.5 sm:p-4 mb-5 sm:mb-6">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-foreground font-medium text-sm sm:text-base">Order Summary</span>
            </div>
            <div className="flex items-center justify-between text-base sm:text-lg font-bold">
              <span className="text-foreground">{productName}</span>
              <span className="text-primary">${(amount / 100).toFixed(2)}</span>
            </div>
            {productType === 'trial' && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
                $29.99 after trial
              </p>
            )}
          </div>

          {/* Stripe integration: Wrap form in Elements provider */}
          {/* Disable Link authentication unless user explicitly selected Link */}
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
              // Disable Link Authentication Element unless user selected Link
              // This prevents Stripe from auto-detecting saved Link accounts
              loader: 'always',
            }}
          >
            <CheckoutForm
              amount={amount}
              productName={productName}
              email={email}
              name={name}
              preferredPaymentMethod={effectivePaymentMethod}
              onSuccess={onComplete}
            />
          </Elements>

          {/* Change payment method link - always visible */}
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors mt-6 text-sm w-full font-medium"
            data-testid="button-change-payment-method"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change payment method</span>
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
