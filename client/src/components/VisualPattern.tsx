interface VisualPatternProps {
  pattern: string;
  className?: string;
}

export default function VisualPattern({ pattern, className = "" }: VisualPatternProps) {
  if (pattern === 'lines') {
    return (
      <div className={`relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Discontinuous green lines - broken segments */}
          {[...Array(6)].map((_, i) => {
            const yPos = 60 + i * 50;
            const segments = [0, 1, 2, 3, 4];
            return (
              <g key={i}>
                {segments.map((seg) => (
                  <line
                    key={seg}
                    x1={seg * 250 + 20}
                    y1={yPos}
                    x2={seg * 250 + 180}
                    y2={yPos}
                    stroke="url(#line-gradient)"
                    strokeWidth="2.5"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.3;0.6;0.3"
                      dur={`${5 + i}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (pattern === 'waves') {
    return (
      <div className={`relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Multiple wave layers */}
          <path
            d="M0,160 Q300,100 600,160 T1200,160 L1200,400 L0,400 Z"
            fill="url(#wave-gradient)"
            opacity="0.5"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,160 Q300,100 600,160 T1200,160 L1200,400 L0,400 Z;
                M0,160 Q300,220 600,160 T1200,160 L1200,400 L0,400 Z;
                M0,160 Q300,100 600,160 T1200,160 L1200,400 L0,400 Z
              "
            />
          </path>
          
          <path
            d="M0,200 Q300,240 600,200 T1200,200 L1200,400 L0,400 Z"
            fill="url(#wave-gradient)"
            opacity="0.3"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,200 Q300,240 600,200 T1200,200 L1200,400 L0,400 Z;
                M0,200 Q300,160 600,200 T1200,200 L1200,400 L0,400 Z;
                M0,200 Q300,240 600,200 T1200,200 L1200,400 L0,400 Z
              "
            />
          </path>
        </svg>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (pattern === 'tree') {
    return (
      <div className={`relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="tree-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Tree trunk */}
          <rect x="180" y="200" width="40" height="120" fill="url(#tree-gradient)" opacity="0.6" rx="4" />
          
          {/* Tree branches/foliage - organic circular shapes */}
          <circle cx="200" cy="120" r="60" fill="url(#tree-gradient)" opacity="0.4">
            <animate attributeName="r" values="60;65;60" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="140" r="50" fill="url(#tree-gradient)" opacity="0.3">
            <animate attributeName="r" values="50;55;50" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="240" cy="140" r="50" fill="url(#tree-gradient)" opacity="0.3">
            <animate attributeName="r" values="50;54;50" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="170" r="55" fill="url(#tree-gradient)" opacity="0.35">
            <animate attributeName="r" values="55;58;55" dur="5.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Leaves floating */}
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx={150 + i * 15}
              cy={80 + (i % 4) * 30}
              r="3"
              fill="hsl(var(--primary))"
              opacity="0.5"
            >
              <animate
                attributeName="cy"
                values={`${80 + (i % 4) * 30};${100 + (i % 4) * 30};${80 + (i % 4) * 30}`}
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0.2;0.5"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>
    );
  }

  return null;
}
