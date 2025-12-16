# Break Free Quiz

## Overview

Break Free Quiz is an emotionally-driven web application designed to assess childhood trauma patterns through an interactive, multi-format questionnaire. It guides users through a reflective journey across four chapters (Your Past, Your Patterns, Your Healing, Your Future) using various question formats and empathy-driven micro-interactions to create a safe, therapeutic experience. The primary goal is to convert visitors into leads for a healing app by providing personalized insights and guiding them towards a trial or purchase. The project aims to offer immediate value while establishing a pathway for users to engage further with healing resources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript (Vite build tool).
**UI Component System**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling, offering accessibility, a consistent design system, and dark mode support.
**Design Philosophy**: Wellness-oriented (Headspace, Calm inspiration) focusing on emotional safety, progressive trust-building, generous spacing, rounded corners, and a calming color palette.
**State Management**: React useState for local component state; LocalStorage for quiz persistence.
**Routing**: Wouter for lightweight client-side routing.
**Key UI Patterns**: Progress tracking (4-dot system), diverse question formats (radio, sliders, emoji, images, quotes, modals), animated transitions, break screens, and a split-screen results page. Includes a cinematic intro sequence with video and interactive elements for gender selection, utilizing Framer Motion for animations.

### Backend Architecture

**Server Framework**: Express.js with TypeScript.
**API Structure**: RESTful endpoints (`/api` prefix) with scaffolding for future routes, request/response logging, and JSON parsing.
**Development Server**: Custom Vite integration with HMR and error overlay.
**Data Storage Strategy**: In-memory storage interface for development, prepared for PostgreSQL integration with Drizzle ORM. LocalStorage for client-side quiz state.

### System Design Choices

**Question Flow Architecture**: Linear state machine with states for quiz, empathy, animation, quote-break, contact, checkout, and results to create natural breaks, build psychological safety, and allow dynamic content injection.
**Break Screen Flow**: Both animations and quote breaks appear at the START of each new chapter:
- **Animations** (gender-specific 3-image sequences) play FIRST to mark chapter transitions and create emotional continuity
- **Quote Breaks** (data-break, quote-break, testimonial-break, visual-pause) appear IMMEDIATELY AFTER animations to provide reflection moments
- Flow: Answer chapter questions → Animation → Quote → First question of new chapter
- Special case: First chapter (Past) has no animation/quote at start; final break after last question shows only quote (no animation)
**Client-Side Persistence**: Answers stored in LocalStorage for instant resume functionality and reduced server load.
**Component Modularity**: Each question and screen type is a separate component for diverse interaction patterns, A/B testing, and easier maintenance.
**Styling Approach**: Tailwind CSS with custom design tokens for faster development, smaller bundle size, and easy theme customization.

## External Dependencies

**Database**: Drizzle ORM for PostgreSQL, `@neondatabase/serverless` driver.
**UI Libraries**: Radix UI primitives, Tailwind CSS v3+, Lucide React for icons.
**Form Management**: React Hook Form with `@hookform/resolvers` and Zod for validation.
**Data Fetching**: TanStack Query (React Query) v5 for server state management with aggressive caching.
**Fonts**: Google Fonts (Inter, Lora) integration.
**Session Management**: `connect-pg-simple` prepared for PostgreSQL-backed sessions.
**Email Integration**: Resend connector for transactional emails, with `email-templates.ts` for personalized results and purchase confirmations.
**Payment Processing**: Stripe Elements for unified checkout (upsell guides, donations, trials) with Apple Pay and Google Pay integration.
**Facebook Conversions API (CAPI)**: Server-side event tracking with strict environment validation, comprehensive diagnostic tools (`/debug/test-capi`, `/debug/health`, `/fbc-validator`), automatic retry queue for failed events, SHA256 hashing for PII, and enhanced development logging. Tracks ViewContent, Lead, InitiateCheckout, AddPaymentInfo, and Purchase events.
- **Comprehensive Funnel Tracking**: Every step in the funnel sends a ViewContent event with unique `content_name` for drop-off analysis. Steps tracked:
  - Step 01: Quiz Start
  - Step 02: Contact Form
  - Step 03: Loading Analysis
  - Step 04: Trauma Patterns
  - Step 05: Donation
  - Step 06: Results
  - Step 07: Benefits
  - Step 08: Seven Days Preview
  - Step 09: Plan Help
  - Step 10: Trust & Stats
  - Step 11: Testimonials
  - Step 12: Trial Timeline
  - Step 13: FAQ
  - Step 14: Subscription Checkout
  - Steps 15-17: Upsell pages (Guides, Masterclass Bundle, Healing Journal)
- **fbc/fbp Timestamp Validation**: Server-side validation ensures fbc timestamps are valid (not future-dated, not older than 90 days) before sending to Meta, preventing "invalid creationTime" errors.
- **Stale Cookie Cleanup**: Frontend clears fbc cookies older than 7 days on return visits without fbclid, ensuring fresh attribution data.
**Stripe Webhook + Meta CAPI Integration**: Robust webhook handler at `/api/webhook/stripe` that processes:
- `payment_intent.created` → InitiateCheckout event sent to Meta
- `payment_intent.succeeded` → Handles subscriptions & emails only (NO Purchase to Meta)
- `payment_intent.payment_failed` → PaymentFailed event (NOT sent as Purchase)
- `checkout.session.completed` → Purchase event ONLY when `payment_status === 'paid'`
- `checkout.session.async_payment_succeeded` → Purchase for delayed payments (bank transfers)
- `checkout.session.async_payment_failed` → Logged but NOT sent as Purchase
Uses `conversion_events` PostgreSQL table for idempotent event processing, preventing duplicate Purchase events to Meta using PaymentIntent ID as unique event_id. Signature verification via STRIPE_WEBHOOK_SECRET in production.
**Development Tools**: Replit-specific plugins, TypeScript strict mode, path aliases, CORS for cross-domain requests.

## Development Guidelines

### Page Layout Pattern (IMPORTANT)
**Do NOT use `flex items-center justify-center` on full-height page containers** when the content may exceed viewport height on mobile devices. This causes a scroll-jumping bug where users cannot scroll down to interact with buttons.

**Bad pattern (causes scroll bug):**
```tsx
<div className="min-h-screen bg-background flex items-center justify-center">
```

**Good pattern (allows natural scrolling):**
```tsx
<div className="min-h-screen bg-background py-6 sm:py-8">
```

The `flex items-center justify-center` pattern is only acceptable for:
- Loading spinners (very short content)
- Error states (minimal content that fits on screen)
- Modal-style overlays

For all scrollable content pages (testimonials, FAQs, checkout forms, etc.), use padding only.