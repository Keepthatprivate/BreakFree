import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQPageProps {
  onContinue: () => void;
}

export default function FAQPage({ onContinue }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We support all the essential online payment options — Credit Cards, Apple Pay, Google Pay, and PayPal.'
    },
    {
      question: 'What to expect when finishing the training?',
      answer: 'Upon completing the training, you will have gained comprehensive tools and strategies to manage childhood trauma. You can expect improved emotional regulation, better relationship skills, and enhanced self-awareness. Many users report feeling more empowered and in control of their healing journey.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Absolutely. We take your privacy seriously and use industry-standard encryption to protect your data. Your personal information is never shared with third parties without your explicit consent. All quiz responses and personal details are stored securely and handled in compliance with GDPR regulations.'
    },
    {
      question: 'Can this quiz replace professional evaluation?',
      answer: 'While our quiz provides valuable insights into childhood trauma patterns, it is not a substitute for professional medical or psychological evaluation. We recommend using our results as a starting point for self-discovery and consider consulting with a licensed mental health professional for comprehensive assessment and treatment.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            Common questions
          </h1>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-card/50 rounded-2xl border border-card-border/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`faq-item-${index}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover-elevate transition-all"
                  data-testid={`faq-button-${index}`}
                >
                  <span className="text-foreground font-semibold text-base sm:text-lg pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div
                    className="px-5 sm:px-6 pb-5 sm:pb-6 animate-in fade-in slide-in-from-top-2 duration-200"
                    data-testid={`faq-answer-${index}`}
                  >
                    <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mb-8">
          <p className="text-xs text-muted-foreground mb-2">2025 © All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-foreground transition-colors">Subscription Terms</a>
            <span>|</span>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Basenji Apps Limited
          </p>
          <p className="text-xs text-muted-foreground">
            Florinis 7, Greg Tower, 2nd Floor, 1065, Nicosia, Cyprus
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-faq"
          >
            Get my result and plan
          </button>
        </div>
      </div>
    </div>
  );
}
