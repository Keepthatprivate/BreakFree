import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import profileImage from '@assets/454999ec56229c3ff192fccf33fccb62_1761862009838.jpg';

interface TestimonialsPageProps {
  onContinue: () => void;
}

export default function TestimonialsPage({ onContinue }: TestimonialsPageProps) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 leading-tight">
            People trust us
          </h1>
        </div>

        <div className="relative mb-10 animate-in fade-in slide-in-from-bottom-4" data-testid="testimonial-card">
          {/* Background image placeholder - using gradient instead */}
          <div className="relative bg-gradient-to-br from-blue-400/30 to-green-400/30 rounded-3xl overflow-hidden h-96 sm:h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90"></div>
            
            {/* Testimonial overlay card */}
            <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-card-border/50">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" data-testid="avatar-testimonial">
                  <AvatarImage src={profileImage} alt="James profile picture" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">James</h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-foreground/80 ml-2 text-sm font-medium">4.9</span>
                  </div>

                  <p className="text-foreground text-base leading-relaxed">
                    "Breeze provided me with a safe space to explore and understand my true self."
                  </p>
                </div>
              </div>
            </div>
          </div>
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
