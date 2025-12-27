// Payment preferences utility for managing user payment method preferences
// and device detection for smart defaults

export type PaymentMethodType =
  | 'apple_pay'
  | 'google_pay'
  | 'samsung_pay'
  | 'link'
  | 'amazon_pay'
  | 'revolut_pay'
  | 'klarna'
  | 'card';

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: string;
  description: string;
}

// All available payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'apple_pay', name: 'Apple Pay', icon: '', description: 'Pay with Apple Pay' },
  { id: 'google_pay', name: 'Google Pay', icon: '', description: 'Pay with Google Pay' },
  { id: 'samsung_pay', name: 'Samsung Pay', icon: '', description: 'Pay with Samsung Pay' },
  { id: 'amazon_pay', name: 'Amazon Pay', icon: '', description: 'Pay with Amazon Pay' },
  { id: 'revolut_pay', name: 'Revolut Pay', icon: '', description: 'Pay with Revolut' },
  { id: 'klarna', name: 'Klarna', icon: '', description: 'Buy now, pay later with Klarna' },
  { id: 'link', name: 'Link', icon: '', description: 'Pay with Link by Stripe' },
  { id: 'card', name: 'Card', icon: '', description: 'Pay with credit or debit card' },
];

const PREFERENCE_KEY = 'preferredPaymentMethod';

/**
 * Detect if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
         ('ontouchstart' in window && window.innerWidth <= 768);
}

/**
 * Detect if the user is on an Apple device (iOS/Safari)
 */
export function isAppleDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('iphone') ||
         userAgent.includes('ipad') ||
         userAgent.includes('ipod') ||
         (userAgent.includes('mac') && 'ontouchend' in document);
}

/**
 * Detect if the user is on an Android device
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android');
}

/**
 * Detect if the user is on a Samsung device
 */
export function isSamsungDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('samsung');
}

/**
 * Get the user's stored preferred payment method
 */
export function getStoredPaymentPreference(): PaymentMethodType | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(PREFERENCE_KEY);
    if (stored && PAYMENT_METHODS.some(m => m.id === stored)) {
      return stored as PaymentMethodType;
    }
  } catch (e) {
    console.warn('Failed to read payment preference from localStorage:', e);
  }

  return null;
}

/**
 * Store the user's preferred payment method
 */
export function setStoredPaymentPreference(method: PaymentMethodType): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PREFERENCE_KEY, method);
  } catch (e) {
    console.warn('Failed to store payment preference:', e);
  }
}

/**
 * Get the smart default payment method based on device and stored preference
 * Priority: 1. Stored preference, 2. Device-appropriate wallet, 3. Card
 */
export function getDefaultPaymentMethod(): PaymentMethodType {
  // First check for stored preference
  const stored = getStoredPaymentPreference();
  if (stored) {
    return stored;
  }

  // Device-based defaults for mobile
  if (isMobileDevice()) {
    if (isAppleDevice()) {
      return 'apple_pay';
    }
    if (isSamsungDevice()) {
      return 'samsung_pay';
    }
    if (isAndroidDevice()) {
      return 'google_pay';
    }
    // Generic mobile - default to Apple Pay as it's very common
    return 'apple_pay';
  }

  // Desktop defaults to card
  return 'card';
}

/**
 * Get ordered payment methods based on user preference and device
 * The preferred/default method will be first in the array
 */
export function getOrderedPaymentMethods(preferredMethod?: PaymentMethodType): PaymentMethodType[] {
  const defaultMethod = preferredMethod || getDefaultPaymentMethod();

  // Base order - digital wallets first, then BNPL, then card
  const baseOrder: PaymentMethodType[] = [
    'apple_pay',
    'google_pay',
    'samsung_pay',
    'link',
    'amazon_pay',
    'revolut_pay',
    'klarna',
    'card',
  ];

  // Move preferred method to front
  const ordered = baseOrder.filter(m => m !== defaultMethod);
  ordered.unshift(defaultMethod);

  return ordered;
}

/**
 * Get payment method display info by ID
 */
export function getPaymentMethodInfo(id: PaymentMethodType): PaymentMethod | undefined {
  return PAYMENT_METHODS.find(m => m.id === id);
}
