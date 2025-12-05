import crypto from 'crypto';
import axios from 'axios';

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
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
  private apiVersion = 'v18.0'; // Using v18.0 for stability - widely supported
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

    if (userData.email) {
      hashed.em = this.hashSHA256(userData.email);
    }
    if (userData.phone) {
      const normalized = this.normalizePhone(userData.phone);
      hashed.ph = this.hashSHA256(normalized);
    }
    if (userData.firstName) {
      hashed.fn = this.hashSHA256(userData.firstName);
    }
    if (userData.lastName) {
      hashed.ln = this.hashSHA256(userData.lastName);
    }
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
      const eventTime = eventData.eventTime || Math.floor(Date.now() / 1000);
      const eventId = eventData.eventId || `${eventTime}-${Math.random().toString(36).substring(7)}`;

      const userData = this.buildUserData(eventData.userData);

      const payload = {
        data: [
          {
            event_name: eventData.eventName,
            event_time: eventTime,
            event_id: eventId,
            event_source_url: eventData.eventSourceUrl,
            action_source: 'website',
            user_data: userData,
            custom_data: eventData.customData || {}
          }
        ],
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
        console.log('    - Email:', userData.em ? `Yes (${userData.em.substring(0, 8)}...)` : 'No');
        console.log('    - Phone:', userData.ph ? `Yes (${userData.ph.substring(0, 8)}...)` : 'No');
        console.log('    - First Name:', userData.fn ? 'Yes' : 'No');
        console.log('    - Last Name:', userData.ln ? 'Yes' : 'No');
        console.log('    - IP Address:', userData.client_ip_address || 'No');
        console.log('    - User Agent:', userData.client_user_agent ? `Yes (${userData.client_user_agent.length} chars)` : 'No');
        console.log('    - FBC:', userData.fbc || 'No');
        console.log('    - FBP:', userData.fbp || 'No');
        if (eventData.customData && Object.keys(eventData.customData).length > 0) {
          console.log('  Custom Data:', JSON.stringify(eventData.customData, null, 2));
        }
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
