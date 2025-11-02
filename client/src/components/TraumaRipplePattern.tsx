interface TraumaRipplePatternProps {
  pattern: 'abandonment' | 'control' | 'emotional' | 'trust';
  className?: string;
}

export default function TraumaRipplePattern({ pattern, className = '' }: TraumaRipplePatternProps) {
  const getPatternSVG = () => {
    switch (pattern) {
      case 'abandonment':
        // Fast expanding circles - representing push/pull dynamics
        return (
          <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`}>
            <defs>
              <radialGradient id="abandonment-grad">
                <stop offset="0%" stopColor="#54d3bb" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#54d3bb" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="30" fill="none" stroke="url(#abandonment-grad)" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" from="30" to="90" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="30" fill="none" stroke="url(#abandonment-grad)" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" from="30" to="90" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="30" fill="none" stroke="url(#abandonment-grad)" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" from="30" to="90" dur="1.5s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" begin="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        );
      
      case 'control':
        // Tight concentric rings - representing rigidity and containment
        return (
          <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`}>
            <defs>
              <linearGradient id="control-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#54d3bb" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#54d3bb" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={40 + i * 10}
                fill="none"
                stroke="url(#control-grad)"
                strokeWidth="2"
                opacity={0.8 - i * 0.15}
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 100 100`}
                  to={`${360 + i * 20} 100 100`}
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        );
      
      case 'emotional':
        // Irregular dissolving waves - representing emotional turbulence
        return (
          <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`}>
            <defs>
              <radialGradient id="emotional-grad">
                <stop offset="0%" stopColor="#54d3bb" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#54d3bb" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#54d3bb" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="100" rx="40" ry="50" fill="none" stroke="url(#emotional-grad)" strokeWidth="2" opacity="0.7">
              <animate attributeName="rx" values="40;55;35;40" dur="3s" repeatCount="indefinite" />
              <animate attributeName="ry" values="50;40;60;50" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="100" cy="100" rx="60" ry="70" fill="none" stroke="url(#emotional-grad)" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="rx" values="60;75;55;60" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="ry" values="70;60;80;70" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3.5s" repeatCount="indefinite" />
            </ellipse>
          </svg>
        );
      
      case 'trust':
        // Intersecting ripples - representing connection and vulnerability
        return (
          <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`}>
            <defs>
              <radialGradient id="trust-grad-1">
                <stop offset="0%" stopColor="#54d3bb" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#54d3bb" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="trust-grad-2">
                <stop offset="0%" stopColor="#54d3bb" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#54d3bb" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Left ripple source */}
            <circle cx="70" cy="100" r="20" fill="none" stroke="url(#trust-grad-1)" strokeWidth="2" opacity="0.7">
              <animate attributeName="r" from="20" to="70" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="2.5s" repeatCount="indefinite" />
            </circle>
            {/* Right ripple source */}
            <circle cx="130" cy="100" r="20" fill="none" stroke="url(#trust-grad-2)" strokeWidth="2" opacity="0.7">
              <animate attributeName="r" from="20" to="70" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            {/* Second wave - left */}
            <circle cx="70" cy="100" r="20" fill="none" stroke="url(#trust-grad-1)" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="r" from="20" to="70" dur="2.5s" begin="1.25s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" begin="1.25s" repeatCount="indefinite" />
            </circle>
            {/* Second wave - right */}
            <circle cx="130" cy="100" r="20" fill="none" stroke="url(#trust-grad-2)" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="r" from="20" to="70" dur="2.5s" begin="1.75s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" begin="1.75s" repeatCount="indefinite" />
            </circle>
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity: 0.15 }}>
      {getPatternSVG()}
    </div>
  );
}
