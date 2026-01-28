/**
 * Facebook Conversions API tracking utilities
 * Handles client-side event tracking with server-side CAPI integration
 *
 * IMPORTANT: fbclid must be captured on landing and persisted through the entire journey
 * The _fbc format MUST be: fb.1.{timestamp_in_milliseconds}.{fbclid}
 *
 * INP OPTIMIZATION: Uses sendBeacon for fire-and-forget requests that don't block main thread
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
          localStorage.removeItem(FBC_STORAGE_KEY);
          localStorage.removeItem(FBCLID_STORAGE_KEY);
          localStorage.removeItem(FBC_TIMESTAMP_KEY);
          document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      }
    }
  } catch {
    // Silently ignore errors
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
  // Core identifiers
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  // Location data (Meta recommended for better matching)
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  // Additional identifiers (Meta recommended)
  dateOfBirth?: string; // Format: YYYYMMDD
  gender?: 'm' | 'f';
  externalId?: string; // Your unique user/customer ID
  // Event data
  value?: number;
  currency?: string;
  contentName?: string;
}

/**
 * Get browser locale country code (2-letter ISO)
 * Falls back to null if not available
 */
function getBrowserCountry(): string | null {
  try {
    // Try to get country from navigator.language (e.g., 'en-US' -> 'US')
    const locale = navigator.language || (navigator as any).userLanguage;
    if (locale && locale.includes('-')) {
      const country = locale.split('-')[1]?.toUpperCase();
      if (country && country.length === 2) {
        return country;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get all tracking parameters for API calls
 * Includes client user agent and browser country for better matching
 */
function getTrackingParams() {
  const { fbc, fbp } = getFacebookCookies();
  const fbclid = getFbclid();
  const clientUserAgent = navigator.userAgent;
  const browserCountry = getBrowserCountry();

  return { fbclid, fbp, fbc, clientUserAgent, browserCountry };
}

/**
 * Send tracking data using sendBeacon (non-blocking) with fetch fallback
 * INP OPTIMIZATION: sendBeacon doesn't block the main thread
 */
function sendTrackingRequest(url: string, data: object): void {
  const payload = JSON.stringify(data);

  // Try sendBeacon first (non-blocking, works even on page unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    const sent = navigator.sendBeacon(url, blob);
    if (sent) return;
  }

  // Fallback to fetch with keepalive (non-blocking)
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true, // Allows request to outlive the page
  }).catch(() => {
    // Silently ignore errors - tracking shouldn't break the app
  });
}

/**
 * Track ViewContent event (page view)
 * Uses sendBeacon for non-blocking requests (INP optimization)
 * @param data.contentName - Unique page identifier for funnel analysis
 */
export function trackViewContent(data: FacebookEventData = {}): void {
  // Use requestIdleCallback to defer tracking until browser is idle
  const track = () => {
    const params = getTrackingParams();
    sendTrackingRequest('/api/facebook-capi/view', {
      url: data.url || window.location.href,
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country || params.browserCountry,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      externalId: data.externalId,
      contentName: data.contentName,
      ...params,
    });
  };

  // Defer to idle time if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(track, { timeout: 2000 });
  } else {
    setTimeout(track, 0);
  }
}

/**
 * Track Lead event (email submission)
 * Uses sendBeacon for non-blocking requests (INP optimization)
 */
export function trackLead(data: FacebookEventData): void {
  const params = getTrackingParams();
  sendTrackingRequest('/api/facebook-capi/lead', {
    url: data.url || window.location.href,
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    country: data.country || params.browserCountry,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    externalId: data.externalId,
    ...params,
  });
}

/**
 * Track InitiateCheckout event (checkout page reached)
 * Uses sendBeacon for non-blocking requests (INP optimization)
 */
export function trackInitiateCheckout(data: FacebookEventData): void {
  const params = getTrackingParams();
  sendTrackingRequest('/api/facebook-capi/initiate-checkout', {
    url: data.url || window.location.href,
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    country: data.country || params.browserCountry,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    externalId: data.externalId,
    value: data.value,
    currency: data.currency || 'USD',
    contentName: data.contentName,
    ...params,
  });
}

/**
 * Track AddPaymentInfo event (payment form interaction)
 * Uses sendBeacon for non-blocking requests (INP optimization)
 */
export function trackAddPaymentInfo(data: FacebookEventData): void {
  const params = getTrackingParams();
  sendTrackingRequest('/api/facebook-capi/payment-info', {
    url: data.url || window.location.href,
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    country: data.country || params.browserCountry,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    externalId: data.externalId,
    ...params,
  });
}
