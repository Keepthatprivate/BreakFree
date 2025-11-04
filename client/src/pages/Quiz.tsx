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
import { animations } from '@/lib/animationAssets';
import geometricPattern from '@assets/pexels-golnar-sabzpoush-rashidi-1317651-2530383_1761955317513.jpg';
import footstepsAudio from '@assets/footsteps_short.mp3';
import doorClosingAudio from '@assets/doors_PZuanhr_1761859927075.mp3';

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
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentChapter = chapters.find((c) => c.id === currentQuestion?.chapter);

  // Preload all images and audio assets
  useEffect(() => {
    const gender = (localStorage.getItem('gender') || 'boy') as 'boy' | 'girl';
    const allAssets: string[] = [];

    // Collect all animation images for the selected gender
    animations[gender].forEach((animation) => {
      allAssets.push(...animation.images);
    });

    // Add other static assets
    allAssets.push(geometricPattern);

    // Preload images
    const imagePromises = allAssets.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    });

    // Preload audio files
    const audioPromises = [footstepsAudio, doorClosingAudio].map((src) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => resolve();
        audio.src = src;
      });
    });

    Promise.all([...imagePromises, ...audioPromises]).then(() => {
      setAssetsLoaded(true);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);

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
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 300);
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
    // After animation, show the quote break
    setState('quote-break');
  };

  const handleQuoteBreakContinue = () => {
    // After quote break, advance to next question or contact form
    if (currentQuestionIndex < questions.length - 1) {
      setState('quiz');
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 300);
    } else {
      // After last question's animation + quote, go to contact
      setState('contact');
    }
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
    </div>
  );
}
