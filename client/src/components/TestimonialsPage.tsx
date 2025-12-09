import { Star } from 'lucide-react';
import { useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { trackViewContent } from '@/lib/facebook-tracking';
import jamesImage from '@assets/454999ec56229c3ff192fccf33fccb62_1761862009838.jpg';
import sarahImage from '@assets/stock_images/professional_woman_s_42c21774.jpg';
import michaelImage from '@assets/stock_images/professional_man_smi_9cfe1802.jpg';
import emilyImage from '@assets/stock_images/professional_woman_s_d4fbbe22.jpg';
import davidImage from '@assets/stock_images/professional_man_smi_e2a3db08.jpg';
import rachelImage from '@assets/stock_images/professional_woman_s_535cd02e.jpg';
import johnImage from '@assets/stock_images/professional_man_smi_25966cd2.jpg';

interface TestimonialsPageProps {
  onContinue: () => void;
}

interface Testimonial {
  name: string;
  rating: number;
  text: string;
  image: string;
}

export default function TestimonialsPage({ onContinue }: TestimonialsPageProps) {
  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 11 - Testimonials' });
  }, []);

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah M.',
      rating: 4.8,
      text: 'This program helped me understand patterns I\'ve carried since childhood. I finally feel free.',
      image: sarahImage
    },
    {
      name: 'Michael T.',
      rating: 4.9,
      text: 'The 28-day plan gave me tools I never knew I needed. My relationships have never been better.',
      image: michaelImage
    },
    {
      name: 'Emily R.',
      rating: 4.7,
      text: 'I was skeptical at first, but the insights I gained were life-changing. Highly recommend.',
      image: emilyImage
    },
    {
      name: 'David L.',
      rating: 4.9,
      text: 'Finally found a program that addresses the root cause. My anxiety has significantly decreased.',
      image: davidImage
    },
    {
      name: 'Rachel K.',
      rating: 4.8,
      text: 'The empathy and understanding in this program is unlike anything I\'ve experienced before.',
      image: rachelImage
    },
    {
      name: 'John P.',
      rating: 4.7,
      text: 'This helped me break free from limiting beliefs I didn\'t even know I had. Truly transformative.',
      image: johnImage
    },
    {
      name: 'James',
      rating: 4.9,
      text: 'Breeze provided me with a safe space to explore and understand my true self.',
      image: jamesImage
    }
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar && stars.length < 5) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <Star key={`empty-${stars.length}`} className="w-4 h-4 text-yellow-400/30" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            People trust us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 shrink-0" data-testid={`avatar-testimonial-${index}`}>
                  <AvatarImage src={testimonial.image} alt={`${testimonial.name} profile picture`} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1">{testimonial.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(testimonial.rating)}
                    <span className="text-foreground/80 ml-1 text-xs font-medium">{testimonial.rating}</span>
                  </div>

                  <p className="text-foreground/80 text-xs leading-snug">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-testimonials"
          >
            Get my result and plan
          </button>
        </div>
      </div>
    </div>
  );
}
