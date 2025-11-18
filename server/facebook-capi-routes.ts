import { Router, Request, Response } from 'express';
import FacebookCAPI from './facebook-capi';
import axios from 'axios';

const router = Router();

// Strict environment variable validation - NO FALLBACKS
const pixelId = process.env.FB_PIXEL_ID;
const accessToken = process.env.FB_ACCESS_TOKEN;

if (!pixelId || !accessToken) {
  console.error('╔════════════════════════════════════════════════════════════╗');
  console.error('║  CRITICAL ERROR: Facebook CAPI Configuration Missing      ║');
  console.error('╠════════════════════════════════════════════════════════════╣');
  console.error('║  Required environment variables:                           ║');
  console.error(`║  - FB_PIXEL_ID: ${pixelId ? '✓ Set' : '✗ MISSING'}                                      ║`);
  console.error(`║  - FB_ACCESS_TOKEN: ${accessToken ? '✓ Set' : '✗ MISSING'}                              ║`);
  console.error('║                                                            ║');
  console.error('║  Facebook Conversions API will NOT work until these       ║');
  console.error('║  are properly configured in your Replit Secrets.          ║');
  console.error('╚════════════════════════════════════════════════════════════╝');
  
  throw new Error('Missing required Facebook CAPI environment variables');
}

const fbCAPI = new FacebookCAPI(pixelId, accessToken);

interface FailedEvent {
  timestamp: number;
  eventData: any;
  attempts: number;
  lastError?: string;
}

const failedEventsQueue: FailedEvent[] = [];
const MAX_RETRY_ATTEMPTS = 3;

function extractUserData(req: Request, body: any) {
  const ip = req.ip || req.socket.remoteAddress || '';
  const userAgent = req.get('user-agent') || '';
  
  let fbc = body.fbc;
  if (!fbc && body.fbclid) {
    fbc = `fb.1.${Date.now()}.${body.fbclid}`;
  }

  return {
    email: body.email,
    phone: body.phone,
    firstName: body.firstName,
    lastName: body.lastName,
    ip,
    userAgent,
    fbc,
    fbp: body.fbp
  };
}

async function sendWithRetry(sendFunction: () => Promise<any>, eventData: any) {
  const result = await sendFunction();
  
  if (!result.success) {
    failedEventsQueue.push({
      timestamp: Date.now(),
      eventData,
      attempts: 1,
      lastError: result.error
    });
    console.log(`[Facebook CAPI] Event added to retry queue. Queue size: ${failedEventsQueue.length}`);
  }
  
  return result;
}

setInterval(async () => {
  if (failedEventsQueue.length === 0) return;

  console.log(`[Facebook CAPI] Processing retry queue (${failedEventsQueue.length} events)`);

  const toRetry = failedEventsQueue.splice(0, 5);

  for (const event of toRetry) {
    if (event.attempts >= MAX_RETRY_ATTEMPTS) {
      console.error(`[Facebook CAPI] Event failed after ${MAX_RETRY_ATTEMPTS} attempts:`, event.eventData);
      continue;
    }

    const result = await fbCAPI.sendEvent(event.eventData);
    
    if (!result.success) {
      event.attempts++;
      event.lastError = result.error;
      failedEventsQueue.push(event);
    } else {
      console.log(`[Facebook CAPI] Retry successful for event after ${event.attempts} attempts`);
    }
  }
}, 30000);

router.post('/view', async (req: Request, res: Response) => {
  try {
    const userData = extractUserData(req, req.body);
    const eventSourceUrl = req.body.url || 'https://break-free-app.com/quiz';

    const result = await sendWithRetry(
      () => fbCAPI.sendViewContent(eventSourceUrl, userData),
      { eventName: 'ViewContent', eventSourceUrl, userData }
    );

    res.json({ success: result.success, message: 'ViewContent event tracked' });
  } catch (error: any) {
    console.error('[Facebook CAPI] Error in /view:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/lead', async (req: Request, res: Response) => {
  try {
    const userData = extractUserData(req, req.body);
    const eventSourceUrl = req.body.url || 'https://break-free-app.com/quiz';

    const result = await sendWithRetry(
      () => fbCAPI.sendLead(eventSourceUrl, userData),
      { eventName: 'Lead', eventSourceUrl, userData }
    );

    res.json({ success: result.success, message: 'Lead event tracked' });
  } catch (error: any) {
    console.error('[Facebook CAPI] Error in /lead:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/initiate-checkout', async (req: Request, res: Response) => {
  try {
    const userData = extractUserData(req, req.body);
    const eventSourceUrl = req.body.url || 'https://break-free-app.com/checkout';
    const customData = {
      content_name: req.body.contentName || 'Quiz Checkout',
      value: req.body.value || 0,
      currency: req.body.currency || 'USD'
    };

    const result = await sendWithRetry(
      () => fbCAPI.sendInitiateCheckout(eventSourceUrl, userData, customData),
      { eventName: 'InitiateCheckout', eventSourceUrl, userData, customData }
    );

    res.json({ success: result.success, message: 'InitiateCheckout event tracked' });
  } catch (error: any) {
    console.error('[Facebook CAPI] Error in /initiate-checkout:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/payment-info', async (req: Request, res: Response) => {
  try {
    const userData = extractUserData(req, req.body);
    const eventSourceUrl = req.body.url || 'https://break-free-app.com/checkout';

    const result = await sendWithRetry(
      () => fbCAPI.sendAddPaymentInfo(eventSourceUrl, userData),
      { eventName: 'AddPaymentInfo', eventSourceUrl, userData }
    );

    res.json({ success: result.success, message: 'AddPaymentInfo event tracked' });
  } catch (error: any) {
    console.error('[Facebook CAPI] Error in /payment-info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/purchase', async (req: Request, res: Response) => {
  try {
    const userData = extractUserData(req, req.body);
    const eventSourceUrl = req.body.url || 'https://break-free-app.com';
    const customData = {
      value: req.body.value || 0,
      currency: req.body.currency || 'USD',
      content_name: req.body.contentName || 'Purchase'
    };

    const result = await sendWithRetry(
      () => fbCAPI.sendPurchase(eventSourceUrl, userData, customData),
      { eventName: 'Purchase', eventSourceUrl, userData, customData }
    );

    res.json({ success: result.success, message: 'Purchase event tracked' });
  } catch (error: any) {
    console.error('[Facebook CAPI] Error in /purchase:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/queue', (req: Request, res: Response) => {
  res.json({
    queueSize: failedEventsQueue.length,
    events: failedEventsQueue.map(e => ({
      timestamp: new Date(e.timestamp).toISOString(),
      attempts: e.attempts,
      eventName: e.eventData.eventName,
      lastError: e.lastError
    }))
  });
});

router.post('/test-event', async (req: Request, res: Response) => {
  try {
    const testData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      ip: req.ip || '127.0.0.1',
      userAgent: req.get('user-agent') || 'TestAgent'
    };

    const result = await fbCAPI.sendEvent({
      eventName: 'PageView',
      eventSourceUrl: 'https://break-free-app.com/test',
      userData: testData
    });

    res.json({
      success: result.success,
      message: 'Test event sent',
      result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DIAGNOSTIC ROUTE: Dedicated CAPI test endpoint
router.get('/debug/test-capi', async (req: Request, res: Response) => {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  Facebook CAPI Diagnostic Test - Starting                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const testEventData = {
      eventName: 'Purchase',
      eventSourceUrl: 'https://break-free-app.com/debug-test',
      userData: {
        email: 'diagnostic@breakfree.test',
        firstName: 'Diagnostic',
        lastName: 'Test',
        ip: req.ip || '127.0.0.1',
        userAgent: req.get('user-agent') || 'Mozilla/5.0 (Test Agent) DiagnosticCAPI/1.0'
      },
      customData: {
        value: 9.99,
        currency: 'EUR',
        content_name: 'Diagnostic Test Purchase'
      }
    };

    console.log('Test Event Details:');
    console.log('  Event Name:', testEventData.eventName);
    console.log('  Event URL:', testEventData.eventSourceUrl);
    console.log('  Has Email:', !!testEventData.userData.email);
    console.log('  Has Name:', !!(testEventData.userData.firstName && testEventData.userData.lastName));
    console.log('  Client IP:', testEventData.userData.ip);
    console.log('  User Agent Length:', testEventData.userData.userAgent?.length || 0);
    console.log('  Purchase Value:', testEventData.customData.value, testEventData.customData.currency);

    const result = await fbCAPI.sendEvent(testEventData);

    console.log('\n✓ Facebook Response:', JSON.stringify(result.response, null, 2));
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  Check Facebook Events Manager → Test Events tab now      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    res.json({
      success: result.success,
      message: 'Diagnostic test event sent to Facebook CAPI',
      testEventDetails: {
        eventName: testEventData.eventName,
        eventSourceUrl: testEventData.eventSourceUrl,
        hasEmail: !!testEventData.userData.email,
        hasUserData: !!testEventData.userData,
        purchaseValue: testEventData.customData.value,
        currency: testEventData.customData.currency
      },
      facebookResponse: result.response,
      instructions: 'Check Facebook Events Manager → Test Events tab. If you set FB_TEST_EVENT_CODE, events will appear there. Otherwise check the main events feed.'
    });
  } catch (error: any) {
    console.error('\n✗ Diagnostic Test Failed:', error.message);
    console.error('Full Error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'No additional details',
      troubleshooting: {
        pixelId: `Using pixel: ${pixelId}`,
        tokenConfigured: !!accessToken,
        tokenLength: accessToken?.length || 0
      }
    });
  }
});

// HEALTHCHECK ROUTE: System status endpoint with permission validation
router.get('/debug/health', async (req: Request, res: Response) => {
  const health: any = {
    ok: true,
    timestamp: new Date().toISOString(),
    facebook: {
      pixelIdDefined: !!pixelId,
      pixelIdValue: pixelId ? `${pixelId.substring(0, 4)}...${pixelId.substring(pixelId.length - 4)}` : 'NOT SET',
      tokenDefined: !!accessToken,
      tokenLength: accessToken?.length || 0,
      testEventCode: process.env.FB_TEST_EVENT_CODE ? 'CONFIGURED' : 'Not set (optional)'
    },
    server: {
      nodeEnv: process.env.NODE_ENV || 'development',
      requestIp: req.ip || 'unknown',
      trustProxy: req.app.get('trust proxy') || false
    },
    retryQueue: {
      size: failedEventsQueue.length,
      oldestEvent: failedEventsQueue.length > 0 
        ? new Date(failedEventsQueue[0].timestamp).toISOString() 
        : null
    }
  };

  // Validate token has permission to access pixel
  if (pixelId && accessToken) {
    try {
      const permissionCheck = await axios.get(
        `https://graph.facebook.com/v21.0/${pixelId}`,
        {
          params: {
            fields: 'name,is_unavailable',
            access_token: accessToken
          },
          timeout: 5000
        }
      );

      health.facebook.pixelAccessible = true;
      health.facebook.pixelName = permissionCheck.data.name || 'Unknown';
      health.facebook.pixelStatus = permissionCheck.data.is_unavailable ? 'UNAVAILABLE' : 'ACTIVE';
      
      console.log('✅ Pixel access validated:', {
        pixelId,
        name: permissionCheck.data.name,
        accessible: true
      });
    } catch (error: any) {
      health.ok = false;
      health.facebook.pixelAccessible = false;
      health.facebook.permissionError = error.response?.data?.error?.message || error.message;
      health.facebook.errorCode = error.response?.data?.error?.code;
      
      console.error('❌ CRITICAL: Token cannot access pixel!');
      console.error('   Error:', error.response?.data?.error?.message);
      console.error('   This means events are being SILENTLY DROPPED by Facebook');
      console.error('   You must generate a new access token from Events Manager');
    }
  }

  res.json(health);
});

export default router;
