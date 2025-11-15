import { Router, Request, Response } from 'express';
import FacebookCAPI from './facebook-capi';

const router = Router();

const pixelId = process.env.FB_PIXEL_ID || '';
const accessToken = process.env.FB_ACCESS_TOKEN || '';

if (!pixelId || !accessToken) {
  console.warn('[Facebook CAPI] Missing FB_PIXEL_ID or FB_ACCESS_TOKEN environment variables');
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

export default router;
