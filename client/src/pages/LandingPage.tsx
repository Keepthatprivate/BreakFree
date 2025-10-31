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
            <div className="relative w-[180px] h-[180px]">
              <svg 
                width="180" 
                height="180" 
                viewBox="0 0 180 180" 
                className="w-full h-full"
              >
                <defs>
                  <radialGradient id="calmGlow">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Soft peaceful glow */}
                <circle cx="90" cy="90" r="75" fill="url(#calmGlow)">
                  <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                
                {/* Simple person meditating */}
                <g fill="#4ade80">
                  {/* Head - simple circle */}
                  <circle cx="90" cy="55" r="16" />
                  
                  {/* Neck */}
                  <rect x="85" y="70" width="10" height="8" rx="2" />
                  
                  {/* Body - simple rounded rectangle */}
                  <rect x="72" y="78" width="36" height="40" rx="8" />
                  
                  {/* Left arm bent */}
                  <rect x="54" y="85" width="20" height="12" rx="6" transform="rotate(-15 64 91)" />
                  {/* Left hand on lap */}
                  <circle cx="58" cy="110" r="7" />
                  
                  {/* Right arm bent */}
                  <rect x="106" y="85" width="20" height="12" rx="6" transform="rotate(15 116 91)" />
                  {/* Right hand on lap */}
                  <circle cx="122" cy="110" r="7" />
                  
                  {/* Left leg crossed */}
                  <ellipse cx="72" cy="125" rx="18" ry="12" transform="rotate(-8 72 125)" />
                  <rect x="52" y="128" width="22" height="10" rx="5" transform="rotate(-5 63 133)" />
                  
                  {/* Right leg crossed */}
                  <ellipse cx="108" cy="125" rx="18" ry="12" transform="rotate(8 108 125)" />
                  <rect x="106" y="128" width="22" height="10" rx="5" transform="rotate(5 117 133)" />
                </g>
                
                {/* Few gentle sparkles */}
                <g fill="#fbbf24">
                  <circle cx="45" cy="60" r="2" opacity="0.7">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="135" cy="65" r="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="50" cy="115" r="1.5" opacity="0.5">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="130" cy="120" r="1.5" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                </g>
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
