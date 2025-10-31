interface VisualPatternProps {
  pattern: string;
  className?: string;
}

export default function VisualPattern({ pattern, className = "" }: VisualPatternProps) {
  if (pattern === 'lines') {
    return (
      <div className={`relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/30 via-slate-800/30 to-slate-900/30 ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="barrier-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Horizontal paths - some continuous, some broken */}
          <line x1="20" y1="80" x2="180" y2="80" stroke="url(#path-gradient)" strokeWidth="2.5" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="220" y1="150" x2="380" y2="150" stroke="url(#path-gradient)" strokeWidth="2.5" opacity="0.6">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="20" y1="220" x2="150" y2="220" stroke="url(#path-gradient)" strokeWidth="2.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
          </line>
          
          {/* Vertical barriers - blocking some paths */}
          <rect x="180" y="60" width="8" height="50" fill="url(#barrier-gradient)" rx="2" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="210" y="130" width="8" height="60" fill="url(#barrier-gradient)" rx="2" opacity="0.5">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="150" y="200" width="8" height="50" fill="url(#barrier-gradient)" rx="2" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="5s" repeatCount="indefinite" />
          </rect>
          
          {/* Diagonal paths - navigating around barriers */}
          <line x1="180" y1="85" x2="210" y2="145" stroke="url(#path-gradient)" strokeWidth="2" opacity="0.5" strokeDasharray="4,4">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="220" y1="155" x2="280" y2="210" stroke="url(#path-gradient)" strokeWidth="2" opacity="0.5" strokeDasharray="4,4">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" repeatCount="indefinite" />
          </line>
          
          {/* Small chaotic elements - scattered dots representing complexity */}
          {[
            { cx: 100, cy: 60, delay: 0 },
            { cx: 250, cy: 100, delay: 1 },
            { cx: 320, cy: 180, delay: 2 },
            { cx: 80, cy: 190, delay: 0.5 },
            { cx: 300, cy: 70, delay: 1.5 },
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="2.5"
              fill="#22c55e"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur={`${3 + dot.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="2;3.5;2"
                dur={`${3 + dot.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
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
