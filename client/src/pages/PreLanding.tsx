import { useLocation } from 'wouter';
import { Sparkles, ArrowRight, Star, Shield, Users } from 'lucide-react';

export default function PreLanding() {
  const [, setLocation] = useLocation();

  const handleStartQuiz = () => {
    setLocation('/intro');
  };

  return (
    <div className="min-h-screen bg-[#0d0d16] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="max-w-[400px] flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-[#54d3bb] text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>3-minute self-discovery quiz</span>
        </div>

        <h1 className="text-[1.75rem] sm:text-[2rem] leading-[1.3] font-semibold text-white">
          Your present is{' '}
          <span className="relative inline-block">
            <span className="relative z-10">heavily shaped</span>
            <span 
              className="absolute inset-0 bg-[#54d3bb]/20 rounded-md -mx-1 px-1"
              style={{ top: '2px', bottom: '2px' }}
            />
          </span>{' '}
          by your past
        </h1>

        <p className="text-base text-gray-300 leading-[1.7]">
          Discover the hidden childhood patterns still influencing your relationships, decisions, and emotional well-being today.
        </p>

        <p className="text-sm text-gray-400 italic">
          What's holding you back? Let's find out.
        </p>

        <button
          onClick={handleStartQuiz}
          className="w-full bg-[#54d3bb] text-[#0d0d16] border-none rounded-full px-8 py-4 text-base font-semibold cursor-pointer mt-4 flex items-center justify-center gap-2 transition-all duration-[250ms] ease-in-out hover:translate-y-[-2px] hover:scale-[1.02] hover:bg-[#6ee7b7]"
          style={{
            boxShadow: '0 4px 16px rgba(84, 211, 187, 0.3)'
          }}
          data-testid="button-start-quiz"
        >
          Start The Quiz
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
            ))}
            <span className="text-sm text-gray-400 ml-2">4.9/5 from 2,400+ reviews</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>127K+ people helped</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>100% confidential</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
