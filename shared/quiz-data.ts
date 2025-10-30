export interface Question {
  id: string;
  chapter: string;
  text: string;
  options: { value: string; label: string }[];
  type: 'radio' | 'multi';
}

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
    id: 'q4',
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
    id: 'q5',
    chapter: 'patterns',
    text: 'When facing stress or conflict, you usually...',
    type: 'radio',
    options: [
      { value: 'shutdown', label: 'Shut down emotionally' },
      { value: 'lash-out', label: 'React strongly or lash out' },
      { value: 'seek-support', label: 'Reach out for support' },
      { value: 'self-soothe', label: 'Find healthy ways to self-soothe' },
    ],
  },
  {
    id: 'q6',
    chapter: 'patterns',
    text: 'How often do you struggle with feelings of not being "enough"?',
    type: 'radio',
    options: [
      { value: 'daily', label: 'Almost daily' },
      { value: 'often', label: 'Several times a week' },
      { value: 'sometimes', label: 'Occasionally' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'never', label: 'Almost never' },
    ],
  },
  {
    id: 'q7',
    chapter: 'healing',
    text: 'Have you ever explored therapy or healing practices?',
    type: 'radio',
    options: [
      { value: 'yes-helpful', label: 'Yes, and it was helpful' },
      { value: 'yes-not-helpful', label: 'Yes, but it wasn\'t helpful' },
      { value: 'considering', label: 'No, but I\'m considering it' },
      { value: 'not-interested', label: 'No, not interested' },
    ],
  },
  {
    id: 'q8',
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
    id: 'q9',
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
    id: 'q10',
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

export const empathyMessages = [
  "You're doing great. Taking this step shows real courage.",
  "This awareness is the first step toward healing.",
  "Your feelings are valid, and you're not alone in this.",
  "Recognizing these patterns is a powerful act of self-care.",
  "Every answer brings you closer to understanding yourself.",
  "You deserve peace, and healing is possible.",
];
