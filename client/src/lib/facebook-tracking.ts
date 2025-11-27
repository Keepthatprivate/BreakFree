/**
 * Facebook Conversions API tracking utilities
 * Handles client-side event tracking with server-side CAPI integration
 * 
 * IMPORTANT: fbclid must be captured on landing and persisted through the entire journey
 */

const FBCLID_STORAGE_KEY = 'fb_click_id';
const FBC_STORAGE_KEY = 'fb_fbc';
const FBP_STORAGE_KEY = 'fb_fbp';

/**
 * Initialize Facebook tracking - call this on app load
 * Captures fbclid from URL and stores it for the entire session
 */
export function initFacebookTracking(): void {
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  
  if (fbclid) {
    localStorage.setItem(FBCLID_STORAGE_KEY, fbclid);
    
    const timestamp = Math.floor(Date.now() / 1000);
    const fbc = `fb.1.${timestamp}.${fbclid}`;
    localStorage.setItem(FBC_STORAGE_KEY, fbc);
    
    document.cookie = `_fbc=${fbc}; max-age=7776000; path=/; SameSite=Lax`;
    
    console.log('[FB Tracking] Captured fbclid:', fbclid);
    console.log('[FB Tracking] Created fbc:', fbc);
  }
  
  let fbp = getFbpFromCookie();
  if (!fbp) {
    const timestamp = Math.floor(Date.now() / 1000);
    const random = Math.floor(Math.random() * 2147483647);
    fbp = `fb.1.${timestamp}.${random}`;
    document.cookie = `_fbp=${fbp}; max-age=7776000; path=/; SameSite=Lax`;
    localStorage.setItem(FBP_STORAGE_KEY, fbp);
    console.log('[FB Tracking] Created fbp:', fbp);
  } else {
    localStorage.setItem(FBP_STORAGE_KEY, fbp);
  }
}

/**
 * Get the Facebook Click ID - checks localStorage first, then URL
 */
export function getFbclid(): string | null {
  const stored = localStorage.getItem(FBCLID_STORAGE_KEY);
  if (stored) return stored;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('fbclid');
}

/**
 * Get the Facebook Browser ID cookie (_fbp)
 */
function getFbpFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') {
      return value;
    }
  }
  return null;
}

export function getFbp(): string | null {
  const stored = localStorage.getItem(FBP_STORAGE_KEY);
  if (stored) return stored;
  return getFbpFromCookie();
}

/**
 * Get the Facebook Click ID cookie (_fbc)
 */
function getFbcFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc') {
      return value;
    }
  }
  return null;
}

export function getFbc(): string | null {
  const stored = localStorage.getItem(FBC_STORAGE_KEY);
  if (stored) return stored;
  return getFbcFromCookie();
}

interface FacebookEventData {
  url?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  value?: number;
  currency?: string;
  contentName?: string;
}

/**
 * Get all tracking parameters for API calls
 */
function getTrackingParams() {
  const fbclid = getFbclid();
  const fbp = getFbp();
  const fbc = getFbc();
  
  console.log('[FB Tracking] Sending params:', { fbclid, fbp, fbc: fbc ? 'present' : 'null' });
  
  return { fbclid, fbp, fbc };
}

/**
 * Track ViewContent event (page view)
 */
export async function trackViewContent(data: FacebookEventData = {}): Promise<void> {
  try {
    const params = getTrackingParams();
    await fetch('/api/facebook-capi/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        ...params,
      }),
    });
  } catch (error) {
    console.error('Failed to track ViewContent:', error);
  }
}

/**
 * Track Lead event (email submission)
 */
export async function trackLead(data: FacebookEventData): Promise<void> {
  try {
    const params = getTrackingParams();
    await fetch('/api/facebook-capi/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        ...params,
      }),
    });
  } catch (error) {
    console.error('Failed to track Lead:', error);
  }
}

/**
 * Track InitiateCheckout event (checkout page reached)
 */
export async function trackInitiateCheckout(data: FacebookEventData): Promise<void> {
  try {
    const params = getTrackingParams();
    await fetch('/api/facebook-capi/initiate-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        value: data.value,
        currency: data.currency || 'USD',
        contentName: data.contentName,
        ...params,
      }),
    });
  } catch (error) {
    console.error('Failed to track InitiateCheckout:', error);
  }
}

/**
 * Track AddPaymentInfo event (payment form interaction)
 */
export async function trackAddPaymentInfo(data: FacebookEventData): Promise<void> {
  try {
    const params = getTrackingParams();
    await fetch('/api/facebook-capi/payment-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        ...params,
      }),
    });
  } catch (error) {
    console.error('Failed to track AddPaymentInfo:', error);
  }
}

// REMOVED: trackPurchase function
// Purchase events should ONLY be sent from server-side Stripe webhooks (payment_intent.succeeded)
// This prevents incorrect Purchase events from being tracked before payment is confirmed
// See: server/routes.ts - Stripe webhook handler
