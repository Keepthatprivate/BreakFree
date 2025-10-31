import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/ChatGPT Image 23 oct. 2025, 11_10_54_1761938952913.png';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handleStartQuiz = () => {
    setLocation('/quiz');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo */}
      <header className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="BreakFree Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
          />
          <span className="text-xl sm:text-2xl font-semibold text-foreground">
            BreakFree
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:py-20">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg 
                width="200" 
                height="240" 
                viewBox="0 0 200 240" 
                className="drop-shadow-lg"
              >
                {/* Person with plant growing from head */}
                {/* Body/Shirt */}
                <ellipse cx="100" cy="200" rx="60" ry="40" fill="#60a5fa" />
                
                {/* Head */}
                <circle cx="100" cy="140" r="45" fill="#fde68a" />
                
                {/* Green hair/plant base */}
                <ellipse cx="100" cy="115" rx="48" ry="35" fill="#86efac" />
                
                {/* Plant stem */}
                <rect x="98" y="70" width="4" height="45" fill="#22c55e" rx="2" />
                
                {/* Leaves */}
                <ellipse cx="85" cy="85" rx="8" ry="12" fill="#4ade80" transform="rotate(-30 85 85)" />
                <ellipse cx="115" cy="80" rx="8" ry="12" fill="#4ade80" transform="rotate(30 115 80)" />
                <ellipse cx="90" cy="70" rx="7" ry="10" fill="#86efac" transform="rotate(-20 90 70)" />
                <ellipse cx="110" cy="68" rx="7" ry="10" fill="#86efac" transform="rotate(20 110 68)" />
                
                {/* Flower on top */}
                <circle cx="100" cy="55" r="8" fill="#f472b6" />
                <circle cx="94" cy="50" r="6" fill="#ec4899" />
                <circle cx="106" cy="50" r="6" fill="#ec4899" />
                <circle cx="100" cy="45" r="6" fill="#f472b6" />
                
                {/* Blue butterfly */}
                <g transform="translate(130, 30)">
                  <ellipse cx="0" cy="0" rx="8" ry="12" fill="#60a5fa" transform="rotate(-20 0 0)" />
                  <ellipse cx="8" cy="0" rx="8" ry="12" fill="#60a5fa" transform="rotate(20 8 0)" />
                  <line x1="4" y1="-2" x2="4" y2="8" stroke="#1e40af" strokeWidth="1.5" />
                </g>
                
                {/* Sparkles */}
                <g fill="#fbbf24">
                  <path d="M 40 140 L 42 145 L 47 147 L 42 149 L 40 154 L 38 149 L 33 147 L 38 145 Z" />
                  <path d="M 160 160 L 162 165 L 167 167 L 162 169 L 160 174 L 158 169 L 153 167 L 158 165 Z" />
                </g>
                <g fill="#fde68a">
                  <circle cx="45" cy="180" r="2" opacity="0.8" />
                  <circle cx="155" cy="185" r="2" opacity="0.8" />
                </g>
              </svg>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Break free from childhood trauma
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              Uncover your trauma score and learn how to move forward with confidence
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={handleStartQuiz}
              size="lg"
              className="w-full sm:w-auto px-16 py-6 text-lg font-semibold rounded-full"
              data-testid="button-start"
            >
              Take test
            </Button>
          </div>
        </div>
      </main>

      {/* Footer spacing */}
      <div className="h-12"></div>
    </div>
  );
}
