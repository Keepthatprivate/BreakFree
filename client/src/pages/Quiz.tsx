import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import EmpathyMessage from '@/components/EmpathyMessage';
import ContactForm from '@/components/ContactForm';
import LoadingPage from '@/components/LoadingPage';
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
import MasterclassBundlePage from '@/components/MasterclassBundlePage';
import HealingJournalPage from '@/components/HealingJournalPage';
import EmbeddedCheckoutPage from '@/components/EmbeddedCheckoutPage';
import { questions, empathyMessages, chapters, breakScreens } from '@shared/quiz-data';
import { animations } from '@/lib/animationAssets';
import { trackViewContent, trackLead, getFacebookCookies } from '@/lib/facebook-tracking';
import { preloadQuizAssets, preloadAnimationChapter, startBackgroundPreload } from '@/lib/progressivePreloader';
import { type EmbeddedCheckoutProductType } from '@/components/EmbeddedCheckoutPage';
import { apiRequest } from "@/lib/queryClient";
import geometricPattern from '@assets/pexels-golnar-sabzpoush-rashidi-1317651-2530383_1761955317513.jpg';
import footstepsAudio from '@assets/footsteps_short.mp3';
import doorClosingAudio from '@assets/doors_PZuanhr_1761859927075.mp3';

type QuizState = 'quiz' | 'empathy' | 'animation' | 'quote-break' | 'contact' | 'loading' | 'donation' | 'payment' | 'payment-method-selection' | 'checkout' | 'subscription-checkout' | 'results' | 'patterns' | 'benefits' | 'seven-days' | 'plan-help' | 'trust' | 'testimonials' | 'timeline' | 'faq' | 'upsell' | 'masterclass' | 'journal';

interface QuizAnswers {
  [questionId: string]: string[];
}

// Dev mode: Allow direct navigation via URL params like /quiz?state=donation
const getInitialState = (): QuizState => {
  const urlParams = new URLSearchParams(window.location.search);
  const stateParam = urlParams.get('state');
  const validStates: QuizState[] = ['quiz', 'empathy', 'animation', 'quote-break', 'contact', 'loading', 'donation', 'payment', 'payment-method-selection', 'checkout', 'subscription-checkout', 'results', 'patterns', 'benefits', 'seven-days', 'plan-help', 'trust', 'testimonials', 'timeline', 'faq', 'upsell', 'masterclass', 'journal'];
  console.log('[Quiz] URL state param:', stateParam, '| Valid:', validStates.includes(stateParam as QuizState));
  if (stateParam && validStates.includes(stateParam as QuizState)) {
    console.log('[Quiz] Setting initial state to:', stateParam);
    return stateParam as QuizState;
  }
  console.log('[Quiz] Defaulting to quiz state');
  return 'quiz';
};

const getInitialQuestionIndex = (): number => {
  const urlParams = new URLSearchParams(window.location.search);
  const questionParam = urlParams.get('question');
  if (questionParam) {
    const index = parseInt(questionParam, 10);
    if (!isNaN(index) && index >= 0 && index < 13) {
      return index;
    }
  }
  return 0;
};

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getInitialQuestionIndex);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const saved = localStorage.getItem('quizAnswers');
    return saved ? JSON.parse(saved) : {};
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Test User');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || 'test@example.com');
  const [state, setState] = useState<QuizState>(getInitialState);
  const [empathyMessageIndex, setEmpathyMessageIndex] = useState(0);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [currentQuoteBreakIndex, setCurrentQuoteBreakIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(() => {
    // Check if user has paid from localStorage or session_id in URL (Stripe checkout return)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const storedHasPaid = localStorage.getItem('hasPaid') === 'true';
    if (sessionId || storedHasPaid) {
      localStorage.setItem('hasPaid', 'true');
      return true;
    }
    return false;
  });
  const [checkoutAmount, setCheckoutAmount] = useState(1499); // Default to guide price (€14.99)
  const [checkoutType, setCheckoutType] = useState<'upsell' | 'donation' | 'trial' | 'masterclass' | 'journal'>('upsell');
  const [checkoutProductName, setCheckoutProductName] = useState('Mental Well-Being Guides');
  const [assetsLoaded] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const currentChapter = chapters.find((c) => c.id === currentQuestion?.chapter);

  // Progressive asset loading - start preloading in background without blocking render
  useEffect(() => {
    const gender = (localStorage.getItem('gender') || 'boy') as 'boy' | 'girl';
    preloadQuizAssets(
      gender,
      animations,
      0,
      geometricPattern,
      [footstepsAudio, doorClosingAudio]
    );
  }, []);

  // Preload upcoming animation assets when user progresses through quiz
  useEffect(() => {
    const gender = (localStorage.getItem('gender') || 'boy') as 'boy' | 'girl';
    const genderAnimations = animations[gender];
    const upcomingChapterIndex = getChapterTransitionIndex();
    
    if (upcomingChapterIndex >= 0 && upcomingChapterIndex < genderAnimations.length) {
      preloadAnimationChapter(genderAnimations[upcomingChapterIndex].images, 'critical');
    }
    if (upcomingChapterIndex + 1 < genderAnimations.length) {
      preloadAnimationChapter(genderAnimations[upcomingChapterIndex + 1].images, 'high');
    }
    
    startBackgroundPreload(
      genderAnimations.map((a) => a.images),
      upcomingChapterIndex
    );
  }, [currentQuestionIndex]);

  // Debounced localStorage write using requestIdleCallback (INP optimization)
  const saveTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    // Cancel any pending save
    if (saveTimeoutRef.current) {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(saveTimeoutRef.current);
      } else {
        clearTimeout(saveTimeoutRef.current);
      }
    }

    // Defer localStorage write to idle time
    const saveAnswers = () => {
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
    };

    if ('requestIdleCallback' in window) {
      saveTimeoutRef.current = requestIdleCallback(saveAnswers, { timeout: 1000 });
    } else {
      saveTimeoutRef.current = window.setTimeout(saveAnswers, 100) as unknown as number;
    }

    return () => {
      if (saveTimeoutRef.current) {
        if ('cancelIdleCallback' in window) {
          cancelIdleCallback(saveTimeoutRef.current);
        } else {
          clearTimeout(saveTimeoutRef.current);
        }
      }
    };
  }, [answers]);

  // Track quiz page view on mount with funnel step identification
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 01 - Quiz Start' });
  }, []);

  // Clean up session_id from URL after Stripe checkout return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session_id')) {
      urlParams.delete('session_id');
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Scroll to top whenever state or question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [state, currentQuestionIndex]);

  // Auto-advance if we're in quote-break state but break screen doesn't exist
  useEffect(() => {
    if (state === 'quote-break' && !breakScreens[currentQuoteBreakIndex]) {
      handleQuoteBreakContinue();
    }
  }, [state, currentQuoteBreakIndex]);

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

  const showChapterTransition = () => {
    // Show chapter transitions (animation + quote) after questions at indices 2, 6, 9
    // (which are q4, q8, q11 - the last question of each chapter)
    const transitionTriggers = [2, 6, 9];
    return transitionTriggers.includes(currentQuestionIndex);
  };

  const getChapterTransitionIndex = () => {
    const transitionMap: { [key: number]: number } = {
      2: 0,  // After q4 (index 2) -> Animation 0 + Quote 0 -> q5 (patterns)
      6: 1,  // After q8 (index 6) -> Animation 1 + Quote 1 -> q9 (healing)
      9: 2,  // After q11 (index 9) -> Animation 2 + Quote 2 -> q12 (future)
      11: 3, // After q13 (index 11, last question) -> Quote 3 -> Contact
    };
    return transitionMap[currentQuestionIndex] || 0;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Priority order: chapter transitions -> empathy messages -> regular advance
      
      // 1. Check for chapter transitions (animation + quote at start of new chapter)
      if (showChapterTransition()) {
        const transitionIndex = getChapterTransitionIndex();
        setCurrentAnimationIndex(transitionIndex);
        setCurrentQuoteBreakIndex(transitionIndex);
        setState('animation');
      }
      // 2. Check for empathy messages
      else if (showEmpathyMessage()) {
        setState('empathy');
        setEmpathyMessageIndex(Math.floor(Math.random() * empathyMessages.length));
      }
      // 3. Regular advance
      else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } else {
      // After last question, show animation 4 + final quote break before contact
      const transitionIndex = getChapterTransitionIndex();
      setCurrentAnimationIndex(transitionIndex);
      setCurrentQuoteBreakIndex(transitionIndex);
      setState('animation');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleEmpathyContinue = () => {
    setState('quiz');
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleAnimationContinue = () => {
    // After animation, show the quote break
    setState('quote-break');
  };

  const handleQuoteBreakContinue = () => {
    // After quote break, advance to next question or contact form
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setState('quiz');
    } else {
      // After last question's animation + quote, go to seven-days before contact
      setState('seven-days');
    }
  };

  const handleContactSubmit = (data: { name: string; email: string }) => {
    setUserName(data.name);
    setUserEmail(data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    
    // Track lead event (email submission)
    trackLead({
      email: data.email,
      firstName: data.name,
    });
    
    // Go to loading page after contact form
    setState('loading');
  };

  const handleLoadingComplete = () => {
    // After loading completes, go to trust page first
    setState('trust');
  };

  // Helper function to go directly to embedded checkout
  const goToCheckout = () => {
    setState('checkout');
  };

  const handlePaymentComplete = () => {
    // When user clicks "Get Now" on UpsellPage, go to checkout
    setCheckoutAmount(1499); // €14.99 in cents
    setCheckoutType('upsell');
    setCheckoutProductName('Mental Well-Being Guides');
    goToCheckout();
  };

  const handlePaymentSkip = () => {
    // If user skips upsell guides, go to masterclass upsell
    setState('masterclass');
  };

  const handleMasterclassAccept = () => {
    // When user clicks "Get Masterclass Bundle", go to checkout
    setCheckoutAmount(6900); // $69 in cents
    setCheckoutType('masterclass');
    setCheckoutProductName('Trauma Healing Masterclass Bundle');
    goToCheckout();
  };

  const handleMasterclassDecline = () => {
    // If user declines masterclass, show downsell (journal)
    setState('journal');
  };

  const handleJournalAccept = () => {
    // When user clicks "Get Healing Journal", go to checkout
    setCheckoutAmount(1499); // $14.99 in cents
    setCheckoutType('journal');
    setCheckoutProductName('Inner Child Healing Journal');
    goToCheckout();
  };

  const handleJournalSkip = () => {
    // If user skips journal, go to FAQ
    setState('faq');
  };

  const handleDonationContinue = (donationAmount?: number) => {
    // After donation (or skip), go to results page
    setState('results');
  };

  const handleCheckoutBack = () => {
    // Go back based on checkout type
    if (checkoutType === 'upsell') {
      setState('payment');
    } else if (checkoutType === 'masterclass') {
      setState('masterclass');
    } else if (checkoutType === 'journal') {
      setState('journal');
    } else if (checkoutType === 'trial') {
      setState('faq');
    } else {
      setState('donation');
    }
  };

  const handleStartTrial = () => {
    // User wants to start trial, go to subscription checkout
    setCheckoutAmount(100); // $1 in cents
    setCheckoutType('trial');
    setCheckoutProductName('7-Day BreakFree Trial');
    setState('subscription-checkout');
  };

  const handleBenefitsContinue = () => {
    // After benefits page, show donation first
    setState('donation');
  };

  const handleSevenDaysContinue = () => {
    // After seven days page, go to contact (email capture)
    setState('contact');
  };

  const handlePlanHelpContinue = () => {
    // After plan help page, go to upsell guides
    setState('upsell');
  };

  const handleTrustContinue = () => {
    // After trust page, show benefits
    setState('benefits');
  };

  const handleResultsContinue = () => {
    // After results, go to trial timeline
    setState('timeline');
  };

  const handlePatternsContinue = () => {
    setState('testimonials');
  };

  const handleTestimonialsContinue = () => {
    // After testimonials, go to plan help
    setState('plan-help');
  };

  const handleFAQContinue = () => {
    // Redirect to signup after FAQ
    setLocation('/signup');
  };

  if (state === 'payment' || state === 'upsell') {
    return <UpsellPage onAccept={handlePaymentComplete} onSkip={handlePaymentSkip} />;
  }

  if (state === 'masterclass') {
    return <MasterclassBundlePage onAccept={handleMasterclassAccept} onDecline={handleMasterclassDecline} />;
  }

  if (state === 'journal') {
    return <HealingJournalPage onAccept={handleJournalAccept} onSkip={handleJournalSkip} />;
  }

  if (state === 'checkout') {
    // Map checkoutType to EmbeddedCheckoutProductType
    const getProductType = (): EmbeddedCheckoutProductType => {
      if (checkoutType === 'masterclass') return 'masterclass';
      if (checkoutType === 'journal') return 'journal';
      if (checkoutType === 'donation') return 'donation';
      return 'upsell';
    };

    // Determine the return URL based on checkout type
    const getReturnUrl = () => {
      const baseUrl = window.location.origin;
      if (checkoutType === 'donation') {
        return `${baseUrl}/quiz?state=plan-help&payment_success=true`;
      } else if (checkoutType === 'upsell') {
        return `${baseUrl}/quiz?state=masterclass&payment_success=true`;
      } else if (checkoutType === 'masterclass') {
        return `${baseUrl}/quiz?state=journal&payment_success=true`;
      } else if (checkoutType === 'journal') {
        return `${baseUrl}/quiz?state=faq&payment_success=true`;
      }
      return `${baseUrl}/quiz?state=faq&payment_success=true`;
    };

    return (
      <EmbeddedCheckoutPage
        amount={checkoutAmount / 100}
        productType={getProductType()}
        productName={checkoutProductName}
        email={userEmail}
        name={userName}
        onBack={handleCheckoutBack}
        returnUrl={getReturnUrl()}
      />
    );
  }

  if (state === 'subscription-checkout') {
    return (
      <EmbeddedCheckoutPage
        amount={1}
        productType="subscription"
        productName="7-Day BreakFree Trial"
        email={userEmail}
        name={userName}
        onBack={() => setState('timeline')}
        returnUrl={`${window.location.origin}/quiz?state=testimonials&payment_success=true`}
      />
    );
  }

  if (state === 'donation') {
    return (
      <>
        <ProgressBar currentChapter="future" currentQuestionIndex={questions.length - 1} totalQuestions={questions.length} />
        <DonationPage userName={userName} email={userEmail} onContinue={handleDonationContinue} />
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

  // Show loading screen while assets are being preloaded
  if (!assetsLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold text-foreground mb-4">
            Preparing your experience...
          </div>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
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

      {state === 'quote-break' && breakScreens[currentQuoteBreakIndex] && (
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

      {state === 'loading' && (
        <LoadingPage onComplete={handleLoadingComplete} />
      )}
    </div>
  );
}
