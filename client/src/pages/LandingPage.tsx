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
            <div className="relative w-[240px] h-[240px]">
              <svg 
                width="240" 
                height="240" 
                viewBox="0 0 240 240" 
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(74, 222, 128, 0.15))' }}
              >
                <defs>
                  <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f5dbb8" />
                    <stop offset="100%" stopColor="#f4d6a8" />
                  </linearGradient>
                </defs>
                
                {/* Profile silhouette - neck and shoulders */}
                <path 
                  d="M 120 200 Q 110 190 110 180 L 110 145 Q 105 140 105 135" 
                  fill="none" 
                  stroke="url(#skinGradient)" 
                  strokeWidth="28" 
                  strokeLinecap="round"
                />
                
                {/* Head profile - smooth curve */}
                <path 
                  d="M 95 135 Q 85 125 85 110 Q 85 85 95 70 Q 105 55 120 50 Q 135 48 145 55 Q 155 65 155 80 L 155 95 Q 155 110 150 120 Q 145 130 135 135 Q 125 138 115 138 Q 105 138 95 135 Z" 
                  fill="url(#skinGradient)"
                  stroke="#e8c89a"
                  strokeWidth="0.5"
                />
                
                {/* Nose - subtle profile detail */}
                <path d="M 95 110 Q 88 112 88 115" fill="none" stroke="#e8c89a" strokeWidth="2" strokeLinecap="round" />
                
                {/* Grass blades growing from head - varied heights and angles */}
                <g opacity="0.95">
                  {/* Back grass blades */}
                  <path d="M 140 80 Q 138 60 142 45 Q 143 40 145 45 Q 147 55 145 80" fill="url(#grassGradient)" opacity="0.8" />
                  <path d="M 135 75 Q 133 58 136 42 Q 137 37 139 42 Q 141 52 138 75" fill="url(#grassGradient)" opacity="0.75" />
                  <path d="M 148 85 Q 147 65 150 48 Q 151 43 153 48 Q 155 60 152 85" fill="url(#grassGradient)" opacity="0.8" />
                  
                  {/* Middle grass blades */}
                  <path d="M 130 72 Q 128 52 132 35 Q 133 28 135 35 Q 137 48 133 72" fill="#4ade80" />
                  <path d="M 125 70 Q 122 48 126 30 Q 127 24 129 30 Q 132 44 128 70" fill="#4ade80" />
                  <path d="M 142 78 Q 140 58 144 40 Q 145 34 147 40 Q 150 54 145 78" fill="#4ade80" />
                  <path d="M 155 90 Q 154 70 158 52 Q 159 46 161 52 Q 163 66 158 90" fill="#4ade80" opacity="0.9" />
                  
                  {/* Front grass blades - tallest */}
                  <path d="M 120 68 Q 117 45 122 22 Q 123 15 125 22 Q 128 40 123 68" fill="#22c55e" />
                  <path d="M 138 76 Q 136 54 140 32 Q 141 25 143 32 Q 146 50 141 76" fill="#22c55e" />
                  <path d="M 150 82 Q 149 60 153 38 Q 154 31 156 38 Q 158 56 154 82" fill="#22c55e" opacity="0.95" />
                </g>
                
                {/* Colorful flowers blooming from the grass */}
                <g>
                  {/* Pink flower 1 */}
                  <circle cx="125" cy="28" r="4.5" fill="#ec4899" opacity="0.9" />
                  <circle cx="121" cy="25" r="3.5" fill="#f472b6" />
                  <circle cx="129" cy="25" r="3.5" fill="#f472b6" />
                  <circle cx="125" cy="22" r="3.5" fill="#f472b6" />
                  <circle cx="125" cy="26" r="2" fill="#fbbf24" />
                  
                  {/* Purple flower */}
                  <circle cx="145" cy="38" r="4" fill="#a855f7" opacity="0.9" />
                  <circle cx="142" cy="35" r="3" fill="#c084fc" />
                  <circle cx="148" cy="35" r="3" fill="#c084fc" />
                  <circle cx="145" cy="33" r="3" fill="#c084fc" />
                  <circle cx="145" cy="37" r="1.5" fill="#fbbf24" />
                  
                  {/* Yellow flower */}
                  <circle cx="158" cy="48" r="4" fill="#fbbf24" opacity="0.9" />
                  <circle cx="155" cy="46" r="3" fill="#fde68a" />
                  <circle cx="161" cy="46" r="3" fill="#fde68a" />
                  <circle cx="158" cy="44" r="3" fill="#fde68a" />
                  <circle cx="158" cy="48" r="1.5" fill="#f97316" />
                  
                  {/* Pink flower 2 */}
                  <circle cx="138" cy="35" r="3.5" fill="#f472b6" opacity="0.85" />
                  <circle cx="135" cy="33" r="2.5" fill="#ec4899" />
                  <circle cx="141" cy="33" r="2.5" fill="#ec4899" />
                  <circle cx="138" cy="31" r="2.5" fill="#ec4899" />
                  
                  {/* Small purple flower */}
                  <circle cx="150" cy="55" r="3" fill="#c084fc" opacity="0.8" />
                  <circle cx="148" cy="54" r="2" fill="#a855f7" />
                  <circle cx="152" cy="54" r="2" fill="#a855f7" />
                </g>
                
                {/* Shimmering stars around the head */}
                <g fill="#fbbf24" opacity="0.9">
                  {/* Large stars */}
                  <path d="M 75 95 L 76.5 98 L 80 99 L 76.5 100 L 75 103 L 73.5 100 L 70 99 L 73.5 98 Z" />
                  <path d="M 170 70 L 171.5 73 L 175 74 L 171.5 75 L 170 78 L 168.5 75 L 165 74 L 168.5 73 Z" />
                  <path d="M 65 125 L 66.5 128 L 70 129 L 66.5 130 L 65 133 L 63.5 130 L 60 129 L 63.5 128 Z" />
                  
                  {/* Medium stars */}
                  <path d="M 85 65 L 86 67 L 88 68 L 86 69 L 85 71 L 84 69 L 82 68 L 84 67 Z" opacity="0.8" />
                  <path d="M 175 95 L 176 97 L 178 98 L 176 99 L 175 101 L 174 99 L 172 98 L 174 97 Z" opacity="0.8" />
                  <path d="M 70 150 L 71 152 L 73 153 L 71 154 L 70 156 L 69 154 L 67 153 L 69 152 Z" opacity="0.75" />
                </g>
                
                {/* Tiny twinkling stars */}
                <g fill="#fde68a">
                  <circle cx="80" cy="80" r="1.5" opacity="0.9">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="165" cy="85" r="1.5" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="75" cy="110" r="1.5" opacity="0.85">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="168" cy="110" r="1.5" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="90" cy="55" r="1.5" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite" />
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
