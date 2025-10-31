import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import EmpathyMessage from '@/components/EmpathyMessage';
import ContactForm from '@/components/ContactForm';
import DonationPage from '@/components/DonationPage';
import ResultsPage from '@/components/ResultsPage';
import BreakScreenComponent from '@/components/BreakScreen';
import TraumaPatterns from '@/components/TraumaPatterns';
import BenefitsPage from '@/components/BenefitsPage';
import TestimonialsPage from '@/components/TestimonialsPage';
import TrialTimeline from '@/components/TrialTimeline';
import FAQPage from '@/components/FAQPage';
import UpsellPage from '@/components/UpsellPage';
import { questions, empathyMessages, chapters, breakScreens } from '@shared/quiz-data';

type QuizState = 'quiz' | 'empathy' | 'break' | 'contact' | 'donation' | 'payment' | 'results' | 'patterns' | 'benefits' | 'testimonials' | 'timeline' | 'faq' | 'upsell';

interface QuizAnswers {
  [questionId: string]: string[];
}

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const saved = localStorage.getItem('quizAnswers');
    return saved ? JSON.parse(saved) : {};
  });
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [state, setState] = useState<QuizState>('quiz');
  const [empathyMessageIndex, setEmpathyMessageIndex] = useState(0);
  const [currentBreakIndex, setCurrentBreakIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentChapter = chapters.find((c) => c.id === currentQuestion?.chapter);

  useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (answer: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const showEmpathyMessage = () => {
    const empathyTriggers = [2, 6, 9];
    return empathyTriggers.includes(currentQuestionIndex);
  };

  const showBreakScreen = () => {
    // Show break screens after questions 3, 7, 10, 12
    const breakTriggers = [3, 7, 10, 12];
    return breakTriggers.includes(currentQuestionIndex);
  };

  const getBreakScreenForCurrentQuestion = () => {
    const breakMap: { [key: number]: number } = {
      3: 0,  // After q4 (past chapter) -> data-break
      7: 1,  // After q8 (patterns chapter) -> quote-break
      10: 2, // After q11 (healing chapter) -> testimonial-break
      12: 3, // After q13 (future chapter) -> visual-pause
    };
    return breakMap[currentQuestionIndex];
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Priority order: break screens -> empathy messages -> regular advance
      
      // 1. Check for break screens first (highest priority)
      if (showBreakScreen()) {
        const breakIndex = getBreakScreenForCurrentQuestion();
        setCurrentBreakIndex(breakIndex);
        setState('break');
      }
      // 2. Check for empathy messages
      else if (showEmpathyMessage()) {
        setState('empathy');
        setEmpathyMessageIndex(Math.floor(Math.random() * empathyMessages.length));
      }
      // 3. Regular advance
      else {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 300);
      }
    } else {
      setState('contact');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
      }, 300);
    }
  };

  const handleEmpathyContinue = () => {
    setState('quiz');
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 300);
  };

  const handleBreakContinue = () => {
    setState('quiz');
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 300);
  };

  const handleContactSubmit = (data: { name: string; email: string }) => {
    setUserName(data.name);
    setUserEmail(data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    // Go directly to payment/checkout before showing results
    setState('payment');
  };

  const handlePaymentComplete = () => {
    setHasPaid(true);
    localStorage.setItem('hasPaid', 'true');
    // After payment, show contribution page
    setState('donation');
  };

  const handlePaymentSkip = () => {
    // If user skips payment, redirect to signup
    setLocation('/signup');
  };

  const handleDonationContinue = () => {
    // After contribution, show trial timeline
    setState('timeline');
  };

  const handleTimelineContinue = () => {
    // After timeline, show guides/benefits
    setState('benefits');
  };

  const handleBenefitsContinue = () => {
    // After benefits, show actual results
    setState('results');
  };

  const handleResultsContinue = () => {
    setState('patterns');
  };

  const handlePatternsContinue = () => {
    setState('testimonials');
  };

  const handleTestimonialsContinue = () => {
    setState('faq');
  };

  const handleFAQContinue = () => {
    // Redirect to signup after FAQ
    setLocation('/signup');
  };

  if (state === 'payment') {
    return <UpsellPage onAccept={handlePaymentComplete} onSkip={handlePaymentSkip} />;
  }

  if (state === 'donation') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <DonationPage userName={userName} onContinue={handleDonationContinue} />
      </>
    );
  }

  if (state === 'timeline') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <TrialTimeline onContinue={handleTimelineContinue} />
      </>
    );
  }

  if (state === 'benefits') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <BenefitsPage onContinue={handleBenefitsContinue} />
      </>
    );
  }

  if (state === 'results') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <ResultsPage userName={userName} onContinue={handleResultsContinue} answers={answers} />
      </>
    );
  }

  if (state === 'patterns') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <TraumaPatterns onContinue={handlePatternsContinue} />
      </>
    );
  }

  if (state === 'testimonials') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <TestimonialsPage onContinue={handleTestimonialsContinue} />
      </>
    );
  }

  if (state === 'faq') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <FAQPage onContinue={handleFAQContinue} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {state === 'quiz' && (
        <>
          <ProgressBar
            currentChapter={currentQuestion.chapter}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <QuestionCard
            question={currentQuestion}
            chapterTitle={currentChapter?.title || ''}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            onNext={handleNext}
            savedAnswer={answers[currentQuestion.id] || []}
            canGoBack={currentQuestionIndex > 0}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </>
      )}

      {state === 'empathy' && (
        <>
          <ProgressBar
            currentChapter={currentQuestion.chapter}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <EmpathyMessage
            message={empathyMessages[empathyMessageIndex]}
            onContinue={handleEmpathyContinue}
          />
        </>
      )}

      {state === 'break' && (
        <>
          <ProgressBar
            currentChapter={currentQuestion.chapter}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <BreakScreenComponent
            breakScreen={breakScreens[currentBreakIndex]}
            onContinue={handleBreakContinue}
          />
        </>
      )}

      {state === 'contact' && (
        <>
          <ProgressBar
            currentChapter="future"
            currentQuestionIndex={questions.length - 1}
            totalQuestions={questions.length}
          />
          <ContactForm onSubmit={handleContactSubmit} />
        </>
      )}
    </div>
  );
}
