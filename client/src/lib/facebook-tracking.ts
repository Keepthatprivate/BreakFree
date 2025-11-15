/**
 * Facebook Conversions API tracking utilities
 * Handles client-side event tracking with server-side CAPI integration
 */

/**
 * Get the Facebook Click ID from URL parameters
 */
export function getFbclid(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('fbclid');
}

/**
 * Get the Facebook Browser ID cookie (_fbp)
 */
export function getFbp(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') {
      return value;
    }
  }
  return null;
}

/**
 * Get the Facebook Click ID cookie (_fbc)
 */
export function getFbc(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc') {
      return value;
    }
  }
  return null;
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
 * Track ViewContent event (page view)
 */
export async function trackViewContent(data: FacebookEventData = {}): Promise<void> {
  try {
    await fetch('/api/facebook-capi/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fbclid: getFbclid(),
        fbp: getFbp(),
        fbc: getFbc(),
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
    await fetch('/api/facebook-capi/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fbclid: getFbclid(),
        fbp: getFbp(),
        fbc: getFbc(),
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
    await fetch('/api/facebook-capi/initiate-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        value: data.value,
        currency: data.currency || 'EUR',
        contentName: data.contentName,
        fbclid: getFbclid(),
        fbp: getFbp(),
        fbc: getFbc(),
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
    await fetch('/api/facebook-capi/payment-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fbclid: getFbclid(),
        fbp: getFbp(),
        fbc: getFbc(),
      }),
    });
  } catch (error) {
    console.error('Failed to track AddPaymentInfo:', error);
  }
}

/**
 * Track Purchase event (payment completed)
 */
export async function trackPurchase(data: FacebookEventData): Promise<void> {
  try {
    await fetch('/api/facebook-capi/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url || window.location.href,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        value: data.value,
        currency: data.currency || 'EUR',
        contentName: data.contentName,
        fbclid: getFbclid(),
        fbp: getFbp(),
        fbc: getFbc(),
      }),
    });
  } catch (error) {
    console.error('Failed to track Purchase:', error);
  }
}
