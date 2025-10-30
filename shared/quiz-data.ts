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

export type Question = RadioQuestion | SliderQuestion | EmojiGridQuestion | ImageChoiceQuestion | QuoteReflectionQuestion | PopupQuestion;

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
    id: 'q1',
    chapter: 'past',
    text: 'How would you describe yourself?',
    type: 'radio',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  },
  {
    id: 'q2',
    chapter: 'past',
    text: 'Growing up, how often did you feel truly heard by your parents?',
    type: 'radio',
    options: [
      { value: 'always', label: 'Almost always' },
      { value: 'often', label: 'Often' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'never', label: 'Almost never' },
    ],
  },
  {
    id: 'q3',
    chapter: 'past',
    type: 'emoji-grid',
    text: 'When you think about your childhood home, what do you feel?',
    emojis: [
      { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
      { value: 'anxious', emoji: '😰', label: 'Anxious' },
      { value: 'sad', emoji: '😢', label: 'Sad' },
      { value: 'angry', emoji: '😠', label: 'Angry' },
      { value: 'confused', emoji: '😕', label: 'Confused' },
      { value: 'grateful', emoji: '🙏', label: 'Grateful' },
    ],
  },
  {
    id: 'q4',
    chapter: 'past',
    text: 'Which of these experiences resonates with your childhood? (Select all that apply)',
    type: 'multi',
    options: [
      { value: 'emotional-neglect', label: 'Feeling emotionally neglected' },
      { value: 'criticism', label: 'Frequent criticism or judgment' },
      { value: 'instability', label: 'Unstable home environment' },
      { value: 'high-expectations', label: 'Pressure to meet high expectations' },
      { value: 'none', label: 'None of these' },
    ],
  },
  {
    id: 'q5',
    chapter: 'patterns',
    type: 'quote-reflection',
    quote: 'I often hide my pain behind humor or a smile.',
    options: [
      { value: 'strongly', label: 'Strongly relate' },
      { value: 'somewhat', label: 'Somewhat relate' },
      { value: 'hardly', label: 'Hardly relate' },
      { value: 'not-at-all', label: 'Not at all' },
    ],
  },
  {
    id: 'q6',
    chapter: 'patterns',
    text: 'In your relationships today, do you tend to...',
    type: 'radio',
    options: [
      { value: 'avoid', label: 'Avoid getting too close to others' },
      { value: 'seek-validation', label: 'Constantly seek validation and approval' },
      { value: 'trust-easily', label: 'Trust others easily and openly' },
      { value: 'guarded', label: 'Feel guarded but wish you weren\'t' },
    ],
  },
  {
    id: 'q7',
    chapter: 'patterns',
    type: 'slider',
    text: 'How often do you struggle with feelings of not being "enough"?',
    min: 0,
    max: 100,
    minLabel: 'Almost never',
    maxLabel: 'Almost daily',
    defaultValue: 50,
  },
  {
    id: 'q8',
    chapter: 'patterns',
    type: 'popup',
    text: 'Do you often feel on edge or easily startled?',
    options: [
      { value: 'yes-often', label: 'Yes, often' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'q9',
    chapter: 'healing',
    type: 'image-choice',
    text: 'Which environment speaks to your ideal healing space?',
    options: [
      { value: 'nature', label: 'Nature', description: 'Peaceful outdoor sanctuary', emoji: '🌲' },
      { value: 'cozy', label: 'Cozy Room', description: 'Warm, safe indoor space', emoji: '🛋️' },
      { value: 'beach', label: 'Beach', description: 'Calming ocean waves', emoji: '🏖️' },
      { value: 'mountains', label: 'Mountains', description: 'Grounding elevation', emoji: '⛰️' },
    ],
  },
  {
    id: 'q10',
    chapter: 'healing',
    text: 'What does healing look like to you? (Select all that apply)',
    type: 'multi',
    options: [
      { value: 'inner-peace', label: 'Finding inner peace' },
      { value: 'healthy-relationships', label: 'Building healthy relationships' },
      { value: 'self-love', label: 'Learning to love myself' },
      { value: 'breaking-patterns', label: 'Breaking old patterns' },
      { value: 'joy', label: 'Experiencing more joy' },
    ],
  },
  {
    id: 'q11',
    chapter: 'healing',
    type: 'slider',
    text: 'How much time are you willing to dedicate to your healing journey each day?',
    min: 0,
    max: 60,
    minLabel: '0 minutes',
    maxLabel: '60+ minutes',
    defaultValue: 15,
  },
  {
    id: 'q12',
    chapter: 'future',
    text: 'Imagine yourself one year from now, having done the healing work. What do you see?',
    type: 'radio',
    options: [
      { value: 'confident', label: 'A more confident, grounded version of myself' },
      { value: 'connected', label: 'Deeper connections with loved ones' },
      { value: 'peaceful', label: 'A sense of peace I\'ve never known' },
      { value: 'free', label: 'Freedom from my past' },
    ],
  },
  {
    id: 'q13',
    chapter: 'future',
    text: 'How ready are you to commit to your healing journey?',
    type: 'radio',
    options: [
      { value: 'very-ready', label: 'Very ready - I\'m committed' },
      { value: 'ready', label: 'Ready and hopeful' },
      { value: 'somewhat', label: 'Somewhat ready, but nervous' },
      { value: 'exploring', label: 'Just exploring my options' },
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
