interface TraumaPatternsProps {
  onContinue: () => void;
}

export default function TraumaPatterns({ onContinue }: TraumaPatternsProps) {
  const patterns = [
    {
      title: 'Emotional Vulnerability:',
      iconGradient: 'from-pink-400 to-red-400',
      cardBg: 'bg-card/40',
      borderColor: 'border-card-border/20',
      items: [
        'Difficulty sharing feelings openly and honestly',
        'Struggling with self-esteem and self-worth',
        'Dealing with the aftermath of toxic or abusive relationships',
        'Feeling a lack of support and understanding from others'
      ]
    },
    {
      title: 'Feeling Stuck in Growth:',
      iconGradient: 'from-blue-400 to-cyan-400',
      cardBg: 'bg-card/40',
      borderColor: 'border-card-border/20',
      items: [
        'Uncertainty and indecisiveness regarding career choices',
        'Difficulty finding passion and purpose in life',
        'Feeling trapped in a life situation that brings no fulfillment',
        'Fear of taking risks and stepping outside of comfort zones'
      ]
    },
    {
      title: 'Relationship Problems:',
      iconGradient: 'from-orange-400 to-yellow-400',
      cardBg: 'bg-card/40',
      borderColor: 'border-card-border/20',
      items: [
        'Toxic relationship dynamics and patterns',
        'Difficulty establishing and maintaining healthy boundaries',
        'Communication breakdowns and constant conflicts',
        'Feeling disconnected and emotionally distant from a partner'
      ]
    },
    {
      title: 'Insomnia and Stress:',
      iconGradient: 'from-cyan-400 to-teal-400',
      cardBg: 'bg-card/40',
      borderColor: 'border-card-border/20',
      items: [
        'Chronic sleeplessness and difficulty falling or staying asleep',
        'Overwhelming stress from work, personal life, or both',
        'Anxiety and racing thoughts that interfere with rest and relaxation',
        'Inability to manage stress effectively, leading to physical and mental exhaustion'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 leading-tight">
            This plan will help if you experience
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className={`${pattern.cardBg} backdrop-blur-sm rounded-2xl p-7 border ${pattern.borderColor} animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`pattern-card-${index}`}
            >
              <div className="flex flex-col items-center text-center mb-5">
                {/* Gradient Circle Icon */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${pattern.iconGradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${pattern.iconGradient} opacity-60`}></div>
                </div>
                <h2 className="text-lg font-bold text-foreground">{pattern.title}</h2>
              </div>
              
              <ul className="space-y-3">
                {pattern.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2.5">
                    <span className="text-foreground/50 text-xs mt-1.5">◆</span>
                    <span className="text-foreground/80 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-patterns"
          >
            Get my result and plan
          </button>
        </div>
      </div>
    </div>
  );
}
