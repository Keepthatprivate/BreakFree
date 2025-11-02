/**
 * Inner Child Emotion Engine
 * Maps quiz answers to emotional states that affect the visual storytelling
 */

export type ChildEmotion = 'neutral' | 'sad' | 'hopeful';

interface EmotionMapping {
  [questionId: string]: {
    [answerValue: string]: ChildEmotion;
  };
}

// Map specific answer values to emotions
const emotionMappings: EmotionMapping = {
  // Chapter 1: Your Past
  q2: {
    // "Did you feel truly heard by your parents?"
    always: 'hopeful',
    sometimes: 'neutral',
    never: 'sad',
  },
  q3: {
    // Childhood feelings
    peaceful: 'hopeful',
    anxious: 'sad',
    sad: 'sad',
    confused: 'neutral',
  },
  q4: {
    // Footsteps audio test
    curiosity: 'hopeful',
    anxiety: 'sad',
    safety: 'hopeful',
    fear: 'sad',
  },

  // Chapter 2: Your Patterns
  q5: {
    // "I hide my pain behind humor"
    strongly: 'sad',
    somewhat: 'neutral',
    'not-at-all': 'hopeful',
  },
  q6: {
    // Relationship patterns
    avoid: 'sad',
    'seek-validation': 'neutral',
    'trust-easily': 'hopeful',
  },
  q7: {
    // Slider - "not enough" feeling (0-100)
    // This will be handled separately in the function
  },
  q8: {
    // Door closing audio test
    safety: 'hopeful',
    isolation: 'sad',
    finality: 'sad',
    neutral: 'neutral',
  },

  // Chapter 3: Your Healing
  q9: {
    // Peace sanctuary (all are positive)
    nature: 'hopeful',
    cozy: 'hopeful',
    beach: 'hopeful',
    mountains: 'hopeful',
  },
  q10: {
    // Visual pattern test
    parallel: 'hopeful',
    barriers: 'sad',
    paths: 'hopeful',
    chaos: 'sad',
  },
  q11: {
    // Time for self-care (0-60 minutes)
    // Handled separately
  },

  // Chapter 4: Your Future
  q12: {
    // Tree visualization
    'full-bloom': 'hopeful',
    growing: 'hopeful',
    weathered: 'neutral',
  },
  q13: {
    // Healing readiness
    'very-ready': 'hopeful',
    somewhat: 'neutral',
    exploring: 'neutral',
  },
};

/**
 * Get the child's emotional response based on the user's answer
 * @param questionId - The ID of the question (e.g., 'q1', 'q2')
 * @param answer - The user's answer value or array of values
 * @returns The emotional state: 'neutral', 'sad', or 'hopeful'
 */
export function getChildEmotion(
  questionId: string,
  answer: string | string[]
): ChildEmotion {
  // Handle array answers (take first value)
  const answerValue = Array.isArray(answer) ? answer[0] : answer;

  // Handle slider questions with numeric values
  if (questionId === 'q7') {
    // "How often do you feel 'not enough'" (0-100)
    const value = parseInt(answerValue, 10);
    if (value < 30) return 'hopeful';
    if (value < 70) return 'neutral';
    return 'sad';
  }

  if (questionId === 'q11') {
    // "How much daily time can you give yourself" (0-60 minutes)
    const value = parseInt(answerValue, 10);
    if (value >= 30) return 'hopeful';
    if (value >= 15) return 'neutral';
    return 'sad';
  }

  // Look up the emotion mapping
  const questionMapping = emotionMappings[questionId];
  if (questionMapping && questionMapping[answerValue]) {
    return questionMapping[answerValue];
  }

  // Default to neutral for unmapped questions
  return 'neutral';
}

/**
 * Get the aggregate emotion across multiple answers
 * Useful for determining overall emotional state
 */
export function getAggregateEmotion(
  answers: { [questionId: string]: string[] }
): ChildEmotion {
  const emotions: ChildEmotion[] = [];

  Object.entries(answers).forEach(([questionId, answer]) => {
    emotions.push(getChildEmotion(questionId, answer));
  });

  // Count occurrences
  const hopefulCount = emotions.filter((e) => e === 'hopeful').length;
  const sadCount = emotions.filter((e) => e === 'sad').length;
  const neutralCount = emotions.filter((e) => e === 'neutral').length;

  // Return the most common emotion
  if (hopefulCount >= sadCount && hopefulCount >= neutralCount) {
    return 'hopeful';
  }
  if (sadCount > neutralCount) {
    return 'sad';
  }
  return 'neutral';
}
