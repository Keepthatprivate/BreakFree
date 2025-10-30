# Break Free Quiz - Comprehensive Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Wellness/Mental Health)

Drawing inspiration from therapeutic wellness applications like Headspace, Calm, and Better Help, this design prioritizes emotional safety, trust-building, and gentle user engagement. The interface balances the utility of a quiz flow with the emotional sensitivity required for trauma-related content.

**Core Design Principles:**
- **Emotional Safety First:** Every element should feel nurturing and non-threatening
- **Progressive Trust Building:** Design should encourage vulnerability through gentle progression
- **Breathing Room:** Generous spacing creates psychological comfort
- **Soft Hierarchy:** Guide without overwhelming—subtle visual cues over harsh contrasts

---

## Typography System

### Font Selection
**Primary Font:** Inter or DM Sans (clean, modern, highly legible)
**Accent Font:** Crimson Pro or Lora (for empathy messages and emotional quotes)

### Type Scale & Hierarchy

**Hero/Chapter Titles:**
- Font size: text-4xl to text-5xl
- Weight: font-semibold (600)
- Line height: leading-tight
- Letter spacing: tracking-tight

**Question Text:**
- Font size: text-2xl to text-3xl
- Weight: font-medium (500)
- Line height: leading-snug
- Max width: max-w-2xl for optimal reading

**Empathy Messages:**
- Font family: Accent font (serif)
- Font size: text-lg to text-xl
- Weight: font-normal (400)
- Style: italic
- Line height: leading-relaxed

**Answer Options:**
- Font size: text-base to text-lg
- Weight: font-normal, selected state font-medium
- Line height: leading-normal

**Body Copy (Results Page):**
- Font size: text-base
- Weight: font-normal
- Line height: leading-relaxed
- Max width: max-w-prose

**CTAs and Buttons:**
- Font size: text-base to text-lg
- Weight: font-semibold (600)
- Letter spacing: tracking-wide
- Text transform: none (natural case)

---

## Layout System

### Spacing Primitives
**Core Tailwind Units:** 2, 4, 6, 8, 12, 16, 20, 24

**Common Patterns:**
- Card padding: p-8 to p-12 (desktop), p-6 (mobile)
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Element gaps: gap-4 for tight groups, gap-8 for section separation
- Button padding: px-8 py-4 (large CTAs), px-6 py-3 (standard)
- Input fields: p-4

### Container Strategy
- **Quiz Container:** max-w-3xl mx-auto (centered, focused)
- **Results Page:** max-w-7xl mx-auto (wider for split-screen content)
- **Form Elements:** max-w-md for name/email inputs
- **Horizontal padding:** px-4 (mobile), px-6 (tablet), px-8 (desktop)

### Grid Patterns
- **Question Layout:** Single column, centered
- **Results Before/After:** grid-cols-1 md:grid-cols-2 (split screen)
- **Donation Buttons:** grid-cols-3 gap-4 (desktop), grid-cols-1 gap-3 (mobile)
- **Answer Options:** Stack vertically with gap-3 to gap-4

---

## Component Library

### 1. Progress Bar (Top Fixed/Sticky)
**Structure:**
- Full-width container with inner max-w-7xl
- Height: h-2 to h-3
- Position: sticky top-0 with backdrop blur
- Chapter indicators: 4 segments with labels
- Active state: filled segment with subtle pulse animation

### 2. Question Cards
**Layout:**
- Centered card with rounded-2xl
- Backdrop blur effect (glassy aesthetic)
- Border: subtle, thin border
- Shadow: shadow-xl with soft blur
- Padding: p-8 to p-12
- Min-height: min-h-[400px] to maintain consistency

**Internal Structure:**
- Chapter label at top (small, uppercase, tracking-wider)
- Question text with generous margin-bottom (mb-8)
- Answer options container with gap-3
- Navigation buttons at bottom with space-between

### 3. Answer Options (Radio/Multi-Choice)
**Design:**
- Full-width clickable cards
- Padding: p-4 to p-6
- Rounded: rounded-xl
- Border: 2px border
- Hover state: scale-[1.02] transform
- Selected state: thicker border, subtle shadow
- Transition: all 200ms ease-in-out

### 4. Empathy Message Cards
**Presentation:**
- Appears between questions with fade-in animation
- Centered, max-w-xl
- Padding: p-6 to p-8
- Rounded: rounded-2xl
- Icon or small illustration: w-12 h-12 at top
- Message in accent serif font
- Subtle background treatment (frosted glass)

### 5. Navigation Buttons
**Primary CTA (Continue/Next):**
- Full width on mobile, auto-width on desktop
- Padding: px-8 py-4
- Rounded: rounded-xl
- Shadow: shadow-lg
- Hover: scale-105 transform with glow effect

**Secondary (Previous):**
- Ghost/outline style
- Same dimensions as primary
- Positioned at bottom-left or in flex layout

**Button Group Layout:**
- Flex container with justify-between
- Gap: gap-4
- Margin-top: mt-8 to mt-12

### 6. Results Page - Split Screen Layout

**Before Section (Left/Top):**
- Full height on desktop, auto on mobile
- Subtle gradient overlay
- Content padding: p-12 to p-16
- Vertical centering of content

**After Section (Right/Bottom):**
- Mirror structure of Before section
- Lighter treatment, more optimistic visual weight

**Content Elements:**
- Headline: text-3xl to text-4xl, font-bold, mb-6
- Supporting text: text-lg, mb-8
- Testimonial card embedded with:
  - Avatar: w-16 h-16, rounded-full
  - Name and age: text-base, font-semibold
  - Quote: text-sm to text-base, italic
  - Rating: text-sm with star icons
  - Card padding: p-6, rounded-xl

### 7. Donation Section
**Layout:**
- Centered container, max-w-2xl
- Heading: text-2xl, font-semibold, text-center, mb-4
- Subheading: text-base, text-center, mb-8
- Button grid: 3 columns on desktop, stack on mobile

**Donation Buttons:**
- Aspect ratio: aspect-video for rectangular cards
- Padding: p-6
- Rounded: rounded-2xl
- Amount: text-3xl, font-bold
- Label: text-sm below amount
- Hover: lift effect with scale-105
- Each button is independently interactive card

**Supporting Text:**
- Below buttons: text-sm, text-center, mt-6
- Max-width: max-w-md, mx-auto

### 8. Name/Email Capture Form
**Structure:**
- Max-width: max-w-md, centered
- Label-above-input pattern
- Input spacing: space-y-6

**Input Fields:**
- Padding: p-4
- Rounded: rounded-xl
- Border: 2px border
- Focus state: ring-4 with offset
- Font size: text-base
- Placeholder: subtle, guiding

**Submit Button:**
- Full width
- Follows Primary CTA styling
- Margin-top: mt-8

---

## Animation & Micro-Interactions

### Timing & Easing
- **Question Transitions:** 300-500ms with ease-in-out
- **Card Hover:** 200ms with ease-out
- **Button Interactions:** 150ms with ease-in-out
- **Progress Bar:** 600ms with ease-out for fills

### Allowed Animations (Subtle Only)
- **Fade In/Out:** Opacity transitions for question changes
- **Gentle Slide:** translateY(20px) to translateY(0) on entry
- **Pulse:** Subtle scale animation on empathy message appearance
- **Progress Fill:** Smooth width transition on chapter advancement
- **Button Glow:** Soft shadow expansion on hover
- **Card Lift:** scale-102 to scale-105 on interactive elements

### Forbidden Patterns
- Excessive bouncing or attention-grabbing effects
- Rapid or jarring movements
- Continuous looping animations
- Parallax scrolling (maintain stability)

---

## Responsive Behavior

### Breakpoint Strategy
- **Mobile:** Base styles (default)
- **Tablet:** md: breakpoint (768px+)
- **Desktop:** lg: breakpoint (1024px+)

### Mobile-First Adaptations
- Stack all multi-column layouts to single column
- Reduce padding values by ~33% (p-12 → p-6)
- Full-width buttons instead of inline
- Reduce font sizes by 1-2 steps (text-3xl → text-2xl)
- Progress bar: Show only fill, hide detailed labels
- Before/After: Stack vertically instead of side-by-side

### Touch Targets
- Minimum size: h-12 for all interactive elements
- Spacing between touch targets: gap-4 minimum
- Generous padding on answer option cards

---

## Images

**Hero/Background Treatment:**
No large hero image. Instead, use subtle background treatments:
- Soft gradient overlays on quiz pages
- Abstract calming patterns (waves, organic shapes) at very low opacity
- Frosted glass/blur effects on card backgrounds

**Results Page Imagery:**
- Before section: Subtle texture or abstract representation of past challenges
- After section: Lighter, more optimistic abstract imagery
- Testimonial: Circular avatar placeholder (w-16 h-16)

**Icon Usage:**
- Use Heroicons (outline style) via CDN
- Icon size: w-5 h-5 for inline, w-8 h-8 for standalone
- Placement: Left of text in buttons, above empathy messages
- Examples needed: check circle (completed), arrow-right (navigation), heart (empathy)

---

## Accessibility Implementation

- **Focus States:** 4px ring with offset on all interactive elements
- **Keyboard Navigation:** Tab order follows visual hierarchy
- **ARIA Labels:** Descriptive labels for progress bar segments, radio groups
- **Form Validation:** Clear error messages with sufficient contrast
- **Touch Targets:** Minimum 44x44px for all clickable elements
- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3)