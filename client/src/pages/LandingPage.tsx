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
                {/* Blue shirt/shoulders */}
                <ellipse cx="100" cy="170" rx="50" ry="30" fill="#60a5fa" />
                
                {/* Neck */}
                <rect x="90" y="145" width="20" height="30" fill="#f5c9a6" rx="5" />
                
                {/* Head - side profile facing right */}
                <g>
                  {/* Main head shape */}
                  <ellipse cx="105" cy="120" rx="35" ry="40" fill="#f5c9a6" />
                  
                  {/* Forehead/face curve */}
                  <path d="M 85 100 Q 82 110 82 120 Q 82 135 90 145" fill="#f5c9a6" />
                  
                  {/* Nose - simple bump */}
                  <ellipse cx="75" cy="120" rx="8" ry="12" fill="#f5c9a6" />
                  
                  {/* Ear */}
                  <ellipse cx="132" cy="120" rx="8" ry="14" fill="#f0bb96" />
                </g>
                
                {/* Green plant hair growing from head */}
                <g>
                  {/* Large rounded plant shapes */}
                  <ellipse cx="95" cy="85" rx="28" ry="35" fill="#4ade80" opacity="0.95" />
                  <ellipse cx="105" cy="75" rx="25" ry="30" fill="#22c55e" opacity="0.9" />
                  <ellipse cx="118" cy="80" rx="22" ry="28" fill="#4ade80" opacity="0.92" />
                  
                  {/* Additional plant layers for depth */}
                  <ellipse cx="88" cy="90" rx="18" ry="22" fill="#22c55e" opacity="0.85" />
                  <ellipse cx="112" cy="68" rx="20" ry="24" fill="#4ade80" opacity="0.88" />
                  
                  {/* Small plant accent */}
                  <ellipse cx="125" cy="90" rx="12" ry="16" fill="#22c55e" opacity="0.8" />
                </g>
                
                {/* Pink/red flowers blooming from plants */}
                <g>
                  {/* Flower 1 - top left */}
                  <circle cx="88" cy="70" r="6" fill="#ec4899" />
                  <circle cx="84" cy="68" r="4" fill="#f472b6" />
                  <circle cx="92" cy="68" r="4" fill="#f472b6" />
                  <circle cx="88" cy="66" r="4" fill="#f472b6" />
                  <circle cx="88" cy="70" r="2.5" fill="#fbbf24" />
                  
                  {/* Flower 2 - top center */}
                  <circle cx="105" cy="60" r="5.5" fill="#f43f5e" />
                  <circle cx="102" cy="58" r="3.5" fill="#fb7185" />
                  <circle cx="108" cy="58" r="3.5" fill="#fb7185" />
                  <circle cx="105" cy="56" r="3.5" fill="#fb7185" />
                  <circle cx="105" cy="60" r="2" fill="#fbbf24" />
                  
                  {/* Flower 3 - top right */}
                  <circle cx="120" cy="75" r="5" fill="#ec4899" />
                  <circle cx="117" cy="73" r="3" fill="#f472b6" />
                  <circle cx="123" cy="73" r="3" fill="#f472b6" />
                  <circle cx="120" cy="71" r="3" fill="#f472b6" />
                  
                  {/* Small flower bud */}
                  <circle cx="98" cy="65" r="3" fill="#f472b6" opacity="0.9" />
                </g>
                
                {/* Blue butterfly */}
                <g transform="translate(110, 48)">
                  {/* Left wing */}
                  <ellipse cx="-3" cy="0" rx="6" ry="9" fill="#60a5fa" transform="rotate(-25 -3 0)" />
                  {/* Right wing */}
                  <ellipse cx="3" cy="0" rx="6" ry="9" fill="#60a5fa" transform="rotate(25 3 0)" />
                  {/* Body */}
                  <ellipse cx="0" cy="0" rx="1.5" ry="4" fill="#1e40af" />
                  {/* Antennae */}
                  <path d="M -0.5 -3 Q -1 -5 -0.5 -6" stroke="#1e40af" strokeWidth="0.5" fill="none" />
                  <path d="M 0.5 -3 Q 1 -5 0.5 -6" stroke="#1e40af" strokeWidth="0.5" fill="none" />
                </g>
                
                {/* Sparkles around the figure */}
                <g>
                  {/* Left side sparkle */}
                  <g transform="translate(55, 95)">
                    <line x1="-6" y1="0" x2="6" y2="0" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
                    <line x1="0" y1="-6" x2="0" y2="6" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
                    <line x1="-4" y1="-4" x2="4" y2="4" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
                    <line x1="-4" y1="4" x2="4" y2="-4" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
                  </g>
                  
                  {/* Right side sparkle */}
                  <g transform="translate(145, 105)">
                    <line x1="-5" y1="0" x2="5" y2="0" stroke="#fbbf24" strokeWidth="2" opacity="0.7" />
                    <line x1="0" y1="-5" x2="0" y2="5" stroke="#fbbf24" strokeWidth="2" opacity="0.7" />
                    <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
                    <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
                  </g>
                  
                  {/* Small sparkles */}
                  <circle cx="65" cy="115" r="2" fill="#fbbf24" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="135" cy="90" r="2" fill="#fbbf24" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
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
