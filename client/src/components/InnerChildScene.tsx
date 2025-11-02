import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface InnerChildSceneProps {
  onStartTrial: () => void;
}

export default function InnerChildScene({ onStartTrial }: InnerChildSceneProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Fade in after component mounts
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-b from-[#0a0a12] via-[#0d0d16] to-[#12121c] flex items-center justify-center transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      data-testid="inner-child-scene"
    >
      <div className="w-full max-w-3xl px-6 text-center space-y-8 animate-in fade-in duration-1000 delay-500">
        {/* Glowing center element */}
        <div className="flex justify-center mb-12">
          <div 
            className="relative w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(84, 211, 187, 0.3) 0%, rgba(84, 211, 187, 0.1) 50%, transparent 100%)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          >
            <div 
              className="absolute inset-0 rounded-full border-2 border-primary/40"
              style={{
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-6" style={{ fontFamily: 'Lora, serif' }}>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
            You've reached the depths.
          </h2>
          <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Your younger self has been waiting here, holding everything you couldn't carry alone.
          </p>
          <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl mx-auto">
            The water is clear now. You can see your patterns, your wounds, and most importantly—your path forward.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-8 space-y-4">
          <Button
            onClick={onStartTrial}
            size="lg"
            className="text-lg px-12 py-6 h-auto min-h-[60px] bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            data-testid="button-start-trial-innerchild"
          >
            Begin Your Healing Journey — €1 Trial
          </Button>
          <p className="text-sm text-white/40">
            Access your complete pattern analysis and personalized healing plan
          </p>
        </div>
      </div>
    </div>
  );
}
