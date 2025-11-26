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

  // SYNC ENDPOINT: Retroactively sync Stripe purchases to Meta CAPI
  // This allows you to send historical purchases that weren't tracked
  app.post("/api/sync-stripe-to-meta", async (req, res) => {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║  STRIPE TO META CAPI SYNC - Starting...                    ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      if (!fbCAPI) {
        return res.status(500).json({ 
          success: false, 
          error: 'Facebook CAPI not configured - missing FB_PIXEL_ID or FB_ACCESS_TOKEN' 
        });
      }

      // Get date range from request or default to last 7 days
      const { startDate, endDate, limit = 100 } = req.body;
      
      const created = {
        gte: startDate ? Math.floor(new Date(startDate).getTime() / 1000) : Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000),
        lte: endDate ? Math.floor(new Date(endDate).getTime() / 1000) : Math.floor(Date.now() / 1000),
      };

      console.log(`Fetching Stripe payments from ${new Date(created.gte * 1000).toISOString()} to ${new Date(created.lte * 1000).toISOString()}`);

      // Fetch successful payment intents from Stripe
      const paymentIntents = await stripe.paymentIntents.list({
        created,
        limit: Math.min(limit, 100),
      });

      const successfulPayments = paymentIntents.data.filter(pi => pi.status === 'succeeded');
      console.log(`Found ${successfulPayments.length} successful payments`);

      const results: any[] = [];
      let successCount = 0;
      let failCount = 0;

      for (const payment of successfulPayments) {
        const { email, name, type } = payment.metadata;
        const amountInDollars = payment.amount / 100;
        const productDetails = getProductDetails(type, payment.amount);

        // Parse name
        const nameParts = (name || '').trim().split(' ');
        const firstName = nameParts[0] || undefined;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

        const baseUrl = process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
          : 'https://break-free-app.com';

        try {
          const result = await fbCAPI.sendPurchase(
            `${baseUrl}/checkout`,
            {
              email: email || undefined,
              firstName,
              lastName,
            },
            {
              value: amountInDollars,
              currency: 'USD',
              content_name: productDetails.productName,
            }
          );

          results.push({
            paymentId: payment.id,
            amount: amountInDollars,
            email: email ? `${email.substring(0, 3)}***` : 'none',
            name: name || 'Unknown',
            type: type || 'unknown',
            created: new Date(payment.created * 1000).toISOString(),
            capiResult: result.success ? 'SUCCESS' : 'FAILED',
            error: result.error,
          });

          if (result.success) {
            successCount++;
            console.log(`✓ Synced: ${payment.id} - $${amountInDollars} - ${email || 'no email'}`);
          } else {
            failCount++;
            console.log(`✗ Failed: ${payment.id} - ${result.error}`);
          }
        } catch (error: any) {
          failCount++;
          results.push({
            paymentId: payment.id,
            amount: amountInDollars,
            email: email ? `${email.substring(0, 3)}***` : 'none',
            capiResult: 'ERROR',
            error: error.message,
          });
          console.log(`✗ Error: ${payment.id} - ${error.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`\n╔════════════════════════════════════════════════════════════╗`);
      console.log(`║  SYNC COMPLETE: ${successCount} success, ${failCount} failed               ║`);
      console.log(`╚════════════════════════════════════════════════════════════╝\n`);

      res.json({
        success: true,
        summary: {
          totalFound: successfulPayments.length,
          synced: successCount,
          failed: failCount,
          dateRange: {
            from: new Date(created.gte * 1000).toISOString(),
            to: new Date(created.lte * 1000).toISOString(),
          },
        },
        payments: results,
        instructions: 'Check Facebook Events Manager to verify Purchase events. If events show as FAILED, your access token may need to be regenerated with proper permissions.',
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

  // TEST ENDPOINT: Simulate a complete purchase flow for testing Facebook events
  app.post("/api/test-purchase", async (req, res) => {
    try {
      console.log('\n🧪 TEST PURCHASE SIMULATION - Starting...\n');

      const testData = {
        email: 'test.customer@breakfree.test',
        firstName: 'Test',
        lastName: 'Customer',
        value: 14.99,
        currency: 'USD',
        contentName: 'Healing Guides Collection (Test Purchase)'
      };

      // Send Purchase event to Facebook CAPI
      const purchaseResponse = await fetch(`http://localhost:5000/api/facebook-capi/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://break-free-app.com/test-purchase',
          email: testData.email,
          firstName: testData.firstName,
          lastName: testData.lastName,
          value: testData.value,
          currency: testData.currency,
          contentName: testData.contentName
        })
      });

      const purchaseResult = await purchaseResponse.json();

      console.log('✅ Test Purchase Complete!');
      console.log('   Customer:', testData.firstName, testData.lastName);
      console.log('   Email:', testData.email);
      console.log('   Amount:', testData.value, testData.currency);
      console.log('   Product:', testData.contentName);
      console.log('   Facebook Response:', purchaseResult.success ? 'SUCCESS' : 'FAILED');

      res.json({
        success: true,
        message: 'Test purchase completed and Facebook Purchase event sent',
        testPurchaseDetails: testData,
        facebookEventResult: purchaseResult,
        instructions: 'Check your Facebook Events Manager now! Look for a Purchase event with value $14.99 from the last minute.'
      });

    } catch (error: any) {
      console.error('❌ Test Purchase Failed:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
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
          const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
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
          const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
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

      // Send Purchase event to Facebook CAPI (server-side tracking)
      // This ensures purchases are tracked even if client-side tracking fails
      if (fbCAPI) {
        try {
          const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
            : 'https://break-free-app.com';
          
          // Parse first name and last name from full name
          const nameParts = (name || '').trim().split(' ');
          const firstName = nameParts[0] || undefined;
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

          const result = await fbCAPI.sendPurchase(
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
            console.log(`[Stripe Webhook] Facebook CAPI Purchase event sent for ${type}:`, {
              paymentId: paymentIntent.id,
              amount: amountInDollars,
              email: email ? `${email.substring(0, 3)}***` : 'none',
              fbc: fbc ? 'yes' : 'no',
              fbp: fbp ? 'yes' : 'no',
              eventsReceived: result.response?.events_received
            });
          } else {
            console.error(`[Stripe Webhook] Facebook CAPI Purchase event failed:`, result.error);
          }
        } catch (fbError: any) {
          console.error('[Stripe Webhook] Error sending Facebook CAPI event:', fbError.message);
          // Don't fail the webhook - payment already succeeded
        }
      }

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

    res.json({ received: true });
  });

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
