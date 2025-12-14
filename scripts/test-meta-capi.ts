/**
 * Meta Conversion API Test Script
 *
 * Tests all event types with the new expanded user data parameters.
 * Run with: npx tsx scripts/test-meta-capi.ts
 *
 * Make sure FB_PIXEL_ID and FB_ACCESS_TOKEN are set in environment.
 */

import crypto from 'crypto';
import axios from 'axios';

// Configuration
const PIXEL_ID = process.env.FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE; // Optional - for test events panel
const API_VERSION = 'v21.0';

if (!PIXEL_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   FB_PIXEL_ID:', PIXEL_ID ? '✓' : '✗ MISSING');
  console.error('   FB_ACCESS_TOKEN:', ACCESS_TOKEN ? '✓' : '✗ MISSING');
  console.error('\nSet these in your environment before running this script.');
  process.exit(1);
}

// Hash function
function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

// Test user data with all the new fields
const testUserData = {
  // Core identifiers
  em: [hashSHA256('test@breakfree-capi-test.com')],
  ph: [hashSHA256('15551234567')],
  fn: [hashSHA256('John')],
  ln: [hashSHA256('Doe')],

  // Location data (Meta recommended)
  ct: [hashSHA256('newyork')], // City - lowercase, no spaces
  st: [hashSHA256('ny')],      // State - 2-letter code
  zp: [hashSHA256('10001')],   // Zip code - 5 digits
  country: [hashSHA256('us')], // Country - 2-letter ISO

  // Additional identifiers (Meta recommended)
  db: [hashSHA256('19900115')], // Date of birth - YYYYMMDD
  ge: [hashSHA256('m')],        // Gender - 'm' or 'f'
  external_id: [hashSHA256('cust_test_12345')], // Your unique customer ID

  // Browser/device data
  client_ip_address: '203.0.113.1',
  client_user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

// Event types to test
const eventTypes = [
  {
    name: 'ViewContent',
    customData: {
      content_name: 'Quiz Page',
      content_category: 'Quiz'
    }
  },
  {
    name: 'Lead',
    customData: {
      content_name: 'Email Capture',
      lead_type: 'Quiz Lead'
    }
  },
  {
    name: 'InitiateCheckout',
    customData: {
      value: 1.00,
      currency: 'USD',
      content_name: '7-Day Trial'
    }
  },
  {
    name: 'AddPaymentInfo',
    customData: {
      value: 1.00,
      currency: 'USD',
      content_name: 'Payment Form Interaction'
    }
  },
  {
    name: 'Purchase',
    customData: {
      value: 1.00,
      currency: 'USD',
      content_name: '7-Day Trial Purchase'
    }
  }
];

async function sendTestEvent(eventName: string, customData: any): Promise<boolean> {
  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = `test_${eventName.toLowerCase()}_${Date.now()}`;

  const payload = {
    data: [{
      event_name: eventName,
      event_time: eventTime,
      event_id: eventId,
      event_source_url: 'https://break-free-app.com/test',
      action_source: 'website',
      user_data: testUserData,
      custom_data: customData,
    }],
    ...(TEST_EVENT_CODE && { test_event_code: TEST_EVENT_CODE })
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      payload,
      {
        params: { access_token: ACCESS_TOKEN },
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    console.log(`✅ ${eventName}: Success`);
    console.log(`   Events received: ${response.data.events_received}`);
    console.log(`   Trace ID: ${response.data.fbtrace_id}`);
    return true;
  } catch (error: any) {
    console.log(`❌ ${eventName}: Failed`);
    console.log(`   Error: ${error.response?.data?.error?.message || error.message}`);
    if (error.response?.data?.error?.error_user_msg) {
      console.log(`   Details: ${error.response.data.error.error_user_msg}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Meta Conversion API Test - All Event Types                  ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Pixel ID: ${PIXEL_ID?.substring(0, 10)}...                                     ║`);
  console.log(`║  API Version: ${API_VERSION}                                           ║`);
  console.log(`║  Test Event Code: ${TEST_EVENT_CODE || 'Not set (events go to main feed)'}        ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('📊 User Data Parameters Being Sent:');
  console.log('   ✓ Email (em)');
  console.log('   ✓ Phone (ph)');
  console.log('   ✓ First Name (fn)');
  console.log('   ✓ Last Name (ln)');
  console.log('   ✓ City (ct)');
  console.log('   ✓ State (st)');
  console.log('   ✓ Zip Code (zp)');
  console.log('   ✓ Country (country)');
  console.log('   ✓ Date of Birth (db)');
  console.log('   ✓ Gender (ge)');
  console.log('   ✓ External ID (external_id)');
  console.log('   ✓ IP Address');
  console.log('   ✓ User Agent');
  console.log('\n');

  console.log('🧪 Sending Test Events...\n');

  let successCount = 0;
  let failCount = 0;

  for (const event of eventTypes) {
    const success = await sendTestEvent(event.name, event.customData);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay between events
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Test Results                                                ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  ✅ Successful: ${successCount}                                              ║`);
  console.log(`║  ❌ Failed: ${failCount}                                                  ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');

  if (TEST_EVENT_CODE) {
    console.log('\n📍 Check your events at:');
    console.log('   Meta Events Manager → Test Events tab');
  } else {
    console.log('\n📍 Check your events at:');
    console.log('   Meta Events Manager → Overview');
    console.log('   (Events may take a few minutes to appear)');
  }

  process.exit(failCount > 0 ? 1 : 0);
import FacebookCAPI from '../server/facebook-capi';

const pixelId = process.env.FB_PIXEL_ID || '';
const accessToken = process.env.FB_ACCESS_TOKEN || '';

if (!pixelId || !accessToken) {
  console.error('ERROR: FB_PIXEL_ID and FB_ACCESS_TOKEN environment variables are required');
  process.exit(1);
}

const fbCAPI = new FacebookCAPI(pixelId, accessToken);

async function runTests() {
  console.log('=== Meta CAPI Test Suite ===\n');
  
  // Wait for validation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const testEmail = 'test@example.com';
  const testEventId = `test_${Date.now()}`;
  const sourceUrl = 'https://test.example.com';
  
  const userData = {
    email: testEmail,
    firstName: 'Test',
  };
  
  console.log('1. Testing ViewContent event...');
  try {
    const viewResult = await fbCAPI.sendViewContent(
      `${sourceUrl}/quiz`,
      userData,
      { content_name: 'Test - Funnel Step 01' }
    );
    console.log('   ✓ ViewContent sent');
    console.log(`   Response: ${JSON.stringify(viewResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ ViewContent failed: ${err.message}\n`);
  }

  console.log('2. Testing Lead event...');
  try {
    const leadResult = await fbCAPI.sendLead(
      `${sourceUrl}/contact`,
      userData
    );
    console.log('   ✓ Lead sent');
    console.log(`   Response: ${JSON.stringify(leadResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ Lead failed: ${err.message}\n`);
  }

  console.log('3. Testing InitiateCheckout event...');
  try {
    const checkoutResult = await fbCAPI.sendInitiateCheckout(
      `${sourceUrl}/checkout`,
      userData,
      { value: 9.99, currency: 'USD', content_name: '7-Day Trial' }
    );
    console.log('   ✓ InitiateCheckout sent');
    console.log(`   Response: ${JSON.stringify(checkoutResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ InitiateCheckout failed: ${err.message}\n`);
  }

  console.log('4. Testing AddPaymentInfo event...');
  try {
    const paymentResult = await fbCAPI.sendAddPaymentInfo(
      `${sourceUrl}/payment`,
      userData
    );
    console.log('   ✓ AddPaymentInfo sent');
    console.log(`   Response: ${JSON.stringify(paymentResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ AddPaymentInfo failed: ${err.message}\n`);
  }

  console.log('5. Testing Purchase event...');
  try {
    const purchaseResult = await fbCAPI.sendPurchase(
      `${sourceUrl}/success`,
      userData,
      { value: 49.99, currency: 'USD', content_name: 'Premium Subscription' }
    );
    console.log('   ✓ Purchase sent');
    console.log(`   Response: ${JSON.stringify(purchaseResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ Purchase failed: ${err.message}\n`);
  }

  console.log('=== Test Complete ===');
  console.log('Check your Meta Events Manager to verify events were received.');
}

runTests().catch(console.error);
