import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackViewContent } from '@/lib/facebook-tracking';

interface FAQPageProps {
  onContinue: () => void;
}

export default function FAQPage({ onContinue }: FAQPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 13 - FAQ' });
  }, []);

  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'Credit Cards, Apple Pay, Google Pay, and PayPal.'
    },
    {
      question: 'What can I expect after completing the program?',
      answer: 'Better emotional regulation, improved relationships, and greater self-awareness. Most users feel more in control of their healing journey.'
    },
    {
      question: 'Is my information safe?',
      answer: 'Yes. We use industry-standard encryption and never share your data. All information is stored securely and GDPR compliant.'
    },
    {
      question: 'Does this replace professional therapy?',
      answer: 'This is a self-discovery tool, not a replacement for professional evaluation. Consider consulting a licensed professional for comprehensive treatment.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Common questions
          </h1>
          <p className="text-muted-foreground text-base">
            Quick answers to help you decide
          </p>
        </div>

        <div className="space-y-2 mb-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl border border-card-border/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`faq-item-${index}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover-elevate transition-all"
                  data-testid={`faq-button-${index}`}
                >
                  <span className="text-foreground font-medium text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {isOpen && (
                  <div
                    className="px-4 sm:px-5 pb-4 sm:pb-5 animate-in fade-in slide-in-from-top-2 duration-200"
                    data-testid={`faq-answer-${index}`}
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mb-8">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-faq"
          >
            Continue
          </button>
        </div>

        <div className="text-center pt-4 border-t border-card-border/20">
          <p className="text-xs text-muted-foreground mb-2">2025 © All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <span className="text-muted-foreground/50">·</span>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <span className="text-muted-foreground/50">·</span>
            <a href="#" className="hover:text-foreground transition-colors">Subscriptions</a>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Basenji Apps Limited · Nicosia, Cyprus
          </p>
        </div>
      </div>
    </div>
  );
}
