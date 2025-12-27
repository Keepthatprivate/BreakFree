import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { trackViewContent } from '@/lib/facebook-tracking';
import {
  PaymentMethodType,
  getDefaultPaymentMethod,
  getStoredPaymentPreference,
  isMobileDevice,
} from '@/lib/payment-preferences';

interface PaymentMethodSelectorProps {
  productName: string;
  amount: number;
  onSelect: (method: PaymentMethodType) => void;
  onBack: () => void;
}

interface PaymentMethodOption {
  id: PaymentMethodType;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const paymentMethodOptions: PaymentMethodOption[] = [
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.72 7.56c-.98-.07-2.04.33-2.71.95-.6.55-1.13 1.43-1 2.28.97.08 1.96-.35 2.66-.97.67-.59 1.12-1.48 1.05-2.26zm1.01 2.44c-1.35-.08-2.5.77-3.14.77-.65 0-1.61-.73-2.68-.71-1.37.02-2.65.8-3.35 2.04-1.44 2.48-.37 6.16 1.02 8.17.68.99 1.5 2.09 2.58 2.05 1.02-.04 1.42-.66 2.66-.66 1.24 0 1.6.66 2.68.64 1.11-.02 1.82-.99 2.5-1.99.78-1.15 1.1-2.26 1.12-2.32-.03-.01-2.14-.82-2.16-3.26-.02-2.04 1.67-3.02 1.74-3.07-.95-1.4-2.43-1.56-2.97-1.66z"/>
      </svg>
    ),
    color: 'text-white',
    bgGradient: 'bg-gradient-to-br from-gray-900 to-gray-700',
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#4285F4" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
      </svg>
    ),
    color: 'text-gray-900',
    bgGradient: 'bg-gradient-to-br from-white to-gray-100',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'text-white',
    bgGradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
  },
  {
    id: 'samsung_pay',
    name: 'Samsung Pay',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M5.566 11.197c.022-.384.18-.71.472-.978.292-.267.68-.4 1.164-.4.3 0 .546.05.735.15.19.1.33.237.422.41.09.175.135.369.135.582 0 .184-.033.35-.1.495a.822.822 0 0 1-.297.347 1.484 1.484 0 0 1-.485.203 2.57 2.57 0 0 1-.636.07H5.564v-.879zm-.002 1.547h1.412c.4 0 .756.068 1.068.206.312.137.555.343.728.616.173.273.26.607.26 1.002 0 .357-.072.662-.217.915-.144.252-.35.445-.617.577-.267.133-.588.2-.961.2H5.564v-3.516zm-1.58 5.01h3.09c.617 0 1.148-.103 1.595-.31.447-.206.79-.511 1.028-.912.238-.401.357-.892.357-1.47 0-.466-.084-.869-.253-1.21a1.787 1.787 0 0 0-.745-.79c.256-.174.457-.405.603-.693.146-.289.22-.634.22-1.034 0-.396-.084-.738-.252-1.025a1.665 1.665 0 0 0-.717-.671c-.31-.16-.682-.24-1.116-.24H3.984v8.355z"/>
      </svg>
    ),
    color: 'text-white',
    bgGradient: 'bg-gradient-to-br from-blue-700 to-blue-900',
  },
  {
    id: 'amazon_pay',
    name: 'Amazon Pay',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 0 1-.753.078c-1.057-.878-1.247-1.287-1.826-2.125-1.746 1.782-2.983 2.315-5.245 2.315-2.679 0-4.763-1.652-4.763-4.961 0-2.583 1.4-4.341 3.388-5.201 1.726-.762 4.138-.899 5.984-1.107v-.414c0-.761.059-1.663-.389-2.323-.39-.593-1.137-.837-1.799-.837-1.222 0-2.312.627-2.579 1.927-.054.287-.265.569-.554.583l-3.102-.333c-.261-.059-.551-.271-.478-.673C5.743 1.837 8.486.5 10.946.5c1.261 0 2.91.335 3.903 1.29 1.261 1.176 1.141 2.746 1.141 4.456v4.036c0 1.213.504 1.746.976 2.401.166.233.202.512-.011.686-.532.445-1.479 1.273-2.001 1.736l-.81-.71z"/>
        <path d="M21.768 18.721c-.395-.484-1.203-.695-2.408-.618-.406.03-1.223.117-1.716.316-.266.107-.437.278-.396.521.04.25.281.494.568.67.667.404 1.603.636 2.523.53.633-.073 1.306-.341 1.645-.811.355-.493.239-1.053-.216-1.608z"/>
      </svg>
    ),
    color: 'text-gray-900',
    bgGradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  {
    id: 'revolut_pay',
    name: 'Revolut Pay',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 7h5c1.5 0 2.5 1 2.5 2.5S14.5 12 13 12h-3l3 5H10l-3-5V7z"/>
      </svg>
    ),
    color: 'text-white',
    bgGradient: 'bg-gradient-to-br from-gray-800 to-black',
  },
  {
    id: 'klarna',
    name: 'Klarna',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.5 2H4v20h4V2zm0 0c0 4.875-1.945 9.508-5.397 12.934L4.5 19h4.167L13 14.5C14.5 12.5 15.5 9.5 15.5 6.5S14.5 0 11.5 0v2zm7.5 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
      </svg>
    ),
    color: 'text-white',
    bgGradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
  },
  {
    id: 'link',
    name: 'Link by Stripe',
    icon: <Wallet className="w-6 h-6" />,
    color: 'text-white',
    bgGradient: 'bg-gradient-to-br from-green-500 to-teal-600',
  },
];

export default function PaymentMethodSelector({
  productName,
  amount,
  onSelect,
  onBack,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [recommendedMethod, setRecommendedMethod] = useState<PaymentMethodType>('card');

  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step - Payment Method Selection' });

    // Set recommended method based on stored preference or device
    const stored = getStoredPaymentPreference();
    if (stored) {
      setRecommendedMethod(stored);
      setSelectedMethod(stored);
    } else {
      const defaultMethod = getDefaultPaymentMethod();
      setRecommendedMethod(defaultMethod);
      setSelectedMethod(defaultMethod);
    }
  }, []);

  const handleMethodClick = (method: PaymentMethodType) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
    }
  };

  // Sort methods to show recommended first
  const sortedMethods = [...paymentMethodOptions].sort((a, b) => {
    if (a.id === recommendedMethod) return -1;
    if (b.id === recommendedMethod) return 1;
    return 0;
  });

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
            <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">Payment</span>
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
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Choose Payment Method
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-5 sm:mb-6">
            Select how you'd like to pay for {productName}
          </p>

          {/* Order Summary */}
          <div className="bg-background/50 rounded-2xl p-3.5 sm:p-4 mb-5 sm:mb-6">
            <div className="flex items-center justify-between text-base sm:text-lg font-bold">
              <span className="text-foreground">{productName}</span>
              <span className="text-primary">${(amount / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {sortedMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const isRecommended = method.id === recommendedMethod;

              return (
                <button
                  key={method.id}
                  onClick={() => handleMethodClick(method.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                      : 'border-card-border/50 bg-card/60 hover:border-muted hover:bg-card/80'
                  }`}
                  data-testid={`payment-method-${method.id}`}
                >
                  {/* Recommended badge */}
                  {isRecommended && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-background text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      Recommended
                    </span>
                  )}

                  {/* Icon container */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${method.bgGradient} ${method.color}`}
                  >
                    {method.icon}
                  </div>

                  {/* Method name */}
                  <span className="text-foreground text-xs sm:text-sm font-medium text-center">
                    {method.name}
                  </span>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-background" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="w-full h-11 sm:h-12 text-sm sm:text-base rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-bold"
            data-testid="button-continue-to-payment"
          >
            {selectedMethod ? (
              `Continue with ${paymentMethodOptions.find((m) => m.id === selectedMethod)?.name}`
            ) : (
              'Select a payment method'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
