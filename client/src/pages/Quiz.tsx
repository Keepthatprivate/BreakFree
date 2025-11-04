import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import EmpathyMessage from '@/components/EmpathyMessage';
import ContactForm from '@/components/ContactForm';
import DonationPage from '@/components/DonationPage';
import ResultsPage from '@/components/ResultsPage';
import AnimatedBreakScreen from '@/components/AnimatedBreakScreen';
import BreakScreenComponent from '@/components/BreakScreen';
import TraumaPatterns from '@/components/TraumaPatterns';
import BenefitsPage from '@/components/BenefitsPage';
import SevenDaysPage from '@/components/SevenDaysPage';
import PlanHelpPage from '@/components/PlanHelpPage';
import TrustPage from '@/components/TrustPage';
import TestimonialsPage from '@/components/TestimonialsPage';
import TrialTimeline from '@/components/TrialTimeline';
import FAQPage from '@/components/FAQPage';
import UpsellPage from '@/components/UpsellPage';
import CheckoutPage from '@/components/CheckoutPage';
import { questions, empathyMessages, chapters, breakScreens } from '@shared/quiz-data';

type QuizState = 'quiz' | 'empathy' | 'animation' | 'quote-break' | 'contact' | 'donation' | 'payment' | 'checkout' | 'results' | 'patterns' | 'benefits' | 'seven-days' | 'plan-help' | 'trust' | 'testimonials' | 'timeline' | 'faq' | 'upsell';

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
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [currentQuoteBreakIndex, setCurrentQuoteBreakIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(1499); // Default to guide price (€14.99)
  const [checkoutType, setCheckoutType] = useState<'upsell' | 'donation' | 'trial'>('upsell');
  const [checkoutProductName, setCheckoutProductName] = useState('Mental Well-Being Guides');

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

  const showChapterAnimation = () => {
    // Show animations at the start of new chapters
    // Before q5 (patterns), q9 (healing), q12 (future)
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) return false;
    
    const currentChapterId = questions[currentQuestionIndex]?.chapter;
    const nextChapterId = questions[nextIndex]?.chapter;
    
    return currentChapterId !== nextChapterId;
  };

  const getAnimationIndexForChapter = () => {
    const nextIndex = currentQuestionIndex + 1;
    const nextChapterId = questions[nextIndex]?.chapter;
    
    const animationMap: { [key: string]: number } = {
      'patterns': 0,  // Start of patterns chapter -> animation 1
      'healing': 1,   // Start of healing chapter -> animation 2
      'future': 2,    // Start of future chapter -> animation 3
    };
    return animationMap[nextChapterId] || 0;
  };

  const showQuoteBreak = () => {
    // Show quote breaks after questions 3, 7, 10, 12 (end of each chapter section)
    const quoteTriggers = [3, 7, 10, 12];
    return quoteTriggers.includes(currentQuestionIndex);
  };

  const getQuoteBreakForCurrentQuestion = () => {
    const quoteMap: { [key: number]: number } = {
      3: 0,  // After q4 (end of past) -> break 1
      7: 1,  // After q8 (end of patterns) -> break 2
      10: 2, // After q11 (end of healing) -> break 3
      12: 3, // After q13 (end of future) -> break 4
    };
    return quoteMap[currentQuestionIndex];
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Priority order: quote breaks -> empathy messages -> chapter animations -> regular advance
      
      // 1. Check for quote breaks first (end of chapter sections)
      if (showQuoteBreak()) {
        const quoteIndex = getQuoteBreakForCurrentQuestion();
        setCurrentQuoteBreakIndex(quoteIndex);
        setState('quote-break');
      }
      // 2. Check for empathy messages
      else if (showEmpathyMessage()) {
        setState('empathy');
        setEmpathyMessageIndex(Math.floor(Math.random() * empathyMessages.length));
      }
      // 3. Check for chapter animations (start of new chapters)
      else if (showChapterAnimation()) {
        const animationIndex = getAnimationIndexForChapter();
        setCurrentAnimationIndex(animationIndex);
        setState('animation');
      }
      // 4. Regular advance
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

  const handleAnimationContinue = () => {
    setState('quiz');
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 300);
  };

  const handleQuoteBreakContinue = () => {
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
    // Go to benefits pages first
    setState('benefits');
  };

  const handlePaymentComplete = () => {
    // When user clicks "Get Now" on UpsellPage, go to checkout
    setCheckoutAmount(1499); // €14.99 in cents
    setCheckoutType('upsell');
    setCheckoutProductName('Mental Well-Being Guides');
    setState('checkout');
  };

  const handlePaymentSkip = () => {
    // If user skips upsell guides, go to results
    setState('results');
  };


  const handleDonationContinue = (donationAmount?: number) => {
    // If donation amount is provided, go to checkout
    if (donationAmount && donationAmount > 0) {
      setCheckoutAmount(Math.round(donationAmount * 100)); // Convert to cents
      setCheckoutType('donation');
      setCheckoutProductName(`Contribution - €${donationAmount.toFixed(2)}`);
      setState('checkout');
    } else {
      // Skip donation, go to timeline (membership page)
      setState('timeline');
    }
  };

  const handleCheckoutComplete = () => {
    // After successful checkout, mark as paid and continue to next step
    setHasPaid(true);
    localStorage.setItem('hasPaid', 'true');
    
    // Determine next step based on checkout type (Donation → Membership → Guide → Results)
    if (checkoutType === 'donation') {
      // After donation checkout, go to membership/timeline page
      setState('timeline');
    } else if (checkoutType === 'trial') {
      // After trial/membership checkout, go to guide upsell page
      setState('payment');
    } else if (checkoutType === 'upsell') {
      // After buying guides, go to results
      setState('results');
    }
  };

  const handleStartTrial = () => {
    // User wants to start trial, go to checkout
    setCheckoutAmount(100); // €1.00 trial price in cents
    setCheckoutType('trial');
    setCheckoutProductName('7-Day Trial Subscription');
    setState('checkout');
  };

  const handleBenefitsContinue = () => {
    // After benefits page, show seven days page
    setState('seven-days');
  };

  const handleSevenDaysContinue = () => {
    // After seven days page, show plan help page
    setState('plan-help');
  };

  const handlePlanHelpContinue = () => {
    // After plan help page, show trust page
    setState('trust');
  };

  const handleTrustContinue = () => {
    // After trust page, show donation
    setState('donation');
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

  if (state === 'checkout') {
    return (
      <CheckoutPage
        amount={checkoutAmount}
        productType={checkoutType}
        productName={checkoutProductName}
        email={userEmail}
        name={userName}
        onComplete={handleCheckoutComplete}
      />
    );
  }

  if (state === 'donation') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <DonationPage userName={userName} onContinue={handleDonationContinue} />
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

  if (state === 'seven-days') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <SevenDaysPage onContinue={handleSevenDaysContinue} />
      </>
    );
  }

  if (state === 'plan-help') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <PlanHelpPage onContinue={handlePlanHelpContinue} />
      </>
    );
  }

  if (state === 'trust') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <TrustPage onContinue={handleTrustContinue} />
      </>
    );
  }

  if (state === 'timeline') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <TrialTimeline onStartTrial={handleStartTrial} />
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

      {state === 'animation' && (
        <>
          <ProgressBar
            currentChapter={currentQuestion.chapter}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <AnimatedBreakScreen
            animationIndex={currentAnimationIndex}
            onContinue={handleAnimationContinue}
          />
        </>
      )}

      {state === 'quote-break' && (
        <>
          <ProgressBar
            currentChapter={currentQuestion.chapter}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <BreakScreenComponent
            breakScreen={breakScreens[currentQuoteBreakIndex]}
            onContinue={handleQuoteBreakContinue}
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
