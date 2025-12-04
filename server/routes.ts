import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auth } from "./auth";
import Stripe from "stripe";
import { getUncachableResendClient } from "./resend-client";
import { generateResultsEmail, generatePurchaseConfirmationEmail } from "./email-templates";
import { analyzeQuizAnswers } from "./quiz-analyzer";
import facebookCapiRoutes from "./facebook-capi-routes";
import FacebookCAPI from "./facebook-capi";
import { db } from "./db";
import { conversionEvents, subscriptions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Facebook CAPI for server-side purchase tracking
const fbPixelId = process.env.FB_PIXEL_ID;
const fbAccessToken = process.env.FB_ACCESS_TOKEN;
const fbCAPI = (fbPixelId && fbAccessToken) ? new FacebookCAPI(fbPixelId, fbAccessToken) : null;

if (!fbCAPI) {
  console.warn('[Stripe Webhook] Facebook CAPI not configured - purchase events will not be tracked server-side');
}

// Deduplication helper: Check if event already processed and insert if not
async function checkAndRecordConversionEvent(
  eventId: string,
  stripeEventId: string,
  eventType: string,
  amount?: number,
  currency?: string,
  customerEmail?: string
): Promise<{ isDuplicate: boolean; error?: string }> {
  try {
    // Check if event_id (PaymentIntent ID) already exists
    const existingByEventId = await db.select()
      .from(conversionEvents)
      .where(eq(conversionEvents.eventId, eventId))
      .limit(1);

    if (existingByEventId.length > 0) {
      console.log(`[Dedup] Duplicate prevented: event_id ${eventId} already processed`);
      return { isDuplicate: true };
    }

    // Check if stripe_event_id already exists (idempotency check)
    const existingByStripeEventId = await db.select()
      .from(conversionEvents)
      .where(eq(conversionEvents.stripeEventId, stripeEventId))
      .limit(1);

    if (existingByStripeEventId.length > 0) {
      console.log(`[Dedup] Duplicate prevented: stripe_event_id ${stripeEventId} already processed`);
      return { isDuplicate: true };
    }

    // Insert new record (transaction-safe)
    await db.insert(conversionEvents).values({
      eventId,
      stripeEventId,
      eventType,
      amount: amount?.toString(),
      currency,
      customerEmail,
    });

    console.log(`[Dedup] New event recorded: ${eventId} (${eventType})`);
    return { isDuplicate: false };
  } catch (error: any) {
    // Handle unique constraint violations (race condition)
    if (error.code === '23505') {
      console.log(`[Dedup] Race condition caught: event already exists`);
      return { isDuplicate: true };
    }
    console.error(`[Dedup] Error checking/recording event:`, error.message);
    return { isDuplicate: false, error: error.message };
  }
}

// Update conversion event with Meta response
async function updateConversionEventMetaResponse(
  eventId: string,
  metaResponse: string
): Promise<void> {
  try {
    await db.update(conversionEvents)
      .set({
        metaSentAt: new Date(),
        metaResponse,
      })
      .where(eq(conversionEvents.eventId, eventId));
  } catch (error: any) {
    console.error(`[Dedup] Error updating Meta response:`, error.message);
  }
}

// Helper to get product details based on payment type
function getProductDetails(type: string, amount: number) {
  const baseUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : 'http://localhost:5000';
  
  switch (type) {
    case 'upsell-guides':
      return {
        productName: 'Healing Guides Collection',
        productLink: `${baseUrl}/guides`,
        amount: '$14.99'
      };
    case 'trial':
      return {
        productName: '7-Day BreakFree App Trial',
        productLink: `${baseUrl}/app`,
        amount: '$1.00'
      };
    case 'donation':
      return {
        productName: 'Thank You for Your Contribution',
        productLink: `${baseUrl}/`,
        amount: `$${(amount / 100).toFixed(2)}`
      };
    default:
      return {
        productName: 'BreakFree Purchase',
        productLink: baseUrl,
        amount: `$${(amount / 100).toFixed(2)}`
      };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Facebook Conversions API routes
  app.use("/api/facebook-capi", facebookCapiRoutes);

  // SYNC ENDPOINT: Send InitiateCheckout events for incomplete payments only
  // IMPORTANT: This endpoint does NOT send Purchase events - those ONLY come from Stripe webhooks
  // This prevents duplicate Purchase events in Meta
  app.post("/api/sync-stripe-to-meta", async (req, res) => {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║  STRIPE TO META CAPI SYNC - Starting...                    ║');
      console.log('║  NOTE: Only sending InitiateCheckout & PaymentFailed       ║');
      console.log('║  Purchase events ONLY come from Stripe webhooks            ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      if (!fbCAPI) {
        return res.status(500).json({ 
          success: false, 
          error: 'Facebook CAPI not configured - missing FB_PIXEL_ID or FB_ACCESS_TOKEN' 
        });
      }

      // Get date range from request or default to last 30 days
      const { startDate, endDate, limit = 100 } = req.body;
      
      const created = {
        gte: startDate ? Math.floor(new Date(startDate).getTime() / 1000) : Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
        lte: endDate ? Math.floor(new Date(endDate).getTime() / 1000) : Math.floor(Date.now() / 1000),
      };

      console.log(`Fetching Stripe payments from ${new Date(created.gte * 1000).toISOString()} to ${new Date(created.lte * 1000).toISOString()}`);

      // Fetch ALL payment intents from Stripe (not just succeeded)
      const paymentIntents = await stripe.paymentIntents.list({
        created,
        limit: Math.min(limit, 100),
      });

      // Categorize payments by status
      const succeededPayments = paymentIntents.data.filter(pi => pi.status === 'succeeded');
      const incompletePayments = paymentIntents.data.filter(pi => 
        ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing'].includes(pi.status)
      );
      const canceledPayments = paymentIntents.data.filter(pi => pi.status === 'canceled');
      
      console.log(`Found ${paymentIntents.data.length} total payments:`);
      console.log(`  - ${succeededPayments.length} succeeded (Purchase already sent via webhook - SKIPPING)`);
      console.log(`  - ${incompletePayments.length} incomplete (InitiateCheckout)`);
      console.log(`  - ${canceledPayments.length} canceled (checking for failures)`);

      const results: any[] = [];
      const summary = {
        purchases: { skipped: succeededPayments.length },
        initiateCheckout: { sent: 0, failed: 0 },
        paymentFailed: { sent: 0, failed: 0 },
      };

      // ALWAYS use production domain for Facebook CAPI - critical for ad attribution
      const baseUrl = process.env.PRODUCTION_DOMAIN 
        ? `https://${process.env.PRODUCTION_DOMAIN}` 
        : 'https://break-free-app.com';

      // Helper function to parse user data
      const parseUserData = (payment: Stripe.PaymentIntent) => {
        const { email, name, type, fbc, fbp } = payment.metadata;
        const nameParts = (name || '').trim().split(' ');
        const firstName = nameParts[0] || undefined;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
        return { email, name, type, fbc, fbp, firstName, lastName };
      };

      // SKIPPING PURCHASE EVENTS - They are ONLY sent from Stripe webhooks (payment_intent.succeeded)
      // This prevents duplicate/incorrect Purchase events in Meta
      console.log('\n📦 Purchase events: SKIPPED (only sent via Stripe webhooks)');
      console.log(`   ${succeededPayments.length} succeeded payments will NOT be re-sent as Purchase events`);

      // 2. Send INITIATE_CHECKOUT events for incomplete payments
      console.log('\n🛒 Sending InitiateCheckout events for incomplete transactions...');
      for (const payment of incompletePayments) {
        const userData = parseUserData(payment);
        const amountInDollars = payment.amount / 100;
        const productDetails = getProductDetails(userData.type, payment.amount);

        // Skip if no email (can't track without user data)
        if (!userData.email) {
          console.log(`  ⊘ Skipped: ${payment.id} - no email`);
          continue;
        }

        try {
          const result = await fbCAPI.sendInitiateCheckout(
            `${baseUrl}/checkout`,
            {
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              fbc: userData.fbc || undefined,
              fbp: userData.fbp || undefined,
            },
            {
              value: amountInDollars,
              currency: 'USD',
              content_name: productDetails.productName,
            }
          );

          results.push({
            paymentId: payment.id,
            eventType: 'InitiateCheckout',
            status: payment.status,
            amount: amountInDollars,
            email: userData.email ? `${userData.email.substring(0, 3)}***` : 'none',
            name: userData.name || 'Unknown',
            type: userData.type || 'unknown',
            created: new Date(payment.created * 1000).toISOString(),
            capiResult: result.success ? 'SUCCESS' : 'FAILED',
            error: result.error,
          });

          if (result.success) {
            summary.initiateCheckout.sent++;
            console.log(`  ✓ InitiateCheckout: ${payment.id} - $${amountInDollars} - ${userData.email}`);
          } else {
            summary.initiateCheckout.failed++;
            console.log(`  ✗ InitiateCheckout Failed: ${payment.id} - ${result.error}`);
          }
        } catch (error: any) {
          summary.initiateCheckout.failed++;
          results.push({
            paymentId: payment.id,
            eventType: 'InitiateCheckout',
            status: payment.status,
            amount: amountInDollars,
            email: userData.email ? `${userData.email.substring(0, 3)}***` : 'none',
            capiResult: 'ERROR',
            error: error.message,
          });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 3. Send PAYMENT_FAILED events for canceled payments with errors
      console.log('\n❌ Sending PaymentFailed events for failed transactions...');
      for (const payment of canceledPayments) {
        const userData = parseUserData(payment);
        const amountInDollars = payment.amount / 100;
        const productDetails = getProductDetails(userData.type, payment.amount);
        const failureCode = payment.last_payment_error?.code || 'canceled';
        const failureMessage = payment.last_payment_error?.message || 'Payment was canceled';

        // Skip if no email (can't track without user data)
        if (!userData.email) {
          console.log(`  ⊘ Skipped: ${payment.id} - no email`);
          continue;
        }

        // Only send PaymentFailed if there was an actual payment error
        if (payment.last_payment_error) {
          try {
            const result = await fbCAPI.sendPaymentFailed(
              `${baseUrl}/checkout`,
              {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                fbc: userData.fbc || undefined,
                fbp: userData.fbp || undefined,
              },
              {
                value: amountInDollars,
                currency: 'USD',
                content_name: productDetails.productName,
                error_reason: failureCode === 'card_declined' ? 'insufficient_funds' : failureCode,
              }
            );

            results.push({
              paymentId: payment.id,
              eventType: 'PaymentFailed',
              status: 'canceled',
              failureCode,
              failureMessage,
              amount: amountInDollars,
              email: userData.email ? `${userData.email.substring(0, 3)}***` : 'none',
              name: userData.name || 'Unknown',
              type: userData.type || 'unknown',
              created: new Date(payment.created * 1000).toISOString(),
              capiResult: result.success ? 'SUCCESS' : 'FAILED',
              error: result.error,
            });

            if (result.success) {
              summary.paymentFailed.sent++;
              console.log(`  ✓ PaymentFailed: ${payment.id} - ${failureCode} - ${userData.email}`);
            } else {
              summary.paymentFailed.failed++;
              console.log(`  ✗ PaymentFailed API Error: ${payment.id} - ${result.error}`);
            }
          } catch (error: any) {
            summary.paymentFailed.failed++;
            results.push({
              paymentId: payment.id,
              eventType: 'PaymentFailed',
              status: 'canceled',
              failureCode,
              amount: amountInDollars,
              email: userData.email ? `${userData.email.substring(0, 3)}***` : 'none',
              capiResult: 'ERROR',
              error: error.message,
            });
          }

          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          // No payment error - this was just an abandoned checkout, send as InitiateCheckout
          try {
            const result = await fbCAPI.sendInitiateCheckout(
              `${baseUrl}/checkout`,
              {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                fbc: userData.fbc || undefined,
                fbp: userData.fbp || undefined,
              },
              {
                value: amountInDollars,
                currency: 'USD',
                content_name: productDetails.productName,
              }
            );

            results.push({
              paymentId: payment.id,
              eventType: 'InitiateCheckout',
              status: 'canceled (abandoned)',
              amount: amountInDollars,
              email: userData.email ? `${userData.email.substring(0, 3)}***` : 'none',
              name: userData.name || 'Unknown',
              type: userData.type || 'unknown',
              created: new Date(payment.created * 1000).toISOString(),
              capiResult: result.success ? 'SUCCESS' : 'FAILED',
              error: result.error,
            });

            if (result.success) {
              summary.initiateCheckout.sent++;
              console.log(`  ✓ InitiateCheckout (abandoned): ${payment.id} - $${amountInDollars} - ${userData.email}`);
            } else {
              summary.initiateCheckout.failed++;
            }
          } catch (error: any) {
            summary.initiateCheckout.failed++;
          }

          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const totalSent = summary.initiateCheckout.sent + summary.paymentFailed.sent;
      const totalFailed = summary.initiateCheckout.failed + summary.paymentFailed.failed;

      console.log(`\n╔════════════════════════════════════════════════════════════╗`);
      console.log(`║  SYNC COMPLETE                                             ║`);
      console.log(`╠════════════════════════════════════════════════════════════╣`);
      console.log(`║  Purchase events:        ${summary.purchases.skipped} SKIPPED (webhook only)    ║`);
      console.log(`║  InitiateCheckout events: ${summary.initiateCheckout.sent} sent, ${summary.initiateCheckout.failed} failed          ║`);
      console.log(`║  PaymentFailed events:   ${summary.paymentFailed.sent} sent, ${summary.paymentFailed.failed} failed          ║`);
      console.log(`║  TOTAL: ${totalSent} sent, ${totalFailed} failed                            ║`);
      console.log(`╚════════════════════════════════════════════════════════════╝\n`);

      res.json({
        success: true,
        summary: {
          totalPayments: paymentIntents.data.length,
          purchases: summary.purchases,
          initiateCheckout: summary.initiateCheckout,
          paymentFailed: summary.paymentFailed,
          totalSent,
          totalFailed,
          dateRange: {
            from: new Date(created.gte * 1000).toISOString(),
            to: new Date(created.lte * 1000).toISOString(),
          },
        },
        payments: results,
        instructions: 'InitiateCheckout and PaymentFailed events sent. Purchase events are NOT sent from sync - they ONLY come from Stripe webhooks when payment succeeds. This prevents duplicate/incorrect Purchase events in Meta.',
      });

    } catch (error: any) {
      console.error('Sync failed:', error.message);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Get Stripe payment history (for viewing before syncing)
  app.get("/api/stripe-payments", async (req, res) => {
    try {
      const { startDate, endDate, limit = 20 } = req.query;
      
      const created: { gte?: number; lte?: number } = {};
      if (startDate) created.gte = Math.floor(new Date(startDate as string).getTime() / 1000);
      if (endDate) created.lte = Math.floor(new Date(endDate as string).getTime() / 1000);

      // Default to last 7 days if no dates provided
      if (!startDate && !endDate) {
        created.gte = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
        created.lte = Math.floor(Date.now() / 1000);
      }

      const paymentIntents = await stripe.paymentIntents.list({
        created: Object.keys(created).length > 0 ? created : undefined,
        limit: Math.min(Number(limit), 100),
      });

      const payments = paymentIntents.data
        .filter(pi => pi.status === 'succeeded')
        .map(pi => ({
          id: pi.id,
          amount: pi.amount / 100,
          currency: pi.currency.toUpperCase(),
          status: pi.status,
          created: new Date(pi.created * 1000).toISOString(),
          email: pi.metadata.email ? `${pi.metadata.email.substring(0, 3)}***` : null,
          name: pi.metadata.name || null,
          type: pi.metadata.type || 'unknown',
        }));

      res.json({
        success: true,
        count: payments.length,
        payments,
        instructions: 'Use POST /api/sync-stripe-to-meta to sync these purchases to Meta CAPI',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // DISABLED: Test purchase endpoint - Purchase events only come from Stripe webhooks
  // This endpoint was sending fake Purchase events which polluted Meta data
  app.post("/api/test-purchase", async (req, res) => {
    console.warn('[Test Purchase] DISABLED - Purchase events only come from Stripe webhooks');
    res.status(403).json({
      success: false,
      error: 'Test purchase endpoint is disabled. Purchase events ONLY come from Stripe webhooks when payment_intent.succeeded fires.',
      reason: 'This prevents fake/incorrect Purchase events in Meta Ads',
      suggestion: 'To test purchase tracking, make a real $1 trial payment. The Stripe webhook will send the Purchase event.'
    });
  });

  // BetterAuth routes - handles /api/auth/*
  app.all("/api/auth/*", auth.handler);

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Create trial payment with $1 upfront, then subscription for $30/month after 7 days
  // Flow: Collect $1 via PaymentIntent -> Webhook creates subscription with trial
  app.post("/api/create-trial-payment", async (req, res) => {
    try {
      const { email, name, fbc, fbp, answers } = req.body;
      
      // Analyze quiz answers if provided
      let quizAnalysis = null;
      if (answers) {
        quizAnalysis = analyzeQuizAnswers(answers);
      }
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      let customer: Stripe.Customer;
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        // Update customer metadata
        await stripe.customers.update(customer.id, {
          name: name || customer.name,
          metadata: {
            ...customer.metadata,
            fbc: fbc || customer.metadata?.fbc || '',
            fbp: fbp || customer.metadata?.fbp || '',
          },
        });
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email,
          name: name || 'Trial User',
          metadata: {
            fbc: fbc || '',
            fbp: fbp || '',
            source: 'breakfree-quiz',
          },
        });
      }

      console.log(`[Trial] Customer ${customer.id} for ${email}`);

      // Create payment intent for $1 trial fee
      // After successful payment, webhook will create the subscription
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100, // $1.00 in cents
        currency: 'usd',
        customer: customer.id,
        setup_future_usage: 'off_session', // Save payment method for subscription
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email,
          name: name || '',
          type: 'trial',
          fbc: fbc || '',
          fbp: fbp || '',
          create_subscription: 'true', // Flag for webhook to create subscription
          // Store quiz analysis for results email
          traumaScore: quizAnalysis?.traumaScore?.toString() || '',
          primaryPattern: quizAnalysis?.primaryPattern || '',
          recommendations: quizAnalysis?.recommendations ? JSON.stringify(quizAnalysis.recommendations) : '',
          send_results_email: quizAnalysis ? 'true' : 'false',
        },
      });

      console.log(`[Trial] Created PaymentIntent ${paymentIntent.id} for ${email}`);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
      });
    } catch (error: any) {
      console.error("Error creating trial payment:", error);
      res.status(500).json({ message: "Error creating trial payment: " + error.message });
    }
  });

  // Create payment intent for upsell products (guides, masterclass, journal)
  app.post("/api/create-upsell-payment", async (req, res) => {
    try {
      const { email, name, fbc, fbp, amount, productName } = req.body;
      
      // Support custom amounts for masterclass ($69) and journal ($14.99)
      // Default to $14.99 (guides) if no amount specified
      const paymentAmount = amount ? Math.round(amount * 100) : 1499;
      const productType = productName || "Mental Well-Being Guides";
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentAmount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email,
          name: name || 'Valued Customer',
          type: "upsell",
          productName: productType,
          fbc: fbc || '',
          fbp: fbp || '',
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating upsell payment:", error);
      res.status(500).json({ message: "Error creating upsell payment: " + error.message });
    }
  });

  // Create payment intent for donation
  app.post("/api/create-donation-payment", async (req, res) => {
    try {
      const { amount, email, name, fbc, fbp } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email: email || 'anonymous',
          name: name || 'Anonymous Supporter',
          type: "donation",
          fbc: fbc || '',
          fbp: fbp || '',
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating donation payment:", error);
      res.status(500).json({ message: "Error creating donation payment: " + error.message });
    }
  });

  // Create Stripe Checkout Session for subscription with trial
  // Flow: $1 trial fee + 7-day trial, then $29.99/month
  app.post("/api/create-subscription-checkout", async (req, res) => {
    try {
      const { email, name, fbc, fbp, answers } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'http://localhost:5000';

      // Analyze quiz answers if provided
      let quizAnalysis = null;
      if (answers) {
        quizAnalysis = analyzeQuizAnswers(answers);
      }

      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      let customer: Stripe.Customer;
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        await stripe.customers.update(customer.id, {
          name: name || customer.name,
          metadata: {
            ...customer.metadata,
            fbc: fbc || customer.metadata?.fbc || '',
            fbp: fbp || customer.metadata?.fbp || '',
          },
        });
      } else {
        customer = await stripe.customers.create({
          email,
          name: name || 'Trial User',
          metadata: {
            fbc: fbc || '',
            fbp: fbp || '',
            source: 'breakfree-quiz',
          },
        });
      }

      console.log(`[Subscription Checkout] Customer ${customer.id} for ${email}`);

      // BreakFree App Monthly Subscription - $29.99/month
      const MONTHLY_PRICE_ID = 'price_1SXgKrFmbb3h0dKoBmtSeD96';

      // First, create a pending invoice item for the $1 trial fee
      // This will be included in the first invoice when subscription is created
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: 100, // $1 in cents
        currency: 'usd',
        description: 'Trial activation fee',
      });

      // Create Checkout Session for subscription with trial
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: MONTHLY_PRICE_ID,
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: 7,
          metadata: {
            type: 'trial_subscription',
            email: email || '',
            name: name || '',
            fbc: fbc || '',
            fbp: fbp || '',
            traumaScore: quizAnalysis?.traumaScore?.toString() || '',
            primaryPattern: quizAnalysis?.primaryPattern || '',
          },
        },
        success_url: `${baseUrl}/quiz?state=upsell&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/quiz?state=timeline`,
        metadata: {
          type: 'subscription',
          email: email || '',
          name: name || '',
          fbc: fbc || '',
          fbp: fbp || '',
          product_name: '7-Day Trial Subscription',
        },
      });

      // Save subscription record to database (pending status until webhook confirms)
      try {
        await db.insert(subscriptions).values({
          email,
          name: name || null,
          stripeCustomerId: customer.id,
          stripeSubscriptionId: null,
          subscriptionStatus: 'incomplete',
          trialEndDate: null,
          currentPeriodEnd: null,
        });
      } catch (dbError: any) {
        console.log('[Subscription Checkout] DB insert note:', dbError.message);
      }

      console.log(`[Subscription Checkout] Session created: ${session.id}`);
      
      res.json({ 
        sessionId: session.id, 
        url: session.url,
        customerId: customer.id,
      });
    } catch (error: any) {
      console.error("Error creating subscription checkout:", error);
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Check subscription status for a user
  app.post("/api/check-subscription", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check database for subscription
      const existingSubscription = await db.select()
        .from(subscriptions)
        .where(eq(subscriptions.email, email))
        .limit(1);

      if (existingSubscription.length === 0) {
        return res.json({ 
          hasAccess: false, 
          status: 'none',
          message: 'No subscription found' 
        });
      }

      const sub = existingSubscription[0];
      const activeStatuses = ['trialing', 'active'];
      const hasAccess = activeStatuses.includes(sub.subscriptionStatus);

      res.json({
        hasAccess,
        status: sub.subscriptionStatus,
        trialEndDate: sub.trialEndDate,
        currentPeriodEnd: sub.currentPeriodEnd,
        stripeSubscriptionId: sub.stripeSubscriptionId,
      });
    } catch (error: any) {
      console.error("Error checking subscription:", error);
      res.status(500).json({ message: "Error checking subscription: " + error.message });
    }
  });

  // Get subscription details from Stripe
  app.post("/api/get-subscription-details", async (req, res) => {
    try {
      const { subscriptionId, email } = req.body;
      
      if (!subscriptionId && !email) {
        return res.status(400).json({ message: "Subscription ID or email is required" });
      }

      let subscription: Stripe.Subscription | null = null;

      if (subscriptionId) {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      } else if (email) {
        // Find customer by email and get their subscription
        const customers = await stripe.customers.list({ email, limit: 1 });
        if (customers.data.length > 0) {
          const subs = await stripe.subscriptions.list({
            customer: customers.data[0].id,
            limit: 1,
          });
          if (subs.data.length > 0) {
            subscription = subs.data[0];
          }
        }
      }

      if (!subscription) {
        return res.json({ found: false });
      }

      const subData = subscription as any;
      res.json({
        found: true,
        id: subscription.id,
        status: subscription.status,
        trialEnd: subData.trial_end ? new Date(subData.trial_end * 1000) : null,
        currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : null,
        canceledAt: subData.canceled_at ? new Date(subData.canceled_at * 1000) : null,
      });
    } catch (error: any) {
      console.error("Error getting subscription details:", error);
      res.status(500).json({ message: "Error getting subscription: " + error.message });
    }
  });

  // Stripe webhook endpoint for payment events
  app.post("/api/webhook/stripe", async (req: any, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (webhookSecret) {
        // In production, verify the signature
        event = stripe.webhooks.constructEvent(
          req.rawBody || req.body,
          sig,
          webhookSecret
        );
      } else {
        // In development, skip signature verification
        event = req.body as Stripe.Event;
      }
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on type
    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle payment_intent.created - Track as InitiateCheckout
    if (event.type === 'payment_intent.created') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { email, name, type, fbc, fbp } = paymentIntent.metadata;

      console.log('[Stripe Webhook] Payment intent created (InitiateCheckout):', {
        paymentId: paymentIntent.id,
        email: email ? `${email.substring(0, 3)}***` : 'none',
        type,
        amount: paymentIntent.amount
      });

      // Send InitiateCheckout event to Facebook CAPI
      if (fbCAPI && email) {
        try {
          // ALWAYS use production domain for Facebook CAPI
          const baseUrl = process.env.PRODUCTION_DOMAIN 
            ? `https://${process.env.PRODUCTION_DOMAIN}` 
            : 'https://break-free-app.com';
          
          const nameParts = (name || '').trim().split(' ');
          const firstName = nameParts[0] || undefined;
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
          const amountInDollars = paymentIntent.amount / 100;
          const productDetails = getProductDetails(type, paymentIntent.amount);

          const result = await fbCAPI.sendInitiateCheckout(
            `${baseUrl}/checkout`,
            {
              email: email || undefined,
              firstName,
              lastName,
              fbc: fbc || undefined,
              fbp: fbp || undefined,
            },
            {
              value: amountInDollars,
              currency: 'USD',
              content_name: productDetails.productName,
            }
          );

          if (result.success) {
            console.log(`[Stripe Webhook] Facebook CAPI InitiateCheckout event sent:`, {
              paymentId: paymentIntent.id,
              amount: amountInDollars,
              eventsReceived: result.response?.events_received
            });
          } else {
            console.error(`[Stripe Webhook] Facebook CAPI InitiateCheckout failed:`, result.error);
          }
        } catch (fbError: any) {
          console.error('[Stripe Webhook] Error sending InitiateCheckout event:', fbError.message);
        }
      }

      return res.json({ received: true });
    }

    // Handle payment_intent.payment_failed - Track as PaymentFailed
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { email, name, type, fbc, fbp } = paymentIntent.metadata;
      const failureMessage = paymentIntent.last_payment_error?.message || 'Unknown error';
      const failureCode = paymentIntent.last_payment_error?.code || 'unknown';

      console.log('[Stripe Webhook] Payment failed:', {
        paymentId: paymentIntent.id,
        email: email ? `${email.substring(0, 3)}***` : 'none',
        type,
        failureCode,
        failureMessage
      });

      // Send PaymentFailed event to Facebook CAPI
      if (fbCAPI && email) {
        try {
          // ALWAYS use production domain for Facebook CAPI
          const baseUrl = process.env.PRODUCTION_DOMAIN 
            ? `https://${process.env.PRODUCTION_DOMAIN}` 
            : 'https://break-free-app.com';
          
          const nameParts = (name || '').trim().split(' ');
          const firstName = nameParts[0] || undefined;
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
          const amountInDollars = paymentIntent.amount / 100;
          const productDetails = getProductDetails(type, paymentIntent.amount);

          const result = await fbCAPI.sendPaymentFailed(
            `${baseUrl}/checkout`,
            {
              email: email || undefined,
              firstName,
              lastName,
              fbc: fbc || undefined,
              fbp: fbp || undefined,
            },
            {
              value: amountInDollars,
              currency: 'USD',
              content_name: productDetails.productName,
              error_reason: failureCode === 'card_declined' ? 'insufficient_funds' : failureCode,
            }
          );

          if (result.success) {
            console.log(`[Stripe Webhook] Facebook CAPI PaymentFailed event sent:`, {
              paymentId: paymentIntent.id,
              failureCode,
              eventsReceived: result.response?.events_received
            });
          } else {
            console.error(`[Stripe Webhook] Facebook CAPI PaymentFailed failed:`, result.error);
          }
        } catch (fbError: any) {
          console.error('[Stripe Webhook] Error sending PaymentFailed event:', fbError.message);
        }
      }

      return res.json({ received: true });
    }

    // Handle payment_intent.succeeded - Track as Purchase (COMPLETED)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { email, name, type, fbc, fbp } = paymentIntent.metadata;

      // Log metadata for debugging
      console.log('Payment intent succeeded:', {
        paymentId: paymentIntent.id,
        email,
        name,
        type,
        amount: paymentIntent.amount,
        fbc: fbc ? 'present' : 'none',
        fbp: fbp ? 'present' : 'none',
        customerId: paymentIntent.customer,
        createSubscription: paymentIntent.metadata.create_subscription
      });

      // If this is a trial payment, create the subscription
      if (type === 'trial' && paymentIntent.metadata.create_subscription === 'true' && paymentIntent.customer) {
        try {
          const customerId = typeof paymentIntent.customer === 'string' 
            ? paymentIntent.customer 
            : paymentIntent.customer.id;

          // Get the payment method from the payment intent
          const paymentMethod = paymentIntent.payment_method;
          
          if (paymentMethod) {
            // Attach payment method to customer as default
            const pmId = typeof paymentMethod === 'string' ? paymentMethod : paymentMethod.id;
            await stripe.customers.update(customerId, {
              invoice_settings: {
                default_payment_method: pmId,
              },
            });
          }

          // BreakFree App Monthly Subscription - $29.99/month
          const MONTHLY_PRICE_ID = 'price_1SXgKrFmbb3h0dKoBmtSeD96';

          // Create subscription with 7-day trial
          // First billing of $29.99 will happen 7 days from now
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: MONTHLY_PRICE_ID }],
            trial_period_days: 7,
            metadata: {
              type: 'trial_subscription',
              email: email || '',
              name: name || '',
              original_payment_id: paymentIntent.id,
              fbc: fbc || '',
              fbp: fbp || '',
            },
          });

          console.log(`[Subscription] Created subscription ${subscription.id} for customer ${customerId}`);
          console.log(`[Subscription] Trial ends: ${new Date((subscription.trial_end || 0) * 1000).toISOString()}`);
          console.log(`[Subscription] Status: ${subscription.status}`);
        } catch (subError: any) {
          console.error('[Subscription] Error creating subscription:', subError.message);
          // Don't fail the webhook - the trial payment already succeeded
        }

        // Send quiz results email after successful trial payment
        if (paymentIntent.metadata.send_results_email === 'true' && email) {
          try {
            const { client: resend, fromEmail } = await getUncachableResendClient();
            
            const traumaScore = parseInt(paymentIntent.metadata.traumaScore) || 50;
            const primaryPattern = paymentIntent.metadata.primaryPattern || 'Emotional Regulation Challenges';
            let recommendations: string[] = [];
            try {
              recommendations = JSON.parse(paymentIntent.metadata.recommendations || '[]');
            } catch {
              recommendations = [
                'Practice self-compassion and self-care daily',
                'Explore healing resources and support groups',
                'Consider working with a trauma-informed therapist',
                'Start a journaling practice to process emotions',
              ];
            }

            const { data, error } = await resend.emails.send({
              from: 'Break Free <hello@break-free-app.com>',
              to: [email],
              subject: '🌸 Your Break Free Quiz Results',
              html: generateResultsEmail({
                userName: name || 'Friend',
                traumaScore,
                primaryPattern,
                recommendations,
              }),
            });

            if (error) {
              console.error('[Results Email] Error sending:', error);
            } else {
              console.log(`[Results Email] Sent to ${email}, messageId: ${data?.id}`);
            }
          } catch (emailError: any) {
            console.error('[Results Email] Error:', emailError.message);
            // Don't fail the webhook - payment already succeeded
          }
        }
      }

      // Get product details based on payment type
      const productDetails = getProductDetails(type, paymentIntent.amount);
      const amountInDollars = paymentIntent.amount / 100;

      // NOTE: Purchase events are NOT sent from payment_intent.succeeded
      // They are ONLY sent from:
      // - checkout.session.completed (when payment_status === 'paid')
      // - checkout.session.async_payment_succeeded
      // This prevents duplicate Purchase events in Meta
      console.log(`[Stripe Webhook] payment_intent.succeeded: NOT sending Purchase to Meta (will be sent from checkout.session events)`);

      if (email) {
        try {
          // Use provided name or fallback to "Valued Customer"
          const customerName = name || 'Valued Customer';

          // Get Resend client
          const { client: resend, fromEmail } = await getUncachableResendClient();

          // Send purchase confirmation email
          await resend.emails.send({
            from: fromEmail || 'BreakFree <onboarding@resend.dev>',
            to: [email],
            subject: '✓ Thank You for Your Purchase',
            html: generatePurchaseConfirmationEmail({
              userName: customerName,
              productName: productDetails.productName,
              productLink: productDetails.productLink,
              amount: productDetails.amount,
            }),
          });

          console.log(`Purchase confirmation email sent to ${email} for ${type} (name: ${customerName})`);
        } catch (error: any) {
          console.error('Error sending purchase confirmation email:', error);
          // Don't fail the webhook - payment already succeeded
        }
      } else {
        console.warn('Payment succeeded but no email in metadata - skipping confirmation email', {
          paymentId: paymentIntent.id,
          metadata: paymentIntent.metadata
        });
      }
    }

    // Handle checkout.session.completed - Primary event for successful Checkout Sessions
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionData = session as any;
      
      console.log('[Stripe Webhook] Checkout session completed:', {
        sessionId: session.id,
        mode: sessionData.mode,
        paymentIntentId: session.payment_intent,
        subscriptionId: sessionData.subscription,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total
      });

      // Only send Purchase to Meta if payment_status === 'paid'
      // DO NOT send for 'unpaid' or 'no_payment_required' statuses
      if (session.payment_status !== 'paid') {
        console.log(`[Stripe Webhook] checkout.session.completed: NOT sending Purchase (payment_status=${session.payment_status})`);
        return res.json({ received: true });
      }

      // Determine the event ID for deduplication
      // For payment mode: use payment_intent
      // For subscription mode: use subscription ID or session ID
      let eventIdForDedup: string | null = null;
      
      if (session.payment_intent) {
        eventIdForDedup = typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : session.payment_intent.id;
      } else if (sessionData.subscription) {
        eventIdForDedup = typeof sessionData.subscription === 'string'
          ? sessionData.subscription
          : sessionData.subscription.id;
      } else {
        eventIdForDedup = session.id;
      }
      
      const amountInDollars = (session.amount_total || 0) / 100;
      const email = session.customer_email || session.customer_details?.email;
      const name = session.customer_details?.name;
      const currency = (session.currency || 'usd').toUpperCase();

      // Extract fbc/fbp from metadata if available
      const fbc = session.metadata?.fbc;
      const fbp = session.metadata?.fbp;

      if (fbCAPI && email && eventIdForDedup) {
        try {
          // Check for duplicate
          const dedupResult = await checkAndRecordConversionEvent(
            eventIdForDedup,
            event.id,
            'Purchase',
            amountInDollars,
            currency,
            email
          );

          if (dedupResult.isDuplicate) {
            console.log(`[Stripe Webhook] Skipping duplicate checkout.session Purchase for ${eventIdForDedup}`);
          } else {
            // ALWAYS use production domain for Facebook CAPI - critical for ad attribution
            const baseUrl = process.env.PRODUCTION_DOMAIN 
              ? `https://${process.env.PRODUCTION_DOMAIN}` 
              : 'https://break-free-app.com';

            const nameParts = (name || '').trim().split(' ');
            const firstName = nameParts[0] || undefined;
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

            // Determine content name based on mode
            const contentName = sessionData.mode === 'subscription' 
              ? session.metadata?.product_name || '7-Day Trial Subscription'
              : session.metadata?.product_name || 'BreakFree Purchase';

            const result = await fbCAPI.sendPurchase(
              `${baseUrl}/checkout`,
              {
                email,
                firstName,
                lastName,
                fbc: fbc || undefined,
                fbp: fbp || undefined,
              },
              {
                value: amountInDollars,
                currency,
                content_name: contentName,
              },
              {
                eventId: eventIdForDedup,
                eventTime: session.created,
              }
            );

            await updateConversionEventMetaResponse(eventIdForDedup, JSON.stringify(result));

            if (result.success) {
              console.log(`[Stripe Webhook] Checkout session Purchase sent to Meta:`, {
                sessionId: session.id,
                mode: sessionData.mode,
                eventId: eventIdForDedup,
                amount: amountInDollars,
                currency,
                eventsReceived: result.response?.events_received
              });
            } else {
              console.error(`[Stripe Webhook] Checkout session Purchase to Meta failed:`, result.error);
            }
          }
        } catch (fbError: any) {
          console.error('[Stripe Webhook] Error sending checkout session Purchase:', fbError.message);
        }
      } else {
        console.log('[Stripe Webhook] Skipping Purchase event:', {
          hasFbCAPI: !!fbCAPI,
          hasEmail: !!email,
          hasEventId: !!eventIdForDedup
        });
      }

      return res.json({ received: true });
    }

    // Handle checkout.session.async_payment_succeeded - For delayed payment methods (bank transfers, etc.)
    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('[Stripe Webhook] Async payment succeeded:', {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        customerEmail: session.customer_email
      });

      if (session.payment_intent) {
        const paymentIntentId = typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : session.payment_intent.id;
        
        const amountInDollars = (session.amount_total || 0) / 100;
        const email = session.customer_email || session.customer_details?.email;
        const name = session.customer_details?.name;
        const currency = (session.currency || 'usd').toUpperCase();
        const fbc = session.metadata?.fbc;
        const fbp = session.metadata?.fbp;

        if (fbCAPI && email) {
          try {
            const dedupResult = await checkAndRecordConversionEvent(
              paymentIntentId,
              event.id,
              'Purchase',
              amountInDollars,
              currency,
              email
            );

            if (dedupResult.isDuplicate) {
              console.log(`[Stripe Webhook] Skipping duplicate async_payment Purchase for ${paymentIntentId}`);
            } else {
              // ALWAYS use production domain for Facebook CAPI - critical for ad attribution
              const baseUrl = process.env.PRODUCTION_DOMAIN 
                ? `https://${process.env.PRODUCTION_DOMAIN}` 
                : 'https://break-free-app.com';

              const nameParts = (name || '').trim().split(' ');
              const firstName = nameParts[0] || undefined;
              const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

              const result = await fbCAPI.sendPurchase(
                `${baseUrl}/checkout`,
                {
                  email,
                  firstName,
                  lastName,
                  fbc: fbc || undefined,
                  fbp: fbp || undefined,
                },
                {
                  value: amountInDollars,
                  currency,
                  content_name: session.metadata?.product_name || 'BreakFree Purchase',
                },
                {
                  eventId: paymentIntentId,
                  eventTime: Math.floor(Date.now() / 1000),
                }
              );

              await updateConversionEventMetaResponse(paymentIntentId, JSON.stringify(result));

              if (result.success) {
                console.log(`[Stripe Webhook] Async payment Purchase sent to Meta:`, {
                  sessionId: session.id,
                  paymentIntentId,
                  amount: amountInDollars,
                  eventsReceived: result.response?.events_received
                });
              } else {
                console.error(`[Stripe Webhook] Async payment Purchase to Meta failed:`, result.error);
              }
            }
          } catch (fbError: any) {
            console.error('[Stripe Webhook] Error sending async payment Purchase:', fbError.message);
          }
        }
      }

      return res.json({ received: true });
    }

    // Handle checkout.session.async_payment_failed - For failed async payments (DO NOT send as Purchase)
    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('[Stripe Webhook] Async payment FAILED (NOT sending to Meta as Purchase):', {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        customerEmail: session.customer_email
      });

      // Log the failure but do NOT send as Purchase event to Meta
      // This is intentional as per requirements - failed payments should not be tracked as purchases
      return res.json({ received: true });
    }

    // Handle customer.subscription.created - New subscription created
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription;
      const subData = subscription as any;
      
      console.log('[Stripe Webhook] Subscription created:', {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
        trialEnd: subData.trial_end
      });

      try {
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email;

        if (email) {
          // Update or insert subscription record
          const existingSubscription = await db.select()
            .from(subscriptions)
            .where(eq(subscriptions.email, email))
            .limit(1);

          if (existingSubscription.length > 0) {
            await db.update(subscriptions)
              .set({
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                trialEndDate: subData.trial_end ? new Date(subData.trial_end * 1000) : null,
                currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : null,
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.email, email));
          } else {
            await db.insert(subscriptions).values({
              email,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              trialEndDate: subData.trial_end ? new Date(subData.trial_end * 1000) : null,
              currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : null,
            });
          }

          console.log(`[Subscription] Database updated for ${email}: ${subscription.status}`);
        }
      } catch (dbError: any) {
        console.error('[Subscription] Database error:', dbError.message);
      }

      return res.json({ received: true });
    }

    // Handle customer.subscription.updated - Subscription status changed
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const subData = subscription as any;
      
      console.log('[Stripe Webhook] Subscription updated:', {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
        trialEnd: subData.trial_end,
        currentPeriodEnd: subData.current_period_end
      });

      try {
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email;

        if (email) {
          // Update subscription record
          await db.update(subscriptions)
            .set({
              subscriptionStatus: subscription.status,
              trialEndDate: subData.trial_end ? new Date(subData.trial_end * 1000) : null,
              currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : null,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.email, email));

          console.log(`[Subscription] Updated for ${email}: ${subscription.status}`);

          // If subscription became active (trial ended, payment succeeded)
          if (subscription.status === 'active') {
            console.log(`[Subscription] Trial converted to active for ${email}`);
          }
        }
      } catch (dbError: any) {
        console.error('[Subscription] Database error:', dbError.message);
      }

      return res.json({ received: true });
    }

    // Handle customer.subscription.deleted - Subscription canceled
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const subData = subscription as any;
      
      console.log('[Stripe Webhook] Subscription deleted:', {
        subscriptionId: subscription.id,
        customerId: subscription.customer
      });

      try {
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email;

        if (email) {
          // Update subscription record
          await db.update(subscriptions)
            .set({
              subscriptionStatus: 'canceled',
              canceledAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.email, email));

          console.log(`[Subscription] Canceled for ${email}`);
        }
      } catch (dbError: any) {
        console.error('[Subscription] Database error:', dbError.message);
      }

      return res.json({ received: true });
    }

    // Handle invoice.paid - For subscription payments (initial and recurring)
    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceData = invoice as any;
      
      console.log('[Stripe Webhook] Invoice paid:', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId: invoiceData.subscription,
        amountPaid: invoiceData.amount_paid,
        billingReason: invoiceData.billing_reason
      });

      // Only send Purchase to Meta for subscription invoices
      if (invoiceData.subscription && fbCAPI) {
        try {
          const customerId = typeof invoice.customer === 'string' 
            ? invoice.customer 
            : (invoice.customer as any)?.id;

          if (customerId) {
            const customer = await stripe.customers.retrieve(customerId);
            const email = (customer as Stripe.Customer).email;
            const name = (customer as Stripe.Customer).name;

            if (email) {
              const amountInDollars = (invoiceData.amount_paid || 0) / 100;
              const currency = (invoice.currency || 'usd').toUpperCase();
              
              // Use invoice ID for deduplication
              const dedupResult = await checkAndRecordConversionEvent(
                invoice.id,
                event.id,
                'Purchase',
                amountInDollars,
                currency,
                email
              );

              if (dedupResult.isDuplicate) {
                console.log(`[Stripe Webhook] Skipping duplicate invoice.paid Purchase for ${invoice.id}`);
              } else {
                // ALWAYS use production domain for Facebook CAPI - critical for ad attribution
                const baseUrl = process.env.PRODUCTION_DOMAIN 
                  ? `https://${process.env.PRODUCTION_DOMAIN}`
                  : 'https://break-free-app.com';

                const nameParts = (name || '').trim().split(' ');
                const firstName = nameParts[0] || undefined;
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

                // Get tracking data from customer metadata
                const customerMetadata = (customer as Stripe.Customer).metadata || {};

                const contentName = invoiceData.billing_reason === 'subscription_create' 
                  ? 'Trial Subscription' 
                  : 'Monthly Subscription';

                const result = await fbCAPI.sendPurchase(
                  `${baseUrl}/checkout`,
                  {
                    email,
                    firstName,
                    lastName,
                    fbc: customerMetadata.fbc || undefined,
                    fbp: customerMetadata.fbp || undefined,
                  },
                  {
                    value: amountInDollars,
                    currency,
                    content_name: contentName,
                  },
                  {
                    eventId: invoice.id,
                    eventTime: invoiceData.created || Math.floor(Date.now() / 1000),
                  }
                );

                await updateConversionEventMetaResponse(invoice.id, JSON.stringify(result));

                if (result.success) {
                  console.log(`[Stripe Webhook] Invoice paid Purchase sent to Meta:`, {
                    invoiceId: invoice.id,
                    billingReason: invoiceData.billing_reason,
                    amount: amountInDollars,
                    currency,
                    eventsReceived: result.response?.events_received
                  });
                } else {
                  console.error(`[Stripe Webhook] Invoice paid Purchase to Meta failed:`, result.error);
                }
              }
            }
          }
        } catch (fbError: any) {
          console.error('[Stripe Webhook] Error sending invoice.paid Purchase:', fbError.message);
        }
      }

      return res.json({ received: true });
    }

    // Handle invoice.payment_failed - Subscription payment failed
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceData = invoice as any;
      
      console.log('[Stripe Webhook] Invoice payment failed:', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId: invoiceData.subscription,
        attemptCount: invoiceData.attempt_count
      });

      try {
        const customerId = typeof invoice.customer === 'string' 
          ? invoice.customer 
          : (invoice.customer as any)?.id;

        if (customerId) {
          // Get customer email
          const customer = await stripe.customers.retrieve(customerId);
          const email = (customer as Stripe.Customer).email;

          if (email) {
            // Update subscription status to past_due
            await db.update(subscriptions)
              .set({
                subscriptionStatus: 'past_due',
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.email, email));

            console.log(`[Subscription] Marked as past_due for ${email}`);
          }
        }
      } catch (dbError: any) {
        console.error('[Subscription] Database error:', dbError.message);
      }

      return res.json({ received: true });
    }

    res.json({ received: true });
  });

  // Development-only test endpoint for webhook (bypasses signature verification)
  if (process.env.NODE_ENV === 'development') {
    app.post("/api/test-webhook/stripe", async (req, res) => {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║  TEST WEBHOOK ENDPOINT - Development Only                  ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      const { eventType, paymentIntentId, amount, email, name, productName } = req.body;

      if (!eventType) {
        return res.status(400).json({ error: 'Missing eventType' });
      }

      const testPaymentIntentId = paymentIntentId || `pi_test_${Date.now()}`;
      const testAmount = amount || 14.99;
      const testEmail = email || 'test@example.com';
      const testName = name || 'Test User';
      const testProductName = productName || 'Test Purchase';

      console.log(`[Test Webhook] Simulating ${eventType}:`, {
        paymentIntentId: testPaymentIntentId,
        amount: testAmount,
        email: testEmail
      });

      // Simulate checkout.session.completed with payment_status === 'paid'
      if (eventType === 'checkout.session.completed') {
        if (!fbCAPI) {
          return res.status(500).json({ error: 'Facebook CAPI not configured' });
        }

        try {
          // Check for duplicate
          const dedupResult = await checkAndRecordConversionEvent(
            testPaymentIntentId,
            `evt_test_${Date.now()}`,
            'Purchase',
            testAmount,
            'USD',
            testEmail
          );

          if (dedupResult.isDuplicate) {
            return res.json({
              success: true,
              message: 'Duplicate prevented - event already processed',
              paymentIntentId: testPaymentIntentId
            });
          }

          const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
            : 'https://break-free-app.com';

          const nameParts = testName.trim().split(' ');
          const firstName = nameParts[0] || undefined;
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

          const result = await fbCAPI.sendPurchase(
            `${baseUrl}/checkout`,
            {
              email: testEmail,
              firstName,
              lastName,
            },
            {
              value: testAmount,
              currency: 'USD',
              content_name: testProductName,
            },
            {
              eventId: testPaymentIntentId,
              eventTime: Math.floor(Date.now() / 1000),
            }
          );

          await updateConversionEventMetaResponse(testPaymentIntentId, JSON.stringify(result));

          console.log(`[Test Webhook] Purchase event sent to Meta:`, {
            success: result.success,
            eventsReceived: result.response?.events_received,
            error: result.error
          });

          return res.json({
            success: result.success,
            message: result.success ? 'Purchase event sent to Meta' : 'Failed to send event',
            paymentIntentId: testPaymentIntentId,
            metaResponse: result.response,
            error: result.error
          });
        } catch (error: any) {
          console.error('[Test Webhook] Error:', error.message);
          return res.status(500).json({ error: error.message });
        }
      }

      // Simulate payment_intent.payment_failed
      if (eventType === 'payment_intent.payment_failed') {
        if (!fbCAPI) {
          return res.status(500).json({ error: 'Facebook CAPI not configured' });
        }

        try {
          const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
            : 'https://break-free-app.com';

          const nameParts = testName.trim().split(' ');
          const firstName = nameParts[0] || undefined;
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

          const result = await fbCAPI.sendPaymentFailed(
            `${baseUrl}/checkout`,
            {
              email: testEmail,
              firstName,
              lastName,
            },
            {
              value: testAmount,
              currency: 'USD',
              content_name: testProductName,
              error_reason: 'card_declined',
            }
          );

          console.log(`[Test Webhook] PaymentFailed event sent to Meta:`, {
            success: result.success,
            eventsReceived: result.response?.events_received
          });

          return res.json({
            success: result.success,
            message: result.success ? 'PaymentFailed event sent to Meta' : 'Failed to send event',
            paymentIntentId: testPaymentIntentId,
            metaResponse: result.response,
            error: result.error
          });
        } catch (error: any) {
          console.error('[Test Webhook] Error:', error.message);
          return res.status(500).json({ error: error.message });
        }
      }

      // Simulate invoice.paid (for subscription payments)
      if (eventType === 'invoice.paid') {
        if (!fbCAPI) {
          return res.status(500).json({ error: 'Facebook CAPI not configured' });
        }

        const { invoiceId, billingReason } = req.body;
        const testInvoiceId = invoiceId || `in_test_${Date.now()}`;
        const testBillingReason = billingReason || 'subscription_create';

        console.log(`[Test Webhook] Simulating invoice.paid:`, {
          invoiceId: testInvoiceId,
          billingReason: testBillingReason,
          amount: testAmount,
          email: testEmail
        });

        try {
          // Check for duplicate
          const dedupResult = await checkAndRecordConversionEvent(
            testInvoiceId,
            `evt_test_${Date.now()}`,
            'Purchase',
            testAmount,
            'USD',
            testEmail
          );

          if (dedupResult.isDuplicate) {
            return res.json({
              success: true,
              message: 'Duplicate prevented - event already processed',
              invoiceId: testInvoiceId
            });
          }

          // ALWAYS use production domain for Facebook CAPI
          const baseUrl = process.env.PRODUCTION_DOMAIN 
            ? `https://${process.env.PRODUCTION_DOMAIN}` 
            : 'https://break-free-app.com';

          const nameParts = testName.trim().split(' ');
          const firstName = nameParts[0] || undefined;
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

          const contentName = testBillingReason === 'subscription_create' 
            ? 'Trial Subscription' 
            : 'Monthly Subscription';

          const result = await fbCAPI.sendPurchase(
            `${baseUrl}/checkout`,
            {
              email: testEmail,
              firstName,
              lastName,
            },
            {
              value: testAmount,
              currency: 'USD',
              content_name: contentName,
            },
            {
              eventId: testInvoiceId,
              eventTime: Math.floor(Date.now() / 1000),
            }
          );

          await updateConversionEventMetaResponse(testInvoiceId, JSON.stringify(result));

          console.log(`[Test Webhook] Invoice paid Purchase event sent to Meta:`, {
            success: result.success,
            eventsReceived: result.response?.events_received,
            error: result.error
          });

          return res.json({
            success: result.success,
            message: result.success ? 'Invoice paid Purchase event sent to Meta' : 'Failed to send event',
            invoiceId: testInvoiceId,
            billingReason: testBillingReason,
            metaResponse: result.response,
            error: result.error
          });
        } catch (error: any) {
          console.error('[Test Webhook] Error:', error.message);
          return res.status(500).json({ error: error.message });
        }
      }

      return res.status(400).json({ 
        error: 'Unsupported eventType',
        supportedTypes: ['checkout.session.completed', 'payment_intent.payment_failed', 'invoice.paid']
      });
    });

    console.log('[Dev] Test webhook endpoint available at POST /api/test-webhook/stripe');

    // Recovery endpoint: Manually send missed purchase events to Facebook
    app.post("/api/debug/recover-purchase", async (req, res) => {
      const { paymentIntentId, invoiceId, sessionId } = req.body;

      if (!fbCAPI) {
        return res.status(500).json({ error: 'Facebook CAPI not configured' });
      }

      try {
        let eventId: string;
        let amount: number;
        let email: string | undefined;
        let name: string | undefined;
        let currency = 'USD';
        let contentName = 'BreakFree Purchase';
        let fbc: string | undefined;
        let fbp: string | undefined;

        if (sessionId) {
          // Recover from Checkout Session
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          const sessionData = session as any;
          
          if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Session payment not completed', paymentStatus: session.payment_status });
          }

          eventId = session.payment_intent 
            ? (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id)
            : sessionData.subscription 
              ? (typeof sessionData.subscription === 'string' ? sessionData.subscription : sessionData.subscription.id)
              : session.id;
          
          amount = (session.amount_total || 0) / 100;
          email = session.customer_email || session.customer_details?.email || undefined;
          name = session.customer_details?.name || undefined;
          currency = (session.currency || 'usd').toUpperCase();
          contentName = session.metadata?.product_name || (sessionData.mode === 'subscription' ? 'Subscription' : 'BreakFree Purchase');
          fbc = session.metadata?.fbc;
          fbp = session.metadata?.fbp;
          
        } else if (invoiceId) {
          // Recover from Invoice (subscription)
          const invoice = await stripe.invoices.retrieve(invoiceId);
          const invoiceData = invoice as any;
          
          if (invoice.status !== 'paid') {
            return res.status(400).json({ error: 'Invoice not paid', status: invoice.status });
          }

          eventId = invoice.id;
          amount = (invoiceData.amount_paid || 0) / 100;
          currency = (invoice.currency || 'usd').toUpperCase();
          contentName = invoiceData.billing_reason === 'subscription_create' ? 'Trial Subscription' : 'Monthly Subscription';

          // Get customer details
          const customerId = typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer as any)?.id;
          if (customerId) {
            const customer = await stripe.customers.retrieve(customerId);
            email = (customer as Stripe.Customer).email || undefined;
            name = (customer as Stripe.Customer).name || undefined;
            fbc = (customer as Stripe.Customer).metadata?.fbc;
            fbp = (customer as Stripe.Customer).metadata?.fbp;
          }

        } else if (paymentIntentId) {
          // Recover from PaymentIntent
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          
          if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment not succeeded', status: paymentIntent.status });
          }

          eventId = paymentIntent.id;
          amount = paymentIntent.amount / 100;
          currency = (paymentIntent.currency || 'usd').toUpperCase();
          email = paymentIntent.metadata?.email;
          name = paymentIntent.metadata?.name;
          contentName = paymentIntent.metadata?.type || 'BreakFree Purchase';
          fbc = paymentIntent.metadata?.fbc;
          fbp = paymentIntent.metadata?.fbp;

        } else {
          return res.status(400).json({ error: 'Provide paymentIntentId, invoiceId, or sessionId' });
        }

        // Check if already processed
        const existing = await db.select()
          .from(conversionEvents)
          .where(eq(conversionEvents.eventId, eventId))
          .limit(1);

        if (existing.length > 0) {
          return res.json({
            success: true,
            message: 'Event already sent to Facebook previously',
            eventId,
            alreadySent: true,
            originalSentAt: existing[0].metaSentAt
          });
        }

        // Record the event
        await db.insert(conversionEvents).values({
          eventId,
          stripeEventId: `recovery_${Date.now()}`,
          eventType: 'Purchase',
          amount: amount.toFixed(2),
          currency,
          customerEmail: email,
        });

        // Send to Facebook
        // ALWAYS use production domain for Facebook CAPI
        const baseUrl = process.env.PRODUCTION_DOMAIN 
          ? `https://${process.env.PRODUCTION_DOMAIN}` 
          : 'https://break-free-app.com';

        const nameParts = (name || '').trim().split(' ');
        const firstName = nameParts[0] || undefined;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

        const result = await fbCAPI.sendPurchase(
          `${baseUrl}/checkout`,
          {
            email,
            firstName,
            lastName,
            fbc,
            fbp,
          },
          {
            value: amount,
            currency,
            content_name: contentName,
          },
          {
            eventId,
            eventTime: Math.floor(Date.now() / 1000),
          }
        );

        // Update with Meta response
        await db.update(conversionEvents)
          .set({
            metaSentAt: new Date(),
            metaResponse: JSON.stringify(result),
          })
          .where(eq(conversionEvents.eventId, eventId));

        console.log(`[Recovery] Purchase event sent to Meta:`, {
          eventId,
          amount,
          email: email ? `${email.substring(0, 3)}***` : 'none',
          success: result.success
        });

        return res.json({
          success: result.success,
          message: result.success ? 'Purchase event recovered and sent to Facebook' : 'Failed to send event',
          eventId,
          amount,
          currency,
          metaResponse: result.response,
          error: result.error
        });

      } catch (error: any) {
        console.error('[Recovery] Error:', error.message);
        return res.status(500).json({ error: error.message });
      }
    });

    // List recent Stripe checkout sessions and invoices that might be missing
    app.get("/api/debug/recent-stripe-events", async (req, res) => {
      try {
        // Get recent successful checkout sessions
        const sessions = await stripe.checkout.sessions.list({
          limit: 20,
          expand: ['data.payment_intent']
        });

        // Get recent paid invoices (for subscriptions)
        const invoices = await stripe.invoices.list({
          limit: 20,
          status: 'paid'
        });

        // Get recorded events from our database
        const recordedEvents = await db.select()
          .from(conversionEvents)
          .orderBy(desc(conversionEvents.createdAt))
          .limit(50);

        const recordedEventIds = new Set(recordedEvents.map(e => e.eventId));

        // Find missing events
        const missingSessions = sessions.data
          .filter(s => s.payment_status === 'paid')
          .filter(s => {
            const sessionData = s as any;
            const eventId = s.payment_intent 
              ? (typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent.id)
              : sessionData.subscription 
                ? (typeof sessionData.subscription === 'string' ? sessionData.subscription : sessionData.subscription.id)
                : s.id;
            return !recordedEventIds.has(eventId);
          })
          .map(s => {
            const sessionData = s as any;
            return {
              type: 'session',
              id: s.id,
              amount: (s.amount_total || 0) / 100,
              email: s.customer_email,
              mode: sessionData.mode,
              created: new Date(s.created * 1000).toISOString()
            };
          });

        const missingInvoices = invoices.data
          .filter(i => {
            const invoiceData = i as any;
            return invoiceData.subscription && !recordedEventIds.has(i.id);
          })
          .map(i => {
            const invoiceData = i as any;
            return {
              type: 'invoice',
              id: i.id,
              amount: (invoiceData.amount_paid || 0) / 100,
              billingReason: invoiceData.billing_reason,
              created: new Date(invoiceData.created * 1000).toISOString()
            };
          });

        res.json({
          summary: {
            totalMissingSessions: missingSessions.length,
            totalMissingInvoices: missingInvoices.length,
            totalRecorded: recordedEvents.length
          },
          missingSessions,
          missingInvoices,
          recentRecorded: recordedEvents.slice(0, 10).map(e => ({
            eventId: e.eventId,
            type: e.eventType,
            amount: e.amount,
            sentToMeta: !!e.metaSentAt,
            createdAt: e.createdAt
          }))
        });

      } catch (error: any) {
        console.error('[Debug] Error fetching Stripe events:', error.message);
        return res.status(500).json({ error: error.message });
      }
    });

    // RECOVERY ENDPOINT: Fetch all missed purchases from Stripe and send to Facebook
    app.post("/api/debug/recover-purchases", async (req, res) => {
      try {
        console.log('[Recovery] Starting purchase recovery from Stripe...');
        
        const recovered: any[] = [];
        const errors: any[] = [];
        const alreadyRecorded: any[] = [];

        // Get ALL paid checkout sessions (up to 100)
        const sessions = await stripe.checkout.sessions.list({
          limit: 100,
          expand: ['data.payment_intent', 'data.customer']
        });

        // Get ALL paid invoices (for subscriptions)
        const invoices = await stripe.invoices.list({
          limit: 100,
          status: 'paid'
        });

        // Get recorded events from our database
        const recordedEvents = await db.select()
          .from(conversionEvents)
          .limit(500);
        const recordedEventIds = new Set(recordedEvents.map(e => e.eventId));

        // Process checkout sessions
        for (const session of sessions.data) {
          if (session.payment_status !== 'paid') continue;
          
          const sessionData = session as any;
          const eventId = session.payment_intent 
            ? (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id)
            : sessionData.subscription 
              ? (typeof sessionData.subscription === 'string' ? sessionData.subscription : sessionData.subscription.id)
              : session.id;

          // Skip if already recorded
          if (recordedEventIds.has(eventId) || recordedEventIds.has(session.id)) {
            alreadyRecorded.push({ type: 'session', id: session.id, eventId });
            continue;
          }

          const amount = (session.amount_total || 0) / 100;
          if (amount <= 0) continue;

          try {
            // Record in database first
            await db.insert(conversionEvents).values({
              eventId: eventId,
              stripeEventId: `recovered_session_${session.id}`,
              eventType: 'Purchase',
              amount: amount.toString(),
              currency: session.currency?.toUpperCase() || 'USD',
              customerEmail: session.customer_email || undefined
            }).onConflictDoNothing();

            // Send to Facebook
            if (fbCAPI) {
              const eventTime = Math.floor(session.created);
              const result = await fbCAPI.sendEvent({
                eventName: 'Purchase',
                eventTime: eventTime,
                eventId: eventId,
                eventSourceUrl: 'https://break-free-app.com/checkout',
                userData: {
                  email: session.customer_email || undefined,
                  ip: '0.0.0.0',
                  userAgent: 'Stripe-Webhook-Recovery'
                },
                customData: {
                  currency: session.currency?.toUpperCase() || 'USD',
                  value: amount
                }
              });

              // Mark as sent
              if (result.success) {
                await db.update(conversionEvents)
                  .set({ metaSentAt: new Date() })
                  .where(eq(conversionEvents.eventId, eventId));
              }

              recovered.push({
                type: 'session',
                id: session.id,
                eventId,
                amount,
                email: session.customer_email,
                sentToMeta: result.success
              });
              console.log(`[Recovery] ✅ Recovered session ${session.id} - $${amount}`);
            }
          } catch (err: any) {
            errors.push({ type: 'session', id: session.id, error: err.message });
            console.error(`[Recovery] ❌ Failed session ${session.id}:`, err.message);
          }
        }

        // Process invoices (subscription payments)
        for (const invoice of invoices.data) {
          const invoiceData = invoice as any;
          if (!invoiceData.subscription) continue;
          
          // Skip if already recorded
          if (recordedEventIds.has(invoice.id)) {
            alreadyRecorded.push({ type: 'invoice', id: invoice.id });
            continue;
          }

          const amount = (invoiceData.amount_paid || 0) / 100;
          if (amount <= 0) continue;

          try {
            // Record in database first
            await db.insert(conversionEvents).values({
              eventId: invoice.id,
              stripeEventId: `recovered_invoice_${invoice.id}`,
              eventType: 'Purchase',
              amount: amount.toString(),
              currency: invoiceData.currency?.toUpperCase() || 'USD',
              customerEmail: invoiceData.customer_email || undefined
            }).onConflictDoNothing();

            // Send to Facebook
            if (fbCAPI) {
              const eventTime = Math.floor(invoiceData.created);
              const result = await fbCAPI.sendEvent({
                eventName: 'Purchase',
                eventTime: eventTime,
                eventId: invoice.id,
                eventSourceUrl: 'https://break-free-app.com/checkout',
                userData: {
                  email: invoiceData.customer_email || undefined,
                  ip: '0.0.0.0',
                  userAgent: 'Stripe-Webhook-Recovery'
                },
                customData: {
                  currency: invoiceData.currency?.toUpperCase() || 'USD',
                  value: amount
                }
              });

              // Mark as sent
              if (result.success) {
                await db.update(conversionEvents)
                  .set({ metaSentAt: new Date() })
                  .where(eq(conversionEvents.eventId, invoice.id));
              }

              recovered.push({
                type: 'invoice',
                id: invoice.id,
                amount,
                billingReason: invoiceData.billing_reason,
                sentToMeta: result.success
              });
              console.log(`[Recovery] ✅ Recovered invoice ${invoice.id} - $${amount}`);
            }
          } catch (err: any) {
            errors.push({ type: 'invoice', id: invoice.id, error: err.message });
            console.error(`[Recovery] ❌ Failed invoice ${invoice.id}:`, err.message);
          }
        }

        console.log(`[Recovery] Complete: ${recovered.length} recovered, ${alreadyRecorded.length} already recorded, ${errors.length} errors`);

        res.json({
          success: true,
          summary: {
            recovered: recovered.length,
            alreadyRecorded: alreadyRecorded.length,
            errors: errors.length,
            totalSessionsChecked: sessions.data.length,
            totalInvoicesChecked: invoices.data.length
          },
          recovered,
          errors: errors.length > 0 ? errors : undefined
        });

      } catch (error: any) {
        console.error('[Recovery] Error:', error.message);
        return res.status(500).json({ error: error.message });
      }
    });

    // AUTOMATIC RECOVERY: Run every 5 minutes to catch missed webhooks
    const runAutoRecovery = async () => {
      try {
        console.log('[AutoRecovery] Starting automatic purchase recovery check...');
        
        let recovered = 0;
        let alreadyRecorded = 0;

        // Get recent paid invoices from last 24 hours (for subscriptions)
        const invoices = await stripe.invoices.list({
          limit: 50,
          status: 'paid',
          created: { gte: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000) }
        });

        // Get recorded events from our database
        const recordedEvents = await db.select()
          .from(conversionEvents)
          .limit(500);
        const recordedEventIds = new Set(recordedEvents.map(e => e.eventId));

        // Process invoices
        for (const invoice of invoices.data) {
          const invoiceData = invoice as any;
          if (!invoiceData.subscription) continue;
          
          if (recordedEventIds.has(invoice.id)) {
            alreadyRecorded++;
            continue;
          }

          const amount = (invoiceData.amount_paid || 0) / 100;
          if (amount <= 0) continue;

          try {
            await db.insert(conversionEvents).values({
              eventId: invoice.id,
              stripeEventId: `auto_recovery_${invoice.id}`,
              eventType: 'Purchase',
              amount: amount.toString(),
              currency: invoiceData.currency?.toUpperCase() || 'USD',
              customerEmail: invoiceData.customer_email || undefined
            }).onConflictDoNothing();

            if (fbCAPI) {
              const eventTime = Math.floor(invoiceData.created);
              const result = await fbCAPI.sendEvent({
                eventName: 'Purchase',
                eventTime: eventTime,
                eventId: invoice.id,
                eventSourceUrl: 'https://break-free-app.com/checkout',
                userData: {
                  email: invoiceData.customer_email || undefined,
                  ip: '0.0.0.0',
                  userAgent: 'Stripe-Auto-Recovery'
                },
                customData: {
                  currency: invoiceData.currency?.toUpperCase() || 'USD',
                  value: amount
                }
              });

              if (result.success) {
                await db.update(conversionEvents)
                  .set({ metaSentAt: new Date() })
                  .where(eq(conversionEvents.eventId, invoice.id));
                recovered++;
                console.log(`[AutoRecovery] ✅ Recovered invoice ${invoice.id} - $${amount}`);
              }
            }
          } catch (err: any) {
            console.error(`[AutoRecovery] ❌ Failed ${invoice.id}:`, err.message);
          }
        }

        if (recovered > 0) {
          console.log(`[AutoRecovery] Complete: ${recovered} purchases recovered, ${alreadyRecorded} already tracked`);
        }
      } catch (error: any) {
        console.error('[AutoRecovery] Error:', error.message);
      }
    }

    // Run auto-recovery every 5 minutes
    setInterval(runAutoRecovery, 5 * 60 * 1000);
    
    // Also run once at startup after a short delay
    setTimeout(runAutoRecovery, 30000);
    console.log('[AutoRecovery] Automatic purchase recovery enabled - runs every 5 minutes');

    // Diagnostic endpoint for webhook setup
    app.get("/api/debug/webhook-status", async (req, res) => {
      const webhookUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/webhook/stripe`
        : 'https://your-domain.com/api/webhook/stripe';

      const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
      const hasFbPixel = !!process.env.FB_PIXEL_ID;
      const hasFbToken = !!process.env.FB_ACCESS_TOKEN;
      
      // Check if using test or live Stripe keys
      const stripeKey = process.env.STRIPE_SECRET_KEY || '';
      const isTestMode = stripeKey.startsWith('sk_test_');
      const isLiveMode = stripeKey.startsWith('sk_live_');

      // Get recent conversion events
      const recentEvents = await db.select()
        .from(conversionEvents)
        .orderBy(desc(conversionEvents.createdAt))
        .limit(10);

      const realEvents = recentEvents.filter(e => !e.eventId.startsWith('pi_test_') && !e.eventId.startsWith('in_test_'));
      const testEvents = recentEvents.filter(e => e.eventId.startsWith('pi_test_') || e.eventId.startsWith('in_test_'));

      res.json({
        status: {
          stripeMode: isLiveMode ? 'LIVE (Production)' : isTestMode ? 'TEST (Development)' : 'UNKNOWN',
          stripeWebhookSecret: hasWebhookSecret ? 'CONFIGURED' : 'MISSING - Webhook will fail in production!',
          facebookPixel: hasFbPixel ? 'CONFIGURED' : 'MISSING',
          facebookAccessToken: hasFbToken ? 'CONFIGURED' : 'MISSING',
          facebookCAPI: fbCAPI ? 'CONNECTED' : 'NOT CONNECTED'
        },
        warning: isTestMode ? 'Using TEST mode Stripe keys - purchases will not appear in live Stripe account!' : null,
        webhookUrl: webhookUrl,
        instructions: hasWebhookSecret ? null : {
          step1: 'Go to Stripe Dashboard → Developers → Webhooks',
          step2: `Add endpoint: ${webhookUrl}`,
          step3: 'Select events: checkout.session.completed, invoice.paid, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed',
          step4: 'Copy the webhook signing secret (starts with whsec_)',
          step5: 'Add it as STRIPE_WEBHOOK_SECRET in your Replit Secrets'
        },
        recentEvents: {
          realPurchases: realEvents.length,
          testPurchases: testEvents.length,
          events: recentEvents.map(e => ({
            eventId: e.eventId,
            type: e.eventType,
            amount: e.amount,
            email: e.customerEmail ? `${e.customerEmail.substring(0, 3)}***` : null,
            isTest: e.eventId.startsWith('pi_test_') || e.eventId.startsWith('in_test_'),
            metaSent: !!e.metaSentAt,
            createdAt: e.createdAt
          }))
        }
      });
    });
  }

  // Send quiz results via email
  app.post("/api/send-results-email", async (req, res) => {
    try {
      const { email, name, answers } = req.body;

      if (!email || !name || !answers) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Analyze quiz answers
      const analysis = analyzeQuizAnswers(answers);

      // Get Resend client
      const { client: resend, fromEmail } = await getUncachableResendClient();

      // Send email
      const { data, error } = await resend.emails.send({
        from: 'Break Free <hello@break-free-app.com>',
        to: [email],
        subject: '🌸 Your Break Free Quiz Results',
        html: generateResultsEmail({
          userName: name,
          traumaScore: analysis.traumaScore,
          primaryPattern: analysis.primaryPattern,
          recommendations: analysis.recommendations,
        }),
      });

      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Error sending email: " + error.message });
      }

      res.json({ success: true, messageId: data?.id });
    } catch (error: any) {
      console.error("Error sending results email:", error);
      res.status(500).json({ message: "Error sending email: " + error.message });
    }
  });

  // Test endpoint to send results email using Resend test address
  app.post("/api/test-results-email", async (req, res) => {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        return res.status(400).json({ message: "Missing email or name" });
      }

      // Get Resend client
      const { client: resend } = await getUncachableResendClient();

      // Use test data for a realistic preview
      const testAnalysis = {
        traumaScore: 72,
        primaryPattern: 'Emotional Regulation Challenges',
        recommendations: [
          'Learn to name and identify your emotions throughout the day',
          'Practice the 5-4-3-2-1 grounding technique during overwhelm',
          'Create a "feelings wheel" to expand your emotional vocabulary',
          'Develop healthy emotional release practices (movement, art, writing)',
        ],
      };

      // Send email using verified domain
      const { data, error } = await resend.emails.send({
        from: 'Break Free <hello@break-free-app.com>',
        to: [email],
        subject: '🌸 Your Break Free Quiz Results',
        html: generateResultsEmail({
          userName: name,
          traumaScore: testAnalysis.traumaScore,
          primaryPattern: testAnalysis.primaryPattern,
          recommendations: testAnalysis.recommendations,
        }),
      });

      if (error) {
        console.error('Error sending test email:', error);
        return res.status(500).json({ message: "Error sending email: " + error.message });
      }

      res.json({ success: true, messageId: data?.id });
    } catch (error: any) {
      console.error("Error sending test results email:", error);
      res.status(500).json({ message: "Error sending email: " + error.message });
    }
  });

  // Analyze quiz answers (without sending email)
  app.post("/api/analyze-quiz", async (req, res) => {
    try {
      const { answers } = req.body;

      if (!answers) {
        return res.status(400).json({ message: "Missing quiz answers" });
      }

      const analysis = analyzeQuizAnswers(answers);
      res.json(analysis);
    } catch (error: any) {
      console.error("Error analyzing quiz:", error);
      res.status(500).json({ message: "Error analyzing quiz: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
