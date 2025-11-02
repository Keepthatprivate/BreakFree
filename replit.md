# Break Free Quiz

## Overview
Break Free Quiz is an emotionally-driven web application designed to assess childhood trauma patterns through an interactive, multi-format questionnaire. It guides users through a reflective journey across four distinct chapters ("Your Past", "Your Patterns", "Your Healing", "Your Future"), using various question formats and empathy-driven micro-interactions to create a safe, therapeutic experience. The primary goal is to convert visitors into leads for a healing app by providing immediate value through personalized insights. The application incorporates a unique "water/ripple" theme for visual storytelling and enhanced user engagement, culminating in a blur-reveal mechanism for results that encourages trial sign-ups.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript (Vite build tool).
- **UI Component System**: shadcn/ui on Radix UI primitives with Tailwind CSS for accessible, consistent, and themable design (including dark mode).
- **Design Philosophy**: Wellness-inspired (Headspace, Calm) with emphasis on emotional safety, progressive trust, generous spacing, rounded corners, and a calming color palette.
- **State Management**: React `useState` for local state, `LocalStorage` for quiz persistence.
- **Routing**: Wouter for lightweight client-side routing.
- **Key UI Patterns**: Progress tracking, multiple question formats (radio, slider, emoji, image, quote, audio, visual), animated transitions, break screens, split-screen results, and a dynamic water-themed background system that evolves with quiz chapters. Ripple effects are triggered on answer selection.
- **Mobile Optimization**: Responsive design with reduced padding, smaller font sizes, and compact layouts for mobile viewports.
- **Core Features**:
    - **Landing Page**: Entry point with branding, headline, subheadline, and CTA to start the quiz, featuring the initial "still water" background.
    - **Quiz Flow**: Linear state machine with states for quiz questions, empathy messages, break screens, contact form, results, and checkout.
    - **Dynamic Results**: `quiz-analyzer.ts` for detecting trauma patterns and generating personalized results, adapting "Before" and "After" states to the primary pattern.
    - **Checkout System**: Integrated `CheckoutPage.tsx` with Stripe Elements for various payment types (upsell guides, donations, trial subscriptions), supporting Apple Pay and Google Pay.
    - **Blur-Reveal Mechanism**: Results page blurs content until a trial payment is made, using a "Clear the water - Start €1 Trial" CTA and a dramatic unblur animation upon payment.

### Backend
- **Server Framework**: Express.js with TypeScript.
- **API Structure**: RESTful endpoints (`/api` prefix).
- **Development Server**: Custom Vite integration with HMR and middleware mode.
- **Data Storage Strategy**: In-memory storage for development, prepared for PostgreSQL with Drizzle ORM. Client-side `LocalStorage` for quiz state.

## External Dependencies

- **Database**: Drizzle ORM (PostgreSQL dialect), Neon Database serverless driver.
- **UI Libraries**: Radix UI, Tailwind CSS, Embla Carousel, Lucide React (icons).
- **Form Management**: React Hook Form, Zod (validation).
- **Data Fetching**: TanStack Query (React Query) v5 for server state management with aggressive caching.
- **Fonts**: Google Fonts (Inter, Lora).
- **Session Management**: connect-pg-simple (for PostgreSQL-backed sessions).
- **Email Service**: Resend connector for transactional emails (results, purchase confirmations).
- **Payment Gateway**: Stripe for secure payment processing.
- **Development Tools**: Replit-specific plugins, TypeScript (strict mode), Path aliases.