export interface BaseQuestion {
  id: string;
  chapter: string;
  text: string;
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio' | 'multi';
  options: { value: string; label: string }[];
}

export interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  defaultValue?: number;
}

export interface EmojiGridQuestion extends BaseQuestion {
  type: 'emoji-grid';
  emojis: { value: string; emoji: string; label: string }[];
}

export interface ImageChoiceQuestion extends BaseQuestion {
  type: 'image-choice';
  options: { value: string; label: string; description: string; emoji: string }[];
}

export interface QuoteReflectionQuestion {
  type: 'quote-reflection';
  id: string;
  chapter: string;
  quote: string;
  options: { value: string; label: string }[];
}

export interface PopupQuestion extends BaseQuestion {
  type: 'popup';
  options: { value: string; label: string }[];
}

export interface AudioTestQuestion extends BaseQuestion {
  type: 'audio-test';
  soundDescription: string;
  audioPrompt: string;
  options: { value: string; label: string; interpretation: string }[];
}

export interface VisualTestQuestion extends BaseQuestion {
  type: 'visual-test';
  imageDescription: string;
  visualPattern: string;
  options: { value: string; label: string; interpretation: string }[];
}

export type Question = RadioQuestion | SliderQuestion | EmojiGridQuestion | ImageChoiceQuestion | QuoteReflectionQuestion | PopupQuestion | AudioTestQuestion | VisualTestQuestion;

export interface DataBreak {
  type: 'data-break';
  id: string;
  chapter: string;
  emoji: string;
  statistic: string;
  source: string;
  subtext: string;
}

export interface QuoteBreak {
  type: 'quote-break';
  id: string;
  chapter: string;
  quote: string;
  author: string;
  subtext: string;
}

export interface TestimonialBreak {
  type: 'testimonial-break';
  id: string;
  chapter: string;
  quote: string;
  author: string;
  rating: number;
}

export interface VisualPauseBreak {
  type: 'visual-pause';
  id: string;
  chapter: string;
  text: string;
  emoji: string;
}

export type BreakScreen = DataBreak | QuoteBreak | TestimonialBreak | VisualPauseBreak;

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
}

export const chapters: Chapter[] = [
  { id: 'past', title: 'Your Past', subtitle: 'Understanding where you came from' },
  { id: 'patterns', title: 'Your Patterns', subtitle: 'Recognizing how the past shows up today' },
  { id: 'healing', title: 'Your Healing', subtitle: 'Exploring your path forward' },
  { id: 'future', title: 'Your Future', subtitle: 'Envisioning the peace you deserve' },
];

export const questions: Question[] = [
  {
    id: 'q2',
    chapter: 'past',
    text: 'Did you feel truly heard by your parents as a child?',
    type: 'radio',
    options: [
      { value: 'always', label: 'Always' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'never', label: 'Never' },
    ],
  },
  {
    id: 'q3',
    chapter: 'past',
    type: 'emoji-grid',
    text: 'When you think about your childhood, what do you feel?',
    emojis: [
      { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
      { value: 'anxious', emoji: '😰', label: 'Anxious' },
      { value: 'sad', emoji: '😢', label: 'Sad' },
      { value: 'confused', emoji: '😕', label: 'Confused' },
    ],
  },
  {
    id: 'q4',
    chapter: 'past',
    type: 'audio-test',
    text: 'Hear footsteps approaching. What do you feel?',
    soundDescription: '🔊 Footsteps getting closer',
    audioPrompt: 'Close your eyes. Footsteps are approaching your door.',
    options: [
      { value: 'curiosity', label: 'Curious', interpretation: 'You associate presence with positive connection' },
      { value: 'anxiety', label: 'Anxious', interpretation: 'You may have experienced unpredictable parental moods' },
      { value: 'safety', label: 'Safe', interpretation: 'You felt protected in your environment' },
      { value: 'fear', label: 'Afraid', interpretation: 'Approaching figures may trigger past trauma' },
    ],
  },
  {
    id: 'q5',
    chapter: 'patterns',
    type: 'quote-reflection',
    quote: 'I hide my pain behind humor or a smile.',
    options: [
      { value: 'strongly', label: 'Always' },
      { value: 'somewhat', label: 'Sometimes' },
      { value: 'not-at-all', label: 'Never' },
    ],
  },
  {
    id: 'q6',
    chapter: 'patterns',
    text: 'In relationships, do you...',
    type: 'radio',
    options: [
      { value: 'avoid', label: 'Avoid closeness' },
      { value: 'seek-validation', label: 'Seek approval' },
      { value: 'trust-easily', label: 'Trust easily' },
    ],
  },
  {
    id: 'q7',
    chapter: 'patterns',
    type: 'slider',
    text: 'How often do you feel "not enough"?',
    min: 0,
    max: 100,
    minLabel: 'Never',
    maxLabel: 'Daily',
    defaultValue: 50,
  },
  {
    id: 'q8',
    chapter: 'patterns',
    type: 'audio-test',
    text: 'Hear a door closing. What do you feel?',
    soundDescription: '🔊 A door closing firmly',
    audioPrompt: 'Close your eyes. A door is closing with a firm click.',
    options: [
      { value: 'safety', label: 'Safe', interpretation: 'You associate closure with protection' },
      { value: 'isolation', label: 'Shut out', interpretation: 'You may fear abandonment or isolation' },
      { value: 'finality', label: 'Ending', interpretation: 'You connect sounds to loss or finality' },
      { value: 'neutral', label: 'Neutral', interpretation: 'You process sensory input neutrally' },
    ],
  },
  {
    id: 'q9',
    chapter: 'healing',
    type: 'image-choice',
    text: 'Where would you feel most at peace?',
    options: [
      { value: 'nature', label: 'Nature', description: 'Peaceful outdoor sanctuary', emoji: '🌲' },
      { value: 'cozy', label: 'Cozy room', description: 'Warm, safe indoor space', emoji: '🛋️' },
      { value: 'beach', label: 'Beach', description: 'Calming ocean waves', emoji: '🏖️' },
      { value: 'mountains', label: 'Mountains', description: 'Grounding elevation', emoji: '⛰️' },
    ],
  },
  {
    id: 'q10',
    chapter: 'healing',
    type: 'visual-test',
    text: 'Look at this pattern. What do you see?',
    imageDescription: '👁️ Abstract flowing pattern',
    visualPattern: 'lines',
    options: [
      { value: 'parallel', label: 'Lines', interpretation: 'You seek harmony and alignment in healing' },
      { value: 'barriers', label: 'Barriers', interpretation: 'You may still feel protected or guarded' },
      { value: 'paths', label: 'Paths', interpretation: 'You\'re ready to move toward growth' },
      { value: 'chaos', label: 'Chaos', interpretation: 'You may feel overwhelmed by the journey ahead' },
    ],
  },
  {
    id: 'q11',
    chapter: 'healing',
    type: 'slider',
    text: 'How much daily time can you give yourself?',
    min: 0,
    max: 60,
    minLabel: '0 min',
    maxLabel: '60+ min',
    defaultValue: 15,
  },
  {
    id: 'q12',
    chapter: 'future',
    type: 'radio',
    text: 'Imagine a tree. How does it look?',
    options: [
      { value: 'full-bloom', label: 'Blooming' },
      { value: 'growing', label: 'Growing' },
      { value: 'weathered', label: 'Weathered' },
    ],
  },
  {
    id: 'q13',
    chapter: 'future',
    text: 'How ready are you to begin healing?',
    type: 'radio',
    options: [
      { value: 'very-ready', label: 'Very ready' },
      { value: 'somewhat', label: 'Nervous' },
      { value: 'exploring', label: 'Exploring' },
    ],
  },
];

export const breakScreens: BreakScreen[] = [
  {
    type: 'data-break',
    id: 'break1',
    chapter: 'past',
    emoji: '🧠',
    statistic: 'Harvard School of Public Health found that people who experienced childhood neglect have a 30% higher risk of chronic stress.',
    source: 'Harvard School of Public Health',
    subtext: 'But awareness and guided healing can reverse much of that impact.',
  },
  {
    type: 'quote-break',
    id: 'break2',
    chapter: 'patterns',
    quote: 'It\'s never too late to have a happy childhood.',
    author: 'Tom Robbins',
    subtext: 'Many people begin healing in adulthood — and that\'s powerful.',
  },
  {
    type: 'testimonial-break',
    id: 'break3',
    chapter: 'healing',
    quote: 'Break Free helped me stop repeating painful patterns. I finally feel peace.',
    author: 'James, 34',
    rating: 4.9,
  },
  {
    type: 'visual-pause',
    id: 'break4',
    chapter: 'future',
    text: 'Every question brings you closer to understanding.',
    emoji: '🌅',
  },
];

export const empathyMessages = [
  "You're doing great. Taking this step shows real courage.",
  "This awareness is the first step toward healing.",
  "Your feelings are valid, and you're not alone in this.",
  "Recognizing these patterns is a powerful act of self-care.",
  "Every answer brings you closer to understanding yourself.",
  "You deserve peace, and healing is possible.",
];
