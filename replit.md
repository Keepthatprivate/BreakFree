# Break Free Quiz

## Overview

Break Free Quiz is an emotionally-driven web application designed to assess childhood trauma patterns through an interactive, multi-format questionnaire. The application guides users through a reflective journey across four distinct chapters (Your Past, Your Patterns, Your Healing, Your Future), using various question formats and empathy-driven micro-interactions to create a safe, therapeutic experience. The ultimate goal is to convert visitors into leads for a healing app while providing immediate value through personalized insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: The application uses shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. This provides:
- Accessible, composable UI components
- Consistent design system following wellness/mental health app aesthetics
- Dark mode support with custom color theming

**Design Philosophy**: Reference-based wellness approach (inspired by Headspace, Calm, Better Help):
- Emotional safety first with generous spacing and soft visual hierarchy
- Progressive trust building through gentle UI transitions
- Breathing room via generous padding and rounded corners (24px/16px/12px)
- Calming color palette (light blue, soft beige, green for CTAs)

**State Management**: 
- React useState hooks for local component state
- LocalStorage for answer persistence (allows users to resume quiz)
- No global state management library needed due to simple, linear flow

**Routing**: Wouter for lightweight client-side routing

**Key UI Patterns**:
- Progress tracking with chapter indicators (4-dot system)
- Multiple question formats: radio buttons, sliders, emoji grids, image choices, quote reflections, popup modals
- Animated transitions (fade, slide-up, pop-in with 0.3-0.5s delays)
- Break screens between sections (data cards, quotes, empathy messages)
- Split-screen results page ("Before vs After" visualization)

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Structure**: RESTful endpoints with `/api` prefix convention
- Current implementation provides scaffolding for future API routes
- Request/response logging middleware for development
- JSON parsing with raw body preservation for webhook compatibility

**Development Server**: Custom Vite integration with HMR (Hot Module Replacement)
- Middleware mode for seamless development experience
- Custom error overlay for runtime errors
- Static file serving for production builds

**Data Storage Strategy**:
- In-memory storage interface (IStorage) for development
- Prepared for database integration (schema suggests PostgreSQL with Drizzle ORM)
- LocalStorage on client-side for quiz state persistence
- User model scaffolded (id, username, password fields)

### External Dependencies

**Database**:
- Drizzle ORM configured for PostgreSQL dialect
- Neon Database serverless driver (`@neondatabase/serverless`)
- Schema defined in TypeScript with Zod validation
- Migration support via drizzle-kit

**UI Libraries**:
- Radix UI primitives for 25+ accessible components (dialogs, popovers, dropdowns, etc.)
- Tailwind CSS v3+ for utility-first styling
- Embla Carousel for potential multi-slide components
- Lucide React for icon system

**Form Management**:
- React Hook Form with @hookform/resolvers for validation
- Zod schemas for type-safe form validation

**Data Fetching**:
- TanStack Query (React Query) v5 for server state management
- Configured with custom query functions for API requests
- Aggressive caching strategy (staleTime: Infinity, no refetch on window focus)

**Fonts**: 
- Google Fonts integration (Inter for primary text, Lora for empathy messages/quotes)
- Preconnected for performance optimization

**Session Management**:
- connect-pg-simple for PostgreSQL-backed sessions (when database is connected)
- Express session handling prepared but not yet implemented

**Development Tools**:
- Replit-specific plugins for development banner, runtime error modal, and cartographer
- TypeScript with strict mode enabled
- Path aliases configured (@/, @shared/, @assets/)

## Recent Changes (October 31, 2025)

1. **Chapter Indicators**: Removed dedicated chapter transition pages while maintaining chapter indicators visible on all quiz screens (shows current chapter: Your Past, Your Patterns, Your Healing, Your Future)

2. **Visual Pattern Component**: 
   - Created `VisualPattern.tsx` with animated SVG patterns using floating CSS animations for visual-test questions
   - Changed q10 from "waves" pattern to "lines" pattern with multiple diagonal/horizontal animated lines
   - Removed tree visualization from q12 to avoid biasing users (changed from visual-test to radio question type)
   - Redesigned q10 visual pattern (October 31, 2025) to show clean, simple design representing paths, barriers, navigation and chaos:
     - Green horizontal paths (some continuous, some broken)
     - Red vertical barriers (obstacles blocking paths)
     - Green diagonal dashed lines (navigation around barriers)
     - Pulsing green dots (representing complexity/chaos)
     - Dark slate background for clarity
     - Visual metaphor for navigating life's complexity with obstacles

3. **Email Results Integration**: 
   - Set up Resend connector for sending personalized quiz results via email
   - Created `resend-client.ts` with Replit connector authentication
   - Built `email-templates.ts` with HTML email templates
   - Added `/api/send-results-email` endpoint for post-purchase result delivery

4. **Dynamic Results Generation**:
   - Created `quiz-analyzer.ts` to analyze quiz answers and detect trauma patterns
   - Fixed critical bug: Both frontend and backend now properly iterate through ALL selected values in multi-select questions (especially q6)
   - Results page now displays personalized content based on user's primary pattern (abandonment, control, emotional, trust)
   - Added `/api/analyze-quiz` endpoint for real-time result calculation
   - "Before" and "After" states adapt to detected pattern

5. **Mobile Optimization**:
   - Reduced padding/spacing on mobile viewports (py-4 sm:py-6 instead of py-8 sm:py-12)
   - Smaller font sizes on mobile (text-xl sm:text-2xl instead of text-3xl sm:text-4xl)
   - Compact card layouts (p-5 sm:p-8)
   - Adjusted minimum heights for mobile screens

6. **Instant Button Display**:
   - Removed all button animation delays across the application
   - Eliminated 2-second setTimeout delay in BreakScreen component
   - Buttons now appear instantly on all pages (welcome, quiz, break screens, results, etc.)

7. **Audio Optimization**:
   - Reduced footsteps audio (q4) from 12 seconds to 3 seconds using ffmpeg

8. **Unified Checkout System**:
   - Created `CheckoutPage.tsx` component with Stripe Elements integration
   - Supports all payment types: upsell guides (€14.99), donations (variable amount), and trial subscriptions (€1.00)
   - Integrated Apple Pay and Google Pay for faster checkout
   - Saved payment methods enabled for subsequent purchases
   - Updated Quiz.tsx flow: UpsellPage → CheckoutPage → DonationPage (optional) → CheckoutPage (if donation selected) → TrialTimeline → CheckoutPage (if trial selected)
   - DonationPage has "Continue to Checkout" and "Skip contribution" options
   - TrialTimeline has "Start 7-Day Trial" (routes to checkout) and "Continue without trial" options
   - Stripe integration uses `clientSecret` pattern with automatic payment methods

9. **Branding Updates**:
   - Replaced "Breeze" with "BreakFree App" throughout the application
   - Updated TrialTimeline to show "Sign up for BreakFree App"
   - Consistent branding across all user-facing text

10. **Payment Method Optimization**:
   - Updated PaymentElement layout from 'tabs' to 'accordion' for better wallet visibility
   - Apple Pay and Google Pay are now prominently displayed at the top
   - Payment method order prioritizes: Apple Pay → Google Pay → Card
   - Apple Pay is automatically selected when available on supported devices

11. **Quiz Question Simplification (October 31, 2025)**:
   - Reduced all questions to 2-4 answer options maximum (no questions exceed 4 options)
   - Shortened all answer labels to 1-2 words maximum for clarity
   - Simplified question wording for easier understanding while maintaining emotional impact
   - Example changes:
     - q2: 5 options → 4 options → 3 options ("Always", "Sometimes", "Never")
     - q2 text: "Did your parents listen to you growing up?" → "Did your parents truly listen to you growing up?"
     - q3: 6 emoji options → 4 emoji options → 3 emoji options (Peaceful, Anxious, Sad)
     - q4: "Curiosity or excitement" → "Curious" (all answers 1 word)
     - q6: "Avoid getting too close to others" → "Avoid closeness" (2 words)
     - q13: "Very ready - I'm committed" → "Very ready" (2 words)
   - Visual pattern (q10) redesigned for cleaner appearance:
     - Reduced from 12 lines to 5 horizontal lines with better spacing
     - Reduced from 8 particles to 3 for minimal distraction
     - Softened background gradient and animations
     - Result: Leaner, easier to interpret visual test
   - All question types maintained: radio, slider, emoji-grid, audio-test, visual-test, quote-reflection, image-choice
   - End-to-end testing verified improved user experience with clearer, more concise options

12. **New Benefit Pages and Flow Optimization (October 31, 2025)**:
   - Created three new benefit pages shown between donation and trial timeline:
     - `SevenDaysPage.tsx`: "Feel the difference" messaging with 7-day benefits breakdown
     - `PlanHelpPage.tsx`: "This plan will help you..." with specific outcome promises
     - `TrustPage.tsx`: "People trust us" with credibility messaging
   - Updated flow: Donation → Benefits → SevenDaysPage → PlanHelpPage → TrustPage → Trial Timeline → Trial Checkout → Results
   - Removed "Continue without trial" option from TrialTimeline (simplified to single CTA)
   - Updated button text across funnel for better conversion:
     - DonationPage: "Continue to Checkout" → "Donate"
     - TrialTimeline: "Start 7-Day Trial" → "Get my result and plan"
     - CheckoutPage: "Pay" → "Access my result and plan"
   - Made TrialTimeline.onContinue optional since skip button removed
   - All benefit pages follow consistent design pattern: illustration, headline, supporting copy, single CTA

13. **Landing Page Creation (October 31, 2025)**:
   - Created new `LandingPage.tsx` component as the entry point before the quiz
   - Updated routing: "/" now shows landing page, "/quiz" starts the quiz
   - Design elements:
     - BreakFree bird logo in top left corner with brand name
     - Clean SVG illustration (200x200px) showing person in meditation pose with peaceful pulsing aura
     - Animated elements: pulsing green glow, floating calm energy particles, twinkling sparkles
     - Simple, immediately recognizable design clearly communicating mental health and healing
     - Gradient effects for depth and visual appeal
     - Headline: "Break free from childhood trauma"
     - Subheadline: "Uncover your trauma score and learn how to move forward with confidence"
     - Green CTA button: "Take test" (leads to quiz)
     - Dark background (#0a0a0a) consistent with app theme
   - Illustration symbolizes peace, calm, and healing journey through meditation/mindfulness

## Key Design Decisions

**Question Flow Architecture**: The quiz uses a linear state machine with multiple states (quiz, empathy, break, contact, results, checkout). This was chosen to:
- Create natural breathing room between sections
- Build psychological safety through predictable patterns
- Allow for dynamic content injection (empathy messages, data breaks) at specific trigger points
- Chapter transition pages removed but chapter indicators remain visible

**Client-Side Persistence**: Answers stored in localStorage rather than server-side to:
- Allow instant resume functionality without authentication
- Reduce server load for initial user engagement
- Enable offline-first experience
- Simplify data capture flow (only collect email/name at the end)

**Component Modularity**: Each question type and screen type (break, empathy, results) is a separate component because:
- Different question formats require distinct interaction patterns
- Enables A/B testing of specific question types
- Allows for gradual addition of new question formats
- Simplifies maintenance and testing

**Styling Approach**: Tailwind CSS with custom design tokens over CSS-in-JS because:
- Faster development with utility classes
- Smaller bundle size in production
- Easy theme customization via CSS variables
- Better integration with shadcn/ui component library