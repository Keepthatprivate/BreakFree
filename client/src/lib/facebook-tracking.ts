/**
 * Facebook Conversions API tracking utilities
 * Handles client-side event tracking with server-side CAPI integration
 * 
 * IMPORTANT: fbclid must be captured on landing and persisted through the entire journey
 * The _fbc format MUST be: fb.1.{timestamp_in_milliseconds}.{fbclid}
 */

const FBCLID_STORAGE_KEY = 'fb_click_id';
const FBC_STORAGE_KEY = 'fb_fbc';
const FBC_TIMESTAMP_KEY = 'fb_fbc_timestamp';
const FBP_STORAGE_KEY = 'fb_fbp';

/**
 * Initialize Facebook tracking - call this on app load
 * Captures fbclid from URL and stores it for the entire session
 * CRITICAL: Uses milliseconds for timestamp (not seconds!)
 */
export function initFacebookTracking(): void {
  captureFacebookClickId();
  ensureFbpExists();
}

/**
 * Capture fbclid from URL and create _fbc cookie
 * This should run on EVERY page load
 */
function captureFacebookClickId(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  
  if (fbclid) {
    // New fbclid in URL - always create fresh fbc
    localStorage.setItem(FBCLID_STORAGE_KEY, fbclid);
    
    // Create _fbc cookie in correct format: fb.1.{timestamp_in_milliseconds}.{fbclid}
    const timestamp = Date.now();
    const fbcValue = `fb.1.${timestamp}.${fbclid}`;
    
    // Store in localStorage
    localStorage.setItem(FBC_STORAGE_KEY, fbcValue);
    localStorage.setItem(FBC_TIMESTAMP_KEY, timestamp.toString());
    
    // Store in cookie for 90 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);
    document.cookie = `_fbc=${fbcValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    
    console.log('[FB Tracking] Captured fbclid:', fbclid);
    console.log('[FB Tracking] Created fbc with milliseconds:', fbcValue);
  } else {
    // No fbclid - validate existing fbc is not stale
    validateStoredFbc();
  }
}

/**
 * Validate stored fbc is not stale (>7 days old)
 * Clear it if too old to prevent sending invalid attribution data
 */
function validateStoredFbc(): void {
  try {
    const existingFbc = localStorage.getItem(FBC_STORAGE_KEY);
    if (existingFbc) {
      const parts = existingFbc.split('.');
      if (parts.length >= 3) {
        const fbcTimestamp = parseInt(parts[2], 10);
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        
        // If fbc is older than 7 days without a new fbclid, clear it
        if (Date.now() - fbcTimestamp > sevenDaysMs) {
          console.log('[FB Tracking] Clearing stale fbc (>7 days old)');
          localStorage.removeItem(FBC_STORAGE_KEY);
          localStorage.removeItem(FBCLID_STORAGE_KEY);
          localStorage.removeItem(FBC_TIMESTAMP_KEY);
          document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      }
    }
  } catch (e) {
    console.error('[FB Tracking] Error validating fbc:', e);
  }
}

/**
 * Ensure _fbp (browser ID) exists
 */
function ensureFbpExists(): void {
  let fbp = getFbpFromCookie();
  if (!fbp) {
    // Create _fbp in correct format: fb.1.{timestamp_in_milliseconds}.{random}
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 2147483647);
    fbp = `fb.1.${timestamp}.${random}`;
    
    // Store in cookie for 90 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);
    document.cookie = `_fbp=${fbp}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    
    localStorage.setItem(FBP_STORAGE_KEY, fbp);
    console.log('[FB Tracking] Created fbp:', fbp);
  } else {
    localStorage.setItem(FBP_STORAGE_KEY, fbp);
  }
}

/**
 * Get all Facebook cookies - checks both cookie and localStorage
 */
export function getFacebookCookies(): { fbc: string | null; fbp: string | null } {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
  
  return {
    fbc: cookies['_fbc'] || localStorage.getItem(FBC_STORAGE_KEY) || null,
    fbp: cookies['_fbp'] || localStorage.getItem(FBP_STORAGE_KEY) || null
  };
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
  // Check localStorage first (more reliable)
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
  // Check localStorage first (more reliable)
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
 * Includes client user agent for better matching
 */
function getTrackingParams() {
  const { fbc, fbp } = getFacebookCookies();
  const fbclid = getFbclid();
  const clientUserAgent = navigator.userAgent;
  
  console.log('[FB Tracking] Sending params:', { 
    fbclid, 
    fbp: fbp ? 'present' : 'null', 
    fbc: fbc ? 'present' : 'null',
    hasUserAgent: !!clientUserAgent
  });
  
  return { fbclid, fbp, fbc, clientUserAgent };
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
