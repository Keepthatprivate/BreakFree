#!/usr/bin/env npx tsx
/**
 * Test script to send a purchase event to the Stripe webhook
 * Usage: npx tsx scripts/test-purchase-webhook.ts
 *
 * This script can work in two modes:
 * 1. Development: Uses the test endpoint (no signature required)
 * 2. Production: Generates a valid Stripe webhook signature
 */

import Stripe from 'stripe';

// Default to production URL - can override with BASE_URL env var
const BASE_URL = process.env.BASE_URL || 'https://break-free-app.com';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_j8GcvGUDqybHNMyJJRcyiwvgTGnH7JB5';

interface TestConfig {
  paymentIntentId?: string;
  amount?: number;
  email?: string;
  name?: string;
  productName?: string;
}

async function testDevelopmentWebhook(config: TestConfig = {}) {
  console.log('\n🧪 Testing via Development Endpoint...\n');

  const testData = {
    eventType: 'checkout.session.completed',
    paymentIntentId: config.paymentIntentId || `pi_test_${Date.now()}`,
    amount: config.amount || 47.00,
    email: config.email || 'test@example.com',
    name: config.name || 'Test User',
    productName: config.productName || 'BreakFree Trial',
    fbc: 'fb.1.test.click_id',
    fbp: 'fb.1.test.browser_id'
  };

  console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/api/test-webhook/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('\n✅ Success!');
      console.log('📥 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Failed!');
      console.log('📥 Error:', JSON.stringify(result, null, 2));

      if (result.error?.includes('not found') || response.status === 404) {
        console.log('\n💡 Tip: The development test endpoint may not be available.');
        console.log('   Make sure NODE_ENV=development when starting the server.');
        console.log('   Or use the production webhook test below.');
      }
    }

    return result;
  } catch (error: any) {
    console.error('\n❌ Request failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure the server is running on', BASE_URL);
    }
    return null;
  }
}

async function testProductionWebhook(config: TestConfig = {}) {
  console.log('\n🔐 Testing via Production Webhook (with signature)...\n');

  const timestamp = Math.floor(Date.now() / 1000);
  const paymentIntentId = config.paymentIntentId || `pi_test_${Date.now()}`;

  // Construct a realistic checkout.session.completed event
  const event: Stripe.Event = {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    api_version: '2024-04-10' as any,
    created: timestamp,
    type: 'checkout.session.completed',
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    data: {
      object: {
        id: `cs_test_${Date.now()}`,
        object: 'checkout.session',
        payment_intent: paymentIntentId,
        payment_status: 'paid',
        status: 'complete',
        mode: 'payment',
        amount_total: (config.amount || 47) * 100, // cents
        currency: 'usd',
        customer_details: {
          email: config.email || 'test@example.com',
          name: config.name || 'Test User',
          phone: null,
          tax_exempt: 'none',
          tax_ids: [],
          address: null
        },
        metadata: {
          productName: config.productName || 'BreakFree Trial',
          fbc: 'fb.1.test.click_id',
          fbp: 'fb.1.test.browser_id',
          clientUserAgent: 'Mozilla/5.0 (Test)',
          clientIp: '127.0.0.1'
        },
        // Add required fields
        after_expiration: null,
        allow_promotion_codes: null,
        automatic_tax: { enabled: false, liability: null, status: null },
        billing_address_collection: null,
        cancel_url: 'https://break-free-app.com/checkout',
        client_reference_id: null,
        client_secret: null,
        consent: null,
        consent_collection: null,
        created: timestamp,
        custom_fields: [],
        custom_text: { after_submit: null, shipping_address: null, submit: null, terms_of_service_acceptance: null },
        customer: null,
        customer_creation: null,
        customer_email: config.email || 'test@example.com',
        expires_at: timestamp + 3600,
        invoice: null,
        invoice_creation: null,
        line_items: undefined,
        livemode: false,
        locale: null,
        payment_link: null,
        payment_method_collection: null,
        payment_method_configuration_details: null,
        payment_method_options: null,
        payment_method_types: ['card'],
        phone_number_collection: { enabled: false },
        recovered_from: null,
        redirect_on_completion: 'always',
        return_url: null,
        saved_payment_method_options: null,
        setup_intent: null,
        shipping_address_collection: null,
        shipping_cost: null,
        shipping_details: null,
        shipping_options: [],
        submit_type: null,
        subscription: null,
        success_url: 'https://break-free-app.com/success',
        total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
        ui_mode: 'hosted',
        url: null
      } as Stripe.Checkout.Session
    }
  };

  const payload = JSON.stringify(event);

  // Generate the signature
  const crypto = await import('crypto');
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  const stripeSignature = `t=${timestamp},v1=${signature}`;

  console.log('📤 Sending webhook event:', event.type);
  console.log('   Payment Intent ID:', paymentIntentId);
  console.log('   Amount:', `$${config.amount || 47}`);
  console.log('   Email:', config.email || 'test@example.com');

  try {
    const response = await fetch(`${BASE_URL}/api/webhook/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature,
      },
      body: payload
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    if (response.ok) {
      console.log('\n✅ Webhook processed successfully!');
      console.log('📥 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Webhook failed!');
      console.log('📥 Status:', response.status);
      console.log('📥 Response:', JSON.stringify(result, null, 2));
    }

    return result;
  } catch (error: any) {
    console.error('\n❌ Request failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure the server is running on', BASE_URL);
    }
    return null;
  }
}

async function testPaymentIntentSucceeded(config: TestConfig = {}) {
  console.log('\n🔐 Testing payment_intent.succeeded event...\n');

  const timestamp = Math.floor(Date.now() / 1000);
  const paymentIntentId = config.paymentIntentId || `pi_test_${Date.now()}`;

  // Construct a payment_intent.succeeded event
  const event: Stripe.Event = {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    api_version: '2024-04-10' as any,
    created: timestamp,
    type: 'payment_intent.succeeded',
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    data: {
      object: {
        id: paymentIntentId,
        object: 'payment_intent',
        amount: (config.amount || 47) * 100, // cents
        currency: 'usd',
        status: 'succeeded',
        receipt_email: config.email || 'test@example.com',
        metadata: {
          customerName: config.name || 'Test User',
          productName: config.productName || 'BreakFree Trial',
          fbc: 'fb.1.test.click_id',
          fbp: 'fb.1.test.browser_id',
          clientUserAgent: 'Mozilla/5.0 (Test)',
          clientIp: '127.0.0.1',
          createSubscription: 'true'
        },
        // Minimal required fields
        amount_capturable: 0,
        amount_received: (config.amount || 47) * 100,
        automatic_payment_methods: null,
        canceled_at: null,
        cancellation_reason: null,
        capture_method: 'automatic',
        client_secret: null,
        confirmation_method: 'automatic',
        created: timestamp,
        description: null,
        invoice: null,
        last_payment_error: null,
        latest_charge: `ch_test_${Date.now()}`,
        livemode: false,
        next_action: null,
        on_behalf_of: null,
        payment_method: `pm_test_${Date.now()}`,
        payment_method_configuration_details: null,
        payment_method_options: {},
        payment_method_types: ['card'],
        processing: null,
        review: null,
        setup_future_usage: null,
        shipping: null,
        source: null,
        statement_descriptor: null,
        statement_descriptor_suffix: null,
        transfer_data: null,
        transfer_group: null,
        application: null,
        application_fee_amount: null,
        customer: null
      } as Stripe.PaymentIntent
    }
  };

  const payload = JSON.stringify(event);

  const crypto = await import('crypto');
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  const stripeSignature = `t=${timestamp},v1=${signature}`;

  console.log('📤 Sending webhook event:', event.type);
  console.log('   Payment Intent ID:', paymentIntentId);
  console.log('   Amount:', `$${config.amount || 47}`);
  console.log('   Email:', config.email || 'test@example.com');

  try {
    const response = await fetch(`${BASE_URL}/api/webhook/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature,
      },
      body: payload
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    if (response.ok) {
      console.log('\n✅ Webhook processed successfully!');
      console.log('📥 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Webhook failed!');
      console.log('📥 Status:', response.status);
      console.log('📥 Response:', JSON.stringify(result, null, 2));
    }

    return result;
  } catch (error: any) {
    console.error('\n❌ Request failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure the server is running on', BASE_URL);
    }
    return null;
  }
}

// Main execution
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Stripe Purchase Webhook Test                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`\n🎯 Target: ${BASE_URL}`);

  const args = process.argv.slice(2);
  const mode = args[0] || 'production';

  const config: TestConfig = {
    email: 'test@example.com',
    name: 'Test User',
    amount: 47,
    productName: 'BreakFree Trial'
  };

  if (mode === 'dev' || mode === 'development') {
    await testDevelopmentWebhook(config);
  } else if (mode === 'payment-intent') {
    await testPaymentIntentSucceeded(config);
  } else {
    // Default: test production webhook with checkout.session.completed
    await testProductionWebhook(config);
  }

  console.log('\n');
}

main().catch(console.error);
