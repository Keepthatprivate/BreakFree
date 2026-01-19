import { useLocation } from 'wouter';
// Optimized WebP images (90%+ smaller)
import logoImage from '@assets/optimized/ChatGPT Image 23 oct. 2025, 11_10_54_1761938952913.webp';
import freedomImage from '@assets/optimized/pexels-andre-furtado-43594-1263986_1761942239297.webp';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handleStartQuiz = () => {
    setLocation('/intro');
  };

  return (
    <div className="min-h-screen bg-[#0d0d16] flex flex-col items-center justify-center text-center p-8">
      {/* Logo - absolute positioned top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-2 font-medium text-base text-white opacity-90">
        <img
          src={logoImage}
          alt="BreakFree Logo"
          className="w-[26px] h-[26px]"
          loading="eager"
          decoding="async"
          width="26"
          height="26"
        />
        <span>BreakFree</span>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[600px] flex flex-col items-center gap-5">
        {/* Illustration */}
        <img
          src={freedomImage}
          alt="Hands breaking free from chains"
          className="w-40 h-40 object-cover mb-4 rounded-full"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.05))' }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width="160"
          height="160"
        />

        {/* Headline */}
        <h1 className="text-[1.9rem] leading-[1.3] font-semibold text-white w-full">
          Break free from childhood trauma
        </h1>
        
        {/* Subheadline */}
        <p className="text-base text-white font-normal leading-[1.6] max-w-[420px] italic">
          Uncover your trauma score and learn how to move forward with confidence
        </p>

        {/* CTA Button */}
        <button 
          onClick={handleStartQuiz}
          className="w-full bg-[#54d3bb] text-white border-none rounded-full px-[42px] py-[14px] text-[1.05rem] font-semibold cursor-pointer mt-4 transition-all duration-[250ms] ease-in-out hover:translate-y-[-2px] hover:scale-[1.03] hover:bg-[#6ee7b7]"
          style={{ 
            boxShadow: '0 4px 16px rgba(84, 211, 187, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(110, 231, 183, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(84, 211, 187, 0.3)';
          }}
          data-testid="button-start"
        >
          Take test
        </button>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-2">
            2025 © All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Subscription Terms</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
