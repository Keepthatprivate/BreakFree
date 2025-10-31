import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auth } from "./auth";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      
      // Create payment intent for 7-day trial (you can adjust the amount)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 0, // Free trial - no charge initially
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
      const { email } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1499, // €14.99 in cents
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email,
          type: "upsell-guides"
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating upsell payment:", error);
      res.status(500).json({ message: "Error creating upsell payment: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
