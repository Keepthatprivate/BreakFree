interface QuizAnswers {
  [questionId: string]: string[];
}

interface AnalysisResult {
  traumaScore: number;
  primaryPattern: string;
  recommendations: string[];
  patterns: {
    abandonment: number;
    control: number;
    emotional: number;
    trust: number;
  };
}

export function analyzeQuizAnswers(answers: QuizAnswers): AnalysisResult {
  const patterns = {
    abandonment: 0,
    control: 0,
    emotional: 0,
    trust: 0,
  };

  // Weight different question types
  Object.entries(answers).forEach(([questionId, values]) => {
    // Iterate through all selected values (handles multi-select questions)
    values.forEach(answer => {
      // Analyze childhood experiences (q2-q5)
      if (questionId === 'q2') {
        if (answer === 'yes') patterns.emotional += 20;
        if (answer === 'sometimes') patterns.emotional += 10;
      }

      if (questionId === 'q3') {
        const score = parseInt(answer) || 50;
        if (score > 70) patterns.abandonment += 25;
        else if (score > 40) patterns.abandonment += 15;
      }

      if (questionId === 'q4') {
        if (answer === 'running-away') patterns.abandonment += 20;
        if (answer === 'crying-alone') patterns.emotional += 20;
        if (answer === 'hiding') patterns.trust += 15;
      }

      // Analyze current patterns (q6-q9) - q6 is multi-select
      if (questionId === 'q6') {
        if (answer?.includes('overwhelmed')) patterns.emotional += 15;
        if (answer?.includes('stuck')) patterns.control += 15;
        if (answer?.includes('disconnected')) patterns.abandonment += 15;
        if (answer?.includes('numb')) patterns.trust += 12;
      }

      if (questionId === 'q7') {
        const score = parseInt(answer) || 50;
        if (score > 70) patterns.control += 20;
        else if (score > 40) patterns.control += 10;
      }

      if (questionId === 'q8') {
        if (answer === 'scared') patterns.trust += 20;
        if (answer === 'relieved') patterns.abandonment += 15;
        if (answer === 'anxious') patterns.emotional += 20;
      }

      if (questionId === 'q9') {
        if (answer === 'waves') patterns.emotional += 15;
        if (answer === 'chaos') patterns.control += 15;
        if (answer === 'tree') patterns.trust += 10;
      }

      // Healing readiness (q11-q13)
      if (questionId === 'q11') {
        if (answer === 'very-much') patterns.emotional += 10;
        if (answer === 'somewhat') patterns.emotional += 5;
      }

      if (questionId === 'q13') {
        if (answer === 'ready-now') {
          patterns.emotional += 10;
          patterns.control += 10;
        }
      }
    });
  });

  // Calculate total trauma awareness score
  const totalScore = Object.values(patterns).reduce((sum, val) => sum + val, 0);
  const traumaScore = Math.min(100, totalScore);

  // Determine primary pattern
  const primaryPattern = Object.entries(patterns).reduce((a, b) => 
    patterns[a[0] as keyof typeof patterns] > patterns[b[0] as keyof typeof patterns] ? a : b
  )[0];

  const patternNames = {
    abandonment: 'Fear of Abandonment',
    control: 'Need for Control',
    emotional: 'Emotional Regulation Challenges',
    trust: 'Trust and Safety Concerns',
  };

  const patternRecommendations = {
    abandonment: [
      'Practice self-soothing techniques when feeling alone or rejected',
      'Build a support network of trusted friends and family',
      'Work with a therapist on attachment patterns',
      'Journal about your fear of being left behind and where it originated',
    ],
    control: [
      'Practice letting go of small outcomes each day',
      'Try mindfulness meditation to sit with uncertainty',
      'Identify what you can and cannot control in situations',
      'Explore underlying fears driving your need for control',
    ],
    emotional: [
      'Learn to name and identify your emotions throughout the day',
      'Practice the 5-4-3-2-1 grounding technique during overwhelm',
      'Create a "feelings wheel" to expand your emotional vocabulary',
      'Develop healthy emotional release practices (movement, art, writing)',
    ],
    trust: [
      'Start with small acts of trust and gradually build up',
      'Explore where your trust was broken in the past',
      'Practice discernment - not everyone deserves your trust',
      'Work on building trust with yourself first',
    ],
  };

  return {
    traumaScore,
    primaryPattern: patternNames[primaryPattern as keyof typeof patternNames],
    recommendations: patternRecommendations[primaryPattern as keyof typeof patternRecommendations],
    patterns,
  };
}
