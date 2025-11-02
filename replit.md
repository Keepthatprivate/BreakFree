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

## Recent Enhancements (November 02, 2025)

### Break Free Quiz 2.0 - Ripple Evolution Upgrade

**Water/Ripple Theme (Version 1.0)**:
- **WaterBackground Component**: Animated CSS gradient system evolving across 4 chapters (Still Water → Gentle Ripples → Calmer Glow → Dawn Light)
- **RippleEffect Component**: SVG-based teal ripple animations triggered on answer selection (1-second duration)
- **Landing Page**: Updated with water metaphor - "Each choice creates a ripple. See what your reflection reveals."
- **Empathy Messages**: Water-themed copy ("Still waters remember...", "Every ripple you notice becomes calmer...")
- **Blur-Reveal Mechanism**: Results locked behind €1 trial payment with dramatic 1-second unblur animation

**2.0 Enhancements**:
- **Scanning Reflection Stage** (ResultsPage): Added 2.5-second pre-blur "scanning" state showing "The surface is calming... Your reflection is forming" before blur tease overlay
- **Trauma-Specific Ripple Patterns** (TraumaRipplePattern component): Animated SVG backgrounds for each trauma type:
  - Abandonment: Fast expanding circles (1.5s) representing push/pull dynamics
  - Control: Tight concentric rotating rings (6s) representing rigidity
  - Emotional: Irregular dissolving ellipses (3-3.5s) representing turbulence
  - Trust: Intersecting ripples from two sources (2.5s) representing connection
  - Patterns display at 15% opacity as subtle backgrounds on results page
- **Auto-Continue Empathy Messages**: Added 2.5-second auto-advance timer while preserving manual continue button, applied Lora font for emotional warmth
- **CRO Copy Updates**: 
  - Donation page: "Add ripples of change for others—your contribution funds free healing access"
  - Results CTA: "Unlock My Reflection - €1 Trial"
- **Timing Optimizations**: All transitions use 300-400ms for snappy feel, animations respect `prefers-reduced-motion`

**Technical Implementation**:
- Water background transitions: 400ms crossfade between chapters
- State management: `isScanning` state for pre-blur gate, `hasTrialAccess` for unlock logic
- Animation performance: CSS `will-change`, `pointer-events-none` on decorative elements
- Mobile optimization: Reduced animation complexity, simplified gradients for 4G performance
- Accessibility: Full support for reduced-motion preferences, WCAG AA contrast compliance

### Break Free Quiz 3.0 - Time-Descent Journey Integration (November 02, 2025)

**Age Regression System**:
- **AgeIndicator Component**: Top-left display showing current age that maps to chapters
  - Chapter 1 (Past) → Age 25
  - Chapter 2 (Patterns) → Age 18
  - Chapter 3 (Healing) → Age 10
  - Chapter 4 (Future) → Age 6
  - Fades in with 700ms transition on chapter changes
  - Subtle styling (40% opacity white)

**Enhanced Background System**:
- **ChapterBackground Component**: Replaces WaterBackground with Lottie animation support
  - Attempts to load chapter-specific Lottie JSON files (chapter-bg-1-surface.json through chapter-bg-4-innerchild.json)
  - Falls back to enhanced static gradients if Lottie files unavailable
  - 4 distinct gradient themes representing descent journey:
    - Chapter 1: "Surface" - still, reflective water
    - Chapter 2: "Descending" - rippling, movement
    - Chapter 3: "Depth" - darker, mysterious
    - Chapter 4: "Inner Child" - softer, glowing
  - Parallax zoom animation (30s cycle, scale 1 → 1.05) for depth illusion
  - Crossfade transitions (400ms) between chapters
  - Full reduced-motion support (disables Lottie, parallax, pulse overlays)

**Inner Child Climax Scene**:
- **InnerChildScene Component**: Full-screen emotional encounter after final quiz question
  - Appears instead of going directly to contact form
  - Emotional messaging: "You've reached the depths" / "Your younger self has been waiting"
  - Glowing center element with pulse (3s) and ping (2s) animations
  - CTA: "Begin Your Healing Journey — €1 Trial"
  - Integrates with existing Stripe checkout flow via handleStartTrial()
  - Lora serif font for emotional warmth
  - 1s fade-in transition
  - Full reduced-motion support (disables animations, instant transitions)

**Updated Empathy Messages**:
- Descent-themed copy aligned with time-travel narrative:
  - "The surface shimmers… memories begin to stir."
  - "You're descending into quieter waters."
  - "Light filters through; the child waits below."
  - "Almost there. One more breath."

**Technical Implementation**:
- Quiz state: Added 'innerchild' state for climactic scene
- Age mapping: getAgeForChapter() function maps chapters to ages
- Flow: quiz → innerchild scene → checkout → results (preserves all 2.0 features)
- CSS animations: parallaxZoom, pulse, ping keyframes
- Package: lottie-react for animation playback
- Accessibility: Comprehensive reduced-motion support across all new components
- Preserves: All 2.0 ripple features, blur-reveal, trauma patterns, scanning stage