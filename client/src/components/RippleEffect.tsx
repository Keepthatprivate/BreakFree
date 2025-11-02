import { useEffect, useState } from 'react';

interface RippleEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export default function RippleEffect({ x, y, onComplete }: RippleEffectProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <div
      className="ripple-container"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 5,
      }}
      data-testid="ripple-effect"
    >
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'translate(-50%, -50%)' }}>
        <circle
          cx="100"
          cy="100"
          r="10"
          fill="none"
          stroke="#54d3bb"
          strokeWidth="2"
          opacity="0.8"
          className="ripple-circle ripple-1"
        />
        <circle
          cx="100"
          cy="100"
          r="10"
          fill="none"
          stroke="#54d3bb"
          strokeWidth="1.5"
          opacity="0.6"
          className="ripple-circle ripple-2"
        />
        <circle
          cx="100"
          cy="100"
          r="10"
          fill="none"
          stroke="#54d3bb"
          strokeWidth="1"
          opacity="0.4"
          className="ripple-circle ripple-3"
        />
      </svg>
    </div>
  );
}
