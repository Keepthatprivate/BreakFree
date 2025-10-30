import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import EmpathyMessage from '@/components/EmpathyMessage';
import ContactForm from '@/components/ContactForm';
import DonationPage from '@/components/DonationPage';
import ResultsPage from '@/components/ResultsPage';
import BreakScreenComponent from '@/components/BreakScreen';
import ChapterTransition from '@/components/ChapterTransition';
import TraumaPatterns from '@/components/TraumaPatterns';
import BenefitsPage from '@/components/BenefitsPage';
import TestimonialsPage from '@/components/TestimonialsPage';
import TrialTimeline from '@/components/TrialTimeline';
import FAQPage from '@/components/FAQPage';
import { questions, empathyMessages, chapters, breakScreens } from '@shared/quiz-data';

type QuizState = 'quiz' | 'chapter-transition' | 'empathy' | 'break' | 'contact' | 'donation' | 'results' | 'patterns' | 'benefits' | 'testimonials' | 'timeline' | 'faq';

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
  const [state, setState] = useState<QuizState>('chapter-transition');
  const [empathyMessageIndex, setEmpathyMessageIndex] = useState(0);
  const [currentBreakIndex, setCurrentBreakIndex] = useState(0);
  const [previousChapter, setPreviousChapter] = useState<string>('');

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

  const isChapterTransition = () => {
    // Check if we're moving to a new chapter
    const nextQuestion = questions[currentQuestionIndex];
    if (!nextQuestion) return false;
    
    const isNewChapter = previousChapter && previousChapter !== nextQuestion.chapter;
    return isNewChapter;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Priority order: break screens -> empathy messages -> chapter transitions -> regular advance
      
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
      // 3. Check for chapter transitions
      else {
        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = questions[nextIndex];
        
        if (previousChapter && previousChapter !== nextQuestion.chapter) {
          setCurrentQuestionIndex(nextIndex);
          setState('chapter-transition');
        } else {
          setTimeout(() => {
            setCurrentQuestionIndex(nextIndex);
          }, 300);
        }
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
    // After empathy message, check if we need to show a chapter transition before the next question
    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = questions[nextIndex];
    
    if (nextQuestion && previousChapter && previousChapter !== nextQuestion.chapter) {
      // Moving to a new chapter - show transition first
      setCurrentQuestionIndex(nextIndex);
      setState('chapter-transition');
    } else {
      // Same chapter - continue to next question
      setState('quiz');
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
      }, 300);
    }
  };

  const handleBreakContinue = () => {
    // After a break, check if we need to show a chapter transition before the next question
    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = questions[nextIndex];
    
    if (nextQuestion && previousChapter && previousChapter !== nextQuestion.chapter) {
      // Moving to a new chapter - show transition first
      setCurrentQuestionIndex(nextIndex);
      setState('chapter-transition');
    } else {
      // Same chapter - continue to next question
      setState('quiz');
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
      }, 300);
    }
  };

  const handleChapterTransitionContinue = () => {
    setPreviousChapter(currentQuestion.chapter);
    setState('quiz');
  };

  // Track chapter changes
  useEffect(() => {
    if (currentQuestion && !previousChapter && state === 'chapter-transition') {
      // First chapter - just set it and move to quiz
      setPreviousChapter(currentQuestion.chapter);
    }
  }, [currentQuestion, previousChapter, state]);

  const handleContactSubmit = (data: { name: string; email: string }) => {
    setUserName(data.name);
    setUserEmail(data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    setState('donation');
  };

  const handleDonationContinue = () => {
    setState('results');
  };

  const handleResultsContinue = () => {
    setState('patterns');
  };

  const handlePatternsContinue = () => {
    setState('benefits');
  };

  const handleBenefitsContinue = () => {
    setState('testimonials');
  };

  const handleTestimonialsContinue = () => {
    setState('timeline');
  };

  const handleTimelineContinue = () => {
    setState('faq');
  };

  const handleFAQContinue = () => {
    // Final CTA - could redirect to payment page or show success message
    console.log('Quiz funnel completed!');
  };

  if (state === 'donation') {
    return <DonationPage userName={userName} onContinue={handleDonationContinue} />;
  }

  if (state === 'results') {
    return <ResultsPage userName={userName} onContinue={handleResultsContinue} />;
  }

  if (state === 'patterns') {
    return <TraumaPatterns onContinue={handlePatternsContinue} />;
  }

  if (state === 'benefits') {
    return <BenefitsPage onContinue={handleBenefitsContinue} />;
  }

  if (state === 'testimonials') {
    return <TestimonialsPage onContinue={handleTestimonialsContinue} />;
  }

  if (state === 'timeline') {
    return <TrialTimeline onContinue={handleTimelineContinue} />;
  }

  if (state === 'faq') {
    return <FAQPage onContinue={handleFAQContinue} />;
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

      {state === 'chapter-transition' && currentChapter && (
        <ChapterTransition
          chapter={currentChapter}
          onContinue={handleChapterTransitionContinue}
        />
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
