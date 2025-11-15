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
}

class FacebookCAPI {
  private pixelId: string;
  private accessToken: string;
  private apiVersion = 'v21.0';
  private baseUrl = 'https://graph.facebook.com';

  constructor(pixelId: string, accessToken: string) {
    this.pixelId = pixelId;
    this.accessToken = accessToken;
  }

  private hashSHA256(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
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
    if (userData.fbc) {
      hashed.fbc = userData.fbc;
    }
    if (userData.fbp) {
      hashed.fbp = userData.fbp;
    }

    return hashed;
  }

  async sendEvent(eventData: EventData): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      const eventTime = Math.floor(Date.now() / 1000);
      const eventId = eventData.eventId || `${eventTime}-${Math.random().toString(36).substring(7)}`;

      const payload = {
        data: [
          {
            event_name: eventData.eventName,
            event_time: eventTime,
            event_id: eventId,
            event_source_url: eventData.eventSourceUrl,
            action_source: 'website',
            user_data: this.buildUserData(eventData.userData),
            custom_data: eventData.customData || {}
          }
        ],
        test_event_code: process.env.FB_TEST_EVENT_CODE || undefined
      };

      const url = `${this.baseUrl}/${this.apiVersion}/${this.pixelId}/events`;
      
      const response = await axios.post(url, payload, {
        params: {
          access_token: this.accessToken
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`[Facebook CAPI] ${eventData.eventName} sent successfully:`, {
        eventId,
        eventsReceived: response.data.events_received,
        fbTraceId: response.data.fbtrace_id
      });

      return {
        success: true,
        response: response.data
      };

    } catch (error: any) {
      console.error(`[Facebook CAPI] Error sending ${eventData.eventName}:`, {
        message: error.message,
        response: error.response?.data
      });

      return {
        success: false,
        error: error.message,
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

  async sendPurchase(eventSourceUrl: string, userData: UserData, customData: { value: number; currency: string; content_name?: string }): Promise<any> {
    return this.sendEvent({
      eventName: 'Purchase',
      eventSourceUrl,
      userData,
      customData
    });
  }
}

export default FacebookCAPI;
