import { Star } from 'lucide-react';
import { useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { trackViewContent } from '@/lib/facebook-tracking';

// Import diverse profile images - these should NOT overlap with LoadingPage images
import sarahImage from '@assets/stock_images/professional_woman_s_42c21774.jpg';
import markImage from '@assets/stock_images/casual_photo_young_m_c492381e.jpg';
import jessicaImage from '@assets/stock_images/casual_photo_young_w_7efca3f0.jpg';
import chrisImage from '@assets/stock_images/young_man_casual_sel_6b0d184e.jpg';
import amandaImage from '@assets/stock_images/young_woman_casual_s_cab6f0c8.jpg';
import johnImage from '@assets/stock_images/professional_headsho_9ebfa56d.jpg';

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
      name: 'Mark T.',
      rating: 4.9,
      text: 'The 28-day plan gave me tools I never knew I needed. My relationships have never been better.',
      image: markImage
    },
    {
      name: 'Jessica R.',
      rating: 4.7,
      text: 'I was skeptical at first, but the insights I gained were life-changing.',
      image: jessicaImage
    },
    {
      name: 'Chris L.',
      rating: 4.9,
      text: 'Finally found a program that addresses the root cause. My anxiety has significantly decreased.',
      image: chrisImage
    },
    {
      name: 'Amanda K.',
      rating: 4.8,
      text: 'The empathy and understanding in this program is unlike anything I\'ve experienced.',
      image: amandaImage
    },
    {
      name: 'John P.',
      rating: 4.7,
      text: 'This helped me break free from limiting beliefs I didn\'t even know I had.',
      image: johnImage
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-amber-400/30'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            Real stories, real results
          </h1>
          <p className="text-muted-foreground text-base">
            From people just like you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-4 border border-card-border/30 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 shrink-0" data-testid={`avatar-testimonial-${index}`}>
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="text-sm">{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{testimonial.name}</h3>
                    <div className="flex items-center gap-0.5">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
