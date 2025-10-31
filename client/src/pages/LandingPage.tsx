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
            <div className="relative w-[200px] h-[200px]">
              <svg 
                width="200" 
                height="200" 
                viewBox="0 0 200 200" 
                className="w-full h-full"
              >
                <defs>
                  {/* Glowing aura gradient */}
                  <radialGradient id="auraGlow">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </radialGradient>
                  
                  {/* Person gradient */}
                  <linearGradient id="personGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                
                {/* Outer peaceful glow - pulsing */}
                <circle cx="100" cy="100" r="85" fill="url(#auraGlow)" opacity="0.6">
                  <animate attributeName="r" values="80;90;80" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
                </circle>
                
                {/* Middle glow layer */}
                <circle cx="100" cy="100" r="65" fill="url(#auraGlow)" opacity="0.5">
                  <animate attributeName="r" values="60;70;60" dur="3s" repeatCount="indefinite" />
                </circle>
                
                {/* Person in meditation pose */}
                <g transform="translate(100, 100)">
                  {/* Head */}
                  <circle cx="0" cy="-25" r="18" fill="url(#personGradient)" opacity="0.95" />
                  
                  {/* Body/torso */}
                  <ellipse cx="0" cy="5" rx="20" ry="28" fill="url(#personGradient)" opacity="0.95" />
                  
                  {/* Legs crossed (meditation pose) */}
                  <ellipse cx="-12" cy="30" rx="16" ry="10" fill="url(#personGradient)" opacity="0.95" transform="rotate(-10 -12 30)" />
                  <ellipse cx="12" cy="30" rx="16" ry="10" fill="url(#personGradient)" opacity="0.95" transform="rotate(10 12 30)" />
                  
                  {/* Arms in meditation position */}
                  <ellipse cx="-18" cy="8" rx="8" ry="20" fill="url(#personGradient)" opacity="0.9" transform="rotate(-20 -18 8)" />
                  <ellipse cx="18" cy="8" rx="8" ry="20" fill="url(#personGradient)" opacity="0.9" transform="rotate(20 18 8)" />
                  
                  {/* Hands resting */}
                  <circle cx="-15" cy="28" r="6" fill="url(#personGradient)" opacity="0.9" />
                  <circle cx="15" cy="28" r="6" fill="url(#personGradient)" opacity="0.9" />
                </g>
                
                {/* Floating calm energy particles */}
                <g fill="#4ade80">
                  <circle cx="40" cy="60" r="2.5" opacity="0.7">
                    <animate attributeName="cy" values="60;50;60" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="160" cy="70" r="2.5" opacity="0.6">
                    <animate attributeName="cy" values="70;60;70" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="50" cy="130" r="2" opacity="0.65">
                    <animate attributeName="cy" values="130;120;130" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.75;0.4" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="150" cy="140" r="2" opacity="0.7">
                    <animate attributeName="cy" values="140;130;140" dur="3.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" repeatCount="indefinite" />
                  </circle>
                </g>
                
                {/* Peaceful sparkles */}
                <g fill="#fbbf24">
                  <path d="M 65 45 L 66 47 L 68 48 L 66 49 L 65 51 L 64 49 L 62 48 L 64 47 Z" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                  </path>
                  <path d="M 135 50 L 136 52 L 138 53 L 136 54 L 135 56 L 134 54 L 132 53 L 134 52 Z" opacity="0.75">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M 75 155 L 76 157 L 78 158 L 76 159 L 75 161 L 74 159 L 72 158 L 74 157 Z" opacity="0.7">
                    <animate attributeName="opacity" values="0.4;0.85;0.4" dur="3s" repeatCount="indefinite" />
                  </path>
                  <path d="M 125 150 L 126 152 L 128 153 L 126 154 L 125 156 L 124 154 L 122 153 L 124 152 Z" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.3s" repeatCount="indefinite" />
                  </path>
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
