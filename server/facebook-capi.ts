import crypto from 'crypto';
import axios from 'axios';

interface UserData {
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
  gender?: 'm' | 'f'; // 'm' for male, 'f' for female
  externalId?: string; // Your unique customer/user ID

  // Browser/device data
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;

  // Facebook Login (if user logged in via FB)
  fbLoginId?: string;
}

interface EventData {
  eventName: string;
  eventSourceUrl: string;
  userData: UserData;
  customData?: Record<string, any>;
  eventId?: string;
  eventTime?: number;
}

class FacebookCAPI {
  private pixelId: string;
  private accessToken: string;
  private apiVersion = 'v21.0'; // Using v21.0 for latest features and better matching
  private baseUrl = 'https://graph.facebook.com';
  private isValidated = false;
  private validationError: string | null = null;

  constructor(pixelId: string, accessToken: string) {
    this.pixelId = pixelId;
    this.accessToken = accessToken;
    
    // Validate on startup
    this.validateCredentials();
  }

  private async validateCredentials(): Promise<void> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.apiVersion}/${this.pixelId}`,
        {
          params: {
            fields: 'name,id',
            access_token: this.accessToken
          },
          timeout: 10000
        }
      );
      this.isValidated = true;
      console.log(`[Facebook CAPI] Connected to Pixel: ${response.data.name} (${response.data.id})`);
    } catch (error: any) {
      this.validationError = error.response?.data?.error?.message || error.message;
      console.error(`[Facebook CAPI] WARNING: Token validation failed - ${this.validationError}`);
      console.error('[Facebook CAPI] Events will still be attempted, but may fail.');
    }
  }

  getStatus(): { isValidated: boolean; error: string | null } {
    return { isValidated: this.isValidated, error: this.validationError };
  }

  private hashSHA256(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Validate fbc parameter format and timestamp
   * Format: fb.1.[13-digit-timestamp].[fbclid]
   * Returns validated fbc or null if invalid
   */
  private validateFbc(fbc: string | undefined): string | null {
    if (!fbc) return null;
    
    // Check format: fb.1.[timestamp].[fbclid]
    const fbcRegex = /^fb\.1\.(\d{13})\.(.+)$/;
    const match = fbc.match(fbcRegex);
    
    if (!match) {
      console.warn('[Facebook CAPI] Invalid fbc format:', fbc.substring(0, 30) + '...');
      return null;
    }
    
    const timestamp = parseInt(match[1], 10);
    const now = Date.now();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Check if timestamp is in the future (with 1 day tolerance for clock skew)
    if (timestamp > now + oneDayMs) {
      console.warn('[Facebook CAPI] fbc timestamp is in the future, excluding:', {
        fbcTimestamp: new Date(timestamp).toISOString(),
        currentTime: new Date(now).toISOString()
      });
      return null;
    }
    
    // Check if timestamp is older than 90 days
    if (timestamp < now - ninetyDaysMs) {
      console.warn('[Facebook CAPI] fbc timestamp is older than 90 days, excluding:', {
        fbcTimestamp: new Date(timestamp).toISOString(),
        age: Math.floor((now - timestamp) / (24 * 60 * 60 * 1000)) + ' days'
      });
      return null;
    }
    
    return fbc;
  }

  /**
   * Validate fbp parameter format and timestamp
   * Format: fb.1.[13-digit-timestamp].[random]
   * Returns validated fbp or null if invalid
   */
  private validateFbp(fbp: string | undefined): string | null {
    if (!fbp) return null;
    
    // Check format: fb.1.[timestamp].[random]
    const fbpRegex = /^fb\.1\.(\d{13})\.(\d+)$/;
    const match = fbp.match(fbpRegex);
    
    if (!match) {
      console.warn('[Facebook CAPI] Invalid fbp format:', fbp.substring(0, 30) + '...');
      return null;
    }
    
    const timestamp = parseInt(match[1], 10);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Check if timestamp is in the future (with 1 day tolerance)
    if (timestamp > now + oneDayMs) {
      console.warn('[Facebook CAPI] fbp timestamp is in the future, excluding');
      return null;
    }
    
    return fbp;
  }

  private buildUserData(userData: UserData): any {
    const hashed: any = {};

    // Meta expects em and ph as arrays (even for single values)
    if (userData.email) {
      const hashedEmail = this.hashSHA256(userData.email);
      if (hashedEmail) {
        hashed.em = [hashedEmail];
      }
    }
    if (userData.phone) {
      const normalized = this.normalizePhone(userData.phone);
      const hashedPhone = this.hashSHA256(normalized);
      if (hashedPhone) {
        hashed.ph = [hashedPhone];
      }
    }
    // First and last name also as arrays per Meta's format
    if (userData.firstName) {
      const hashedFn = this.hashSHA256(userData.firstName);
      if (hashedFn) {
        hashed.fn = [hashedFn];
      }
    }
    if (userData.lastName) {
      const hashedLn = this.hashSHA256(userData.lastName);
      if (hashedLn) {
        hashed.ln = [hashedLn];
      }
    }

    // Location data (Meta recommended for better matching)
    if (userData.city) {
      // Cities should be lowercase, no spaces, no special characters
      const normalizedCity = userData.city.toLowerCase().replace(/[^a-z]/g, '');
      const hashedCity = this.hashSHA256(normalizedCity);
      if (hashedCity) {
        hashed.ct = [hashedCity];
      }
    }
    if (userData.state) {
      // States should be 2-letter code, lowercase
      const normalizedState = userData.state.toLowerCase().replace(/[^a-z]/g, '').substring(0, 2);
      const hashedState = this.hashSHA256(normalizedState);
      if (hashedState) {
        hashed.st = [hashedState];
      }
    }
    if (userData.zipCode) {
      // Zip codes - US format: first 5 digits only
      const normalizedZip = userData.zipCode.replace(/[^0-9]/g, '').substring(0, 5);
      if (normalizedZip.length >= 5) {
        const hashedZip = this.hashSHA256(normalizedZip);
        if (hashedZip) {
          hashed.zp = [hashedZip];
        }
      }
    }
    if (userData.country) {
      // Country should be 2-letter ISO code, lowercase
      const normalizedCountry = userData.country.toLowerCase().substring(0, 2);
      const hashedCountry = this.hashSHA256(normalizedCountry);
      if (hashedCountry) {
        hashed.country = [hashedCountry];
      }
    }

    // Additional identifiers (Meta recommended)
    if (userData.dateOfBirth) {
      // Date of birth should be YYYYMMDD format
      const normalizedDob = userData.dateOfBirth.replace(/[^0-9]/g, '');
      if (normalizedDob.length === 8) {
        const hashedDob = this.hashSHA256(normalizedDob);
        if (hashedDob) {
          hashed.db = [hashedDob];
        }
      }
    }
    if (userData.gender) {
      // Gender should be 'm' or 'f', lowercase
      const hashedGender = this.hashSHA256(userData.gender.toLowerCase());
      if (hashedGender) {
        hashed.ge = [hashedGender];
      }
    }
    if (userData.externalId) {
      // External ID - your unique customer identifier (hashed)
      const hashedExternalId = this.hashSHA256(userData.externalId);
      if (hashedExternalId) {
        hashed.external_id = [hashedExternalId];
      }
    }

    // Facebook Login ID (if user logged in via Facebook)
    if (userData.fbLoginId) {
      // FB Login ID is NOT hashed - sent as-is
      hashed.fb_login_id = userData.fbLoginId;
    }

    // Browser/device data (not hashed)
    if (userData.ip) {
      hashed.client_ip_address = userData.ip;
    }
    if (userData.userAgent) {
      hashed.client_user_agent = userData.userAgent;
    }

    // Validate fbc before including - Meta rejects events with invalid creation times
    const validatedFbc = this.validateFbc(userData.fbc);
    if (validatedFbc) {
      hashed.fbc = validatedFbc;
    }

    // Validate fbp before including
    const validatedFbp = this.validateFbp(userData.fbp);
    if (validatedFbp) {
      hashed.fbp = validatedFbp;
    }

    return hashed;
  }

  async sendEvent(eventData: EventData): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      let eventTime = eventData.eventTime || Math.floor(Date.now() / 1000);
      const eventId = eventData.eventId || `${eventTime}-${Math.random().toString(36).substring(7)}`;

      const userData = this.buildUserData(eventData.userData);

      // CRITICAL FIX: Validate event_time against fbc timestamp
      // Meta requires that event_time (creationTime) must be AFTER the fbc click timestamp
      if (userData.fbc) {
        const fbcRegex = /^fb\.1\.(\d{13})\.(.+)$/;
        const fbcMatch = userData.fbc.match(fbcRegex);
        
        if (fbcMatch) {
          const fbcTimestampMs = parseInt(fbcMatch[1], 10);
          const fbcTimestampSec = Math.floor(fbcTimestampMs / 1000);
          
          // If event_time is before or equal to fbc timestamp, adjust it
          // Meta requires event_time to be at least 1 second after fbc timestamp
          if (eventTime <= fbcTimestampSec) {
            const adjustedTime = fbcTimestampSec + 1;
            console.warn(`[Facebook CAPI] Adjusted event_time from ${eventTime} to ${adjustedTime} (must be after fbc timestamp ${fbcTimestampSec})`);
            eventTime = adjustedTime;
          }
        }
      }

      const eventPayload: any = {
        event_name: eventData.eventName,
        event_time: eventTime,
        event_id: eventId,
        event_source_url: eventData.eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: eventData.customData || {},
        // Add original_event_data for better deduplication with browser pixel
        original_event_data: {
          event_name: eventData.eventName,
          event_time: eventTime
        }
      };

      const payload = {
        data: [eventPayload],
        test_event_code: process.env.FB_TEST_EVENT_CODE || undefined
      };

      // Enhanced logging in development mode
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        console.log('\n📤 Sending Facebook CAPI Event:');
        console.log('  Event:', eventData.eventName);
        console.log('  Event ID:', eventId);
        console.log('  Source URL:', eventData.eventSourceUrl);
        console.log('  Event Time:', new Date(eventTime * 1000).toISOString());
        console.log('  User Data Present:');
        // Core identifiers
        console.log('    - Email:', userData.em?.length ? `Yes (${userData.em[0].substring(0, 8)}...)` : 'No');
        console.log('    - Phone:', userData.ph?.length ? `Yes (${userData.ph[0].substring(0, 8)}...)` : 'No');
        console.log('    - First Name:', userData.fn?.length ? 'Yes' : 'No');
        console.log('    - Last Name:', userData.ln?.length ? 'Yes' : 'No');
        // Location data (Meta recommended)
        console.log('    - City:', userData.ct?.length ? 'Yes' : 'No');
        console.log('    - State:', userData.st?.length ? 'Yes' : 'No');
        console.log('    - Zip Code:', userData.zp?.length ? 'Yes' : 'No');
        console.log('    - Country:', userData.country?.length ? 'Yes' : 'No');
        // Additional identifiers
        console.log('    - Date of Birth:', userData.db?.length ? 'Yes' : 'No');
        console.log('    - Gender:', userData.ge?.length ? 'Yes' : 'No');
        console.log('    - External ID:', userData.external_id?.length ? 'Yes' : 'No');
        console.log('    - FB Login ID:', userData.fb_login_id ? 'Yes' : 'No');
        // Browser/device data
        console.log('    - IP Address:', userData.client_ip_address || 'No');
        console.log('    - User Agent:', userData.client_user_agent ? `Yes (${userData.client_user_agent.length} chars)` : 'No');
        console.log('    - FBC:', userData.fbc || 'No');
        console.log('    - FBP:', userData.fbp || 'No');
        if (eventData.customData && Object.keys(eventData.customData).length > 0) {
          console.log('  Custom Data:', JSON.stringify(eventData.customData, null, 2));
        }
        console.log('  Original Event Data: Included for deduplication');
        if (payload.test_event_code) {
          console.log('  🧪 Test Event Code:', payload.test_event_code);
        }
      }

      const url = `${this.baseUrl}/${this.apiVersion}/${this.pixelId}/events`;
      
      const response = await axios.post(url, payload, {
        params: {
          access_token: this.accessToken
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (isDev) {
        console.log('✅ Facebook Response:');
        console.log('  Events Received:', response.data.events_received);
        console.log('  FB Trace ID:', response.data.fbtrace_id);
        if (response.data.messages) {
          console.log('  Messages:', response.data.messages);
        }
      } else {
        console.log(`[Facebook CAPI] ${eventData.eventName} sent successfully:`, {
          eventId,
          eventsReceived: response.data.events_received,
          fbTraceId: response.data.fbtrace_id
        });
      }

      return {
        success: true,
        response: response.data
      };

    } catch (error: any) {
      const isDev = process.env.NODE_ENV !== 'production';
      
      if (isDev) {
        console.error('\n❌ Facebook CAPI Error:');
        console.error('  Event:', eventData.eventName);
        console.error('  Error Message:', error.message);
        console.error('  HTTP Status:', error.response?.status);
        
        if (error.response?.data) {
          console.error('  Facebook Error Details:');
          console.error('    ', JSON.stringify(error.response.data, null, 4));
        }
        
        if (error.config?.url) {
          console.error('  API URL:', error.config.url.replace(this.accessToken, 'TOKEN_HIDDEN'));
        }
      } else {
        console.error(`[Facebook CAPI] Error sending ${eventData.eventName}:`, {
          message: error.message,
          status: error.response?.status,
          fbError: error.response?.data?.error?.message
        });
      }

      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async sendViewContent(eventSourceUrl: string, userData: UserData): Promise<any> {
    return this.sendEvent({
      eventName: 'ViewContent',
      eventSourceUrl,
      userData
    });
  }

  async sendLead(eventSourceUrl: string, userData: UserData): Promise<any> {
    return this.sendEvent({
      eventName: 'Lead',
      eventSourceUrl,
      userData
    });
  }

  async sendInitiateCheckout(eventSourceUrl: string, userData: UserData, customData?: any): Promise<any> {
    return this.sendEvent({
      eventName: 'InitiateCheckout',
      eventSourceUrl,
      userData,
      customData
    });
  }

  async sendAddPaymentInfo(eventSourceUrl: string, userData: UserData): Promise<any> {
    return this.sendEvent({
      eventName: 'AddPaymentInfo',
      eventSourceUrl,
      userData
    });
  }

  async sendPurchase(
    eventSourceUrl: string, 
    userData: UserData, 
    customData: { value: number; currency: string; content_name?: string },
    options?: { eventId?: string; eventTime?: number }
  ): Promise<any> {
    return this.sendEvent({
      eventName: 'Purchase',
      eventSourceUrl,
      userData,
      customData,
      eventId: options?.eventId,
      eventTime: options?.eventTime
    });
  }

  async sendPaymentFailed(eventSourceUrl: string, userData: UserData, customData?: { value?: number; currency?: string; content_name?: string; error_reason?: string }): Promise<any> {
    return this.sendEvent({
      eventName: 'PaymentFailed',
      eventSourceUrl,
      userData,
      customData: {
        ...customData,
        status: 'failed'
      }
    });
  }
}

export default FacebookCAPI;
