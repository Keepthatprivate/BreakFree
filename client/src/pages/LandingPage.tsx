import { useLocation } from 'wouter';
import logoImage from '@assets/ChatGPT Image 23 oct. 2025, 11_10_54_1761938952913.png';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handleStartQuiz = () => {
    setLocation('/quiz');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header with Logo */}
      <header className="p-6">
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="BreakFree Logo" 
            className="w-9 h-9 rounded-lg"
          />
          <span className="text-lg font-medium text-white">
            BreakFree
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <div className="max-w-[460px] w-full text-center">
          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[160px] h-[220px]">
              <svg 
                width="160" 
                height="220" 
                viewBox="0 0 160 220" 
                className="w-full h-full"
              >
                {/* Body/Shirt - blue */}
                <path 
                  d="M 80 160 Q 50 160 40 180 L 40 220 L 120 220 L 120 180 Q 110 160 80 160 Z" 
                  fill="#60a5fa" 
                />
                
                {/* Head - peach/tan */}
                <circle cx="80" cy="125" r="38" fill="#f5dbb8" />
                
                {/* Green hair base - large rounded shape */}
                <ellipse cx="80" cy="100" rx="42" ry="32" fill="#86efac" />
                
                {/* Plant stem coming from top of head */}
                <rect x="78" y="55" width="4" height="45" fill="#4ade80" rx="2" />
                
                {/* Leaves on sides */}
                <ellipse cx="68" cy="72" rx="10" ry="14" fill="#4ade80" transform="rotate(-35 68 72)" />
                <ellipse cx="92" cy="68" rx="10" ry="14" fill="#4ade80" transform="rotate(35 92 68)" />
                <ellipse cx="72" cy="58" rx="8" ry="11" fill="#86efac" transform="rotate(-25 72 58)" />
                <ellipse cx="88" cy="56" rx="8" ry="11" fill="#86efac" transform="rotate(25 88 56)" />
                
                {/* Pink flower on very top */}
                <circle cx="80" cy="42" r="7" fill="#f472b6" />
                <circle cx="75" cy="38" r="5.5" fill="#ec4899" />
                <circle cx="85" cy="38" r="5.5" fill="#ec4899" />
                <circle cx="80" cy="34" r="5" fill="#f472b6" />
                
                {/* Blue butterfly - top right */}
                <g transform="translate(115, 22)">
                  <ellipse cx="-2" cy="0" rx="7" ry="10" fill="#60a5fa" transform="rotate(-25 -2 0)" />
                  <ellipse cx="6" cy="0" rx="7" ry="10" fill="#60a5fa" transform="rotate(25 6 0)" />
                  <line x1="2" y1="-3" x2="2" y2="6" stroke="#1e40af" strokeWidth="1.2" />
                </g>
                
                {/* Left sparkle - yellow/gold star */}
                <g transform="translate(28, 118)">
                  <path d="M 0 -6 L 1.5 -2 L 6 -1 L 1.5 0 L 0 4 L -1.5 0 L -6 -1 L -1.5 -2 Z" fill="#fbbf24" />
                </g>
                
                {/* Right sparkle */}
                <g transform="translate(132, 128)">
                  <path d="M 0 -6 L 1.5 -2 L 6 -1 L 1.5 0 L 0 4 L -1.5 0 L -6 -1 L -1.5 -2 Z" fill="#fbbf24" />
                </g>
                
                {/* Small dots/stars */}
                <circle cx="34" cy="110" r="1.5" fill="#fde68a" opacity="0.9" />
                <circle cx="126" cy="120" r="1.5" fill="#fde68a" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[44px] leading-[52px] font-bold text-white mb-4">
            Break free from childhood trauma
          </h1>
          
          {/* Subheadline */}
          <p className="text-[17px] leading-[24px] text-white/80 mb-10">
            Uncover your trauma score and learn how to move forward with confidence
          </p>

          {/* CTA Button */}
          <button 
            onClick={handleStartQuiz}
            className="w-full max-w-[460px] h-[52px] bg-[#4ade80] hover:bg-[#3dcc72] text-white text-[17px] font-semibold rounded-full transition-colors"
            data-testid="button-start"
          >
            Take test
          </button>
        </div>
      </main>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
}
