import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auth } from "./auth";
import Stripe from "stripe";
import { getUncachableResendClient } from "./resend-client";
import { generateResultsEmail, generatePurchaseConfirmationEmail } from "./email-templates";
import { analyzeQuizAnswers } from "./quiz-analyzer";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        amount: '€14.99'
      };
    case 'trial':
      return {
        productName: '7-Day BreakFree App Trial',
        productLink: `${baseUrl}/app`,
        amount: '€1.00'
      };
    case 'donation':
      return {
        productName: 'Thank You for Your Contribution',
        productLink: `${baseUrl}/`,
        amount: `€${(amount / 100).toFixed(2)}`
      };
    default:
      return {
        productName: 'BreakFree Purchase',
        productLink: baseUrl,
        amount: `€${(amount / 100).toFixed(2)}`
      };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
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
        currency: "eur",
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

  // Create payment intent for trial subscription
  app.post("/api/create-trial-payment", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      // Create payment intent for 7-day trial at €1.00
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100, // €1.00 in cents for 7-day trial
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email,
          name,
          type: "trial"
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating trial payment:", error);
      res.status(500).json({ message: "Error creating trial payment: " + error.message });
    }
  });

  // Create payment intent for upsell guides
  app.post("/api/create-upsell-payment", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1499, // €14.99 in cents
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email,
          name: name || 'Valued Customer',
          type: "upsell-guides"
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
      const { amount, email, name } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email: email || 'anonymous',
          name: name || 'Anonymous Supporter',
          type: "donation"
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating donation payment:", error);
      res.status(500).json({ message: "Error creating donation payment: " + error.message });
    }
  });

  // Stripe webhook endpoint for payment events
  app.post("/api/webhook/stripe", async (req: Request & { rawBody?: Buffer }, res) => {
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

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { email, name, type } = paymentIntent.metadata;

      if (email && name) {
        try {
          // Get product details based on payment type
          const productDetails = getProductDetails(type, paymentIntent.amount);

          // Get Resend client
          const { client: resend, fromEmail } = await getUncachableResendClient();

          // Send purchase confirmation email
          await resend.emails.send({
            from: fromEmail || 'BreakFree <onboarding@resend.dev>',
            to: [email],
            subject: '✓ Thank You for Your Purchase',
            html: generatePurchaseConfirmationEmail({
              userName: name,
              productName: productDetails.productName,
              productLink: productDetails.productLink,
              amount: productDetails.amount,
            }),
          });

          console.log(`Purchase confirmation email sent to ${email} for ${type}`);
        } catch (error: any) {
          console.error('Error sending purchase confirmation email:', error);
          // Don't fail the webhook - payment already succeeded
        }
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
        from: fromEmail || 'Break Free <onboarding@resend.dev>',
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
