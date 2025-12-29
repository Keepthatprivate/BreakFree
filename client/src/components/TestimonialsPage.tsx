import { Star } from 'lucide-react';
import { useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { trackViewContent } from '@/lib/facebook-tracking';

// Import the same images used in LoadingPage for consistency
import lisaImage from '@assets/stock_images/professional_woman_s_d4fbbe22.jpg';
import annaImage from '@assets/stock_images/young_woman_casual_s_b2572404.jpg';
import rachelImage from '@assets/stock_images/young_woman_casual_s_cb2bd61f.jpg';
import jamesImage from '@assets/stock_images/professional_black_m_06705ed8.jpg';
import michaelImage from '@assets/stock_images/young_man_casual_sel_cfbef95c.jpg';
import emilyImage from '@assets/stock_images/young_woman_smiling__c268d950.jpg';
import davidImage from '@assets/stock_images/young_man_casual_sel_fecd2253.jpg';

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
      name: 'Lisa Chen',
      rating: 4.9,
      text: 'In every relationship I had, there were the same patterns - same conflicts, same drama, same reactions. Now I get it. I am finally able to move on with my life.',
      image: lisaImage
    },
    {
      name: 'Anna B.',
      rating: 4.8,
      text: 'Since my accident as a teenager, I\'ve never been the same. Understanding the roots of my fears and the way I reacted was the only way for me to finally overcome this trauma.',
      image: annaImage
    },
    {
      name: 'Rachel W.',
      rating: 4.7,
      text: 'This app helped me realize that in my relationships my past traumas was a key component for the reasons we broke up. I wouldn\'t have guessed without it.',
      image: rachelImage
    },
    {
      name: 'James R.',
      rating: 4.9,
      text: 'I\'ve always thought I had ADHD. My childhood in Kenya was rough, and I couldn\'t cope with what I saw. Therefore I always had this mental fog, this inability to focus because my mind was keeping me busy to avoid pain. Now it\'s gone for good.',
      image: jamesImage
    },
    {
      name: 'Michael T.',
      rating: 4.8,
      text: 'I\'ve always felt different. Didn\'t know why I was weird or perceived as such by most. This app helped me realize that my childhood traumas made me behave in certain ways that weren\'t normal. The clarity this app gave me is such a relief.',
      image: michaelImage
    },
    {
      name: 'Emily K.',
      rating: 4.7,
      text: 'I am a very susceptible person. Always thought it was part of my identity, actually it was just a reaction to some childhood events. Now my anger is gone, and I can even joke about myself.',
      image: emilyImage
    },
    {
      name: 'David P.',
      rating: 4.9,
      text: 'I have been in depression for over 10 years. Never thought of taking the step to meet with a psy. Now I discovered my triggers, I wish I had found this app sooner.',
      image: davidImage
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
