import { betterAuth } from "better-auth";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials are not set");
}

export const auth = betterAuth({
  database: {
    url: process.env.DATABASE_URL,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : "http://localhost:5000",
  trustedOrigins: process.env.REPLIT_DEV_DOMAIN 
    ? [`https://${process.env.REPLIT_DEV_DOMAIN}`]
    : ["http://localhost:5000"],
});
