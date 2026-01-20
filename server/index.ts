import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Enable compression for all responses (gzip/deflate)
// This significantly reduces transfer size for HTML, CSS, JS, and JSON
app.use(compression({
  // Compress responses larger than 1KB
  threshold: 1024,
  // Compression level (1-9, higher = better compression but slower)
  level: 6,
  // Only compress text-based content types
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter defaults (compresses text/* and application/json, etc.)
    return compression.filter(req, res);
  }
}));

// Enable trust proxy for accurate IP detection (required for Facebook CAPI)
app.set('trust proxy', true);

// HTTPS redirect middleware - eliminates HTTP → HTTPS redirect latency
// Only active in production (development uses HTTP)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Check x-forwarded-proto header (set by reverse proxy/load balancer)
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'http') {
      // 301 permanent redirect to HTTPS - browser will remember
      const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
      return res.redirect(301, httpsUrl);
    }
    next();
  });
}

// Security and performance headers middleware
app.use((_req, res, next) => {
  // HSTS - force HTTPS for 1 year, including subdomains
  // This eliminates future HTTP → HTTPS redirects after first visit
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - disable unnecessary browser features for better security
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
});

// Enable CORS for cross-domain requests (e.g., from break-free-app.com)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://break-free-app.com', 'https://www.break-free-app.com']
    : true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
}));

declare module 'express' {
  interface Request {
    rawBody?: Buffer;
  }
}

// CRITICAL: Manually capture raw body for Stripe webhook BEFORE any body parsing
// This is the most reliable method for webhook signature verification
app.use('/api/webhook/stripe', (req, res, next) => {
  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks);
    // Also set req.body to the raw buffer for the webhook handler
    (req as any).body = req.rawBody;
    next();
  });

  req.on('error', (err) => {
    console.error('[Webhook] Error reading request body:', err);
    res.status(500).send('Error reading request body');
  });
});

// For all other routes, parse JSON normally
app.use((req, res, next) => {
  // Skip JSON parsing for Stripe webhook - already handled above
  if (req.path === '/api/webhook/stripe') {
    return next();
  }
  express.json()(req, res, next);
});

// Also skip urlencoded for webhook route
app.use((req, res, next) => {
  if (req.path === '/api/webhook/stripe') {
    return next();
  }
  express.urlencoded({ extended: false })(req, res, next);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
