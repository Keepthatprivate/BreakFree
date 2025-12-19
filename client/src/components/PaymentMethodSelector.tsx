import { useState, useRef, useEffect } from 'react';
import { ChevronDown, CreditCard, Smartphone } from 'lucide-react';

// Payment method types supported by Stripe
export type PaymentMethodType =
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'link'
  | 'amazon_pay'
  | 'klarna'
  | 'revolut_pay'
  | 'samsung_pay';

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Card', icon: '💳' },
  { id: 'apple_pay', name: 'Apple Pay', icon: '' },
  { id: 'google_pay', name: 'Google Pay', icon: '🔵' },
  { id: 'link', name: 'Link', icon: '🔗' },
  { id: 'amazon_pay', name: 'Amazon Pay', icon: '📦' },
  { id: 'klarna', name: 'Klarna', icon: '🟣' },
  { id: 'revolut_pay', name: 'Revolut Pay', icon: '🔄' },
  { id: 'samsung_pay', name: 'Samsung Pay', icon: '📱' },
];

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange
}: PaymentMethodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod) || paymentMethods[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Discreet but accessible */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-lg hover:bg-background/50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm">{selectedPaymentMethod.icon}</span>
        <span>{selectedPaymentMethod.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 z-50 min-w-[180px] bg-card border border-card-border rounded-xl shadow-xl py-1 animate-in fade-in-0 zoom-in-95 duration-100"
          role="listbox"
        >
          <div className="px-3 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-card-border/50 mb-1">
            Payment Method
          </div>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                onMethodChange(method.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                selectedMethod === method.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-background/50'
              }`}
              role="option"
              aria-selected={selectedMethod === method.id}
            >
              <span className="text-base w-6 text-center">{method.icon}</span>
              <span>{method.name}</span>
              {selectedMethod === method.id && (
                <span className="ml-auto text-primary text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
