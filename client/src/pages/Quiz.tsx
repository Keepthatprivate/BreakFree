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
import SevenDaysPage from '@/components/SevenDaysPage';
import PlanHelpPage from '@/components/PlanHelpPage';
import TrustPage from '@/components/TrustPage';
import TestimonialsPage from '@/components/TestimonialsPage';
import TrialTimeline from '@/components/TrialTimeline';
import FAQPage from '@/components/FAQPage';
import UpsellPage from '@/components/UpsellPage';
import CheckoutPage from '@/components/CheckoutPage';
import { questions, empathyMessages, chapters, breakScreens } from '@shared/quiz-data';

type QuizState = 'quiz' | 'empathy' | 'break' | 'contact' | 'donation' | 'payment' | 'checkout' | 'results' | 'patterns' | 'benefits' | 'seven-days' | 'plan-help' | 'trust' | 'testimonials' | 'timeline' | 'faq' | 'upsell';

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
    // When user clicks "Get Now" on UpsellPage, go to checkout
    setCheckoutAmount(1499); // €14.99 in cents
    setCheckoutType('upsell');
    setCheckoutProductName('Mental Well-Being Guides');
    setState('checkout');
  };

  const handlePaymentSkip = () => {
    // If user skips payment, go to donation page
    setState('donation');
  };

  const handleDonationContinue = (donationAmount?: number) => {
    // If donation amount is provided, go to checkout
    if (donationAmount && donationAmount > 0) {
      setCheckoutAmount(Math.round(donationAmount * 100)); // Convert to cents
      setCheckoutType('donation');
      setCheckoutProductName(`Contribution - €${donationAmount.toFixed(2)}`);
      setState('checkout');
    } else {
      // Skip donation, go to benefits pages
      setState('benefits');
    }
  };

  const handleCheckoutComplete = () => {
    // After successful checkout, mark as paid and continue to next step
    setHasPaid(true);
    localStorage.setItem('hasPaid', 'true');
    
    // Determine next step based on checkout type
    if (checkoutType === 'upsell') {
      // After buying guides, can still contribute
      setState('donation');
    } else if (checkoutType === 'donation') {
      // After donation, show benefits pages
      setState('benefits');
    } else if (checkoutType === 'trial') {
      // After trial payment, show results
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
    // After trust page, show timeline
    setState('timeline');
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
