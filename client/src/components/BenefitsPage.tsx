interface BenefitsPageProps {
  onContinue: () => void;
}

export default function BenefitsPage({ onContinue }: BenefitsPageProps) {
  const benefits = [
    {
      emoji: '🧠',
      title: 'Improved Emotional Well-being:',
      description: 'Experience significant improvements in your emotional well-being. Gain tools and strategies to manage triggers, regulate emotions, and foster resilience, leading to greater peace and happiness.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30'
    },
    {
      emoji: '💑',
      title: 'Enhanced Relationships:',
      description: 'Heal childhood trauma to deepen understanding of your emotions and behaviors. Improve communication and empathy, fostering healthier connections with loved ones and greater intimacy.',
      gradient: 'from-pink-500/20 to-red-500/20',
      border: 'border-pink-500/30'
    },
    {
      emoji: '🌸',
      title: 'Increased Self-Empowerment:',
      description: 'Reclaim your life and foster personal growth. Gain control over experiences, break free from limiting beliefs, and cultivate self-worth and empowerment for a more fulfilling, trauma-free life.',
      gradient: 'from-blue-500/20 to-purple-500/20',
      border: 'border-blue-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            How can 28-day Childhood Trauma healing plan help you:
          </h1>
        </div>

        <div className="space-y-5 mb-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${benefit.gradient} backdrop-blur-sm rounded-2xl p-6 border-2 ${benefit.border} animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`benefit-card-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{benefit.emoji}</div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {benefit.title}
                  </h2>
                  <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-benefits"
          >
            Get my result and plan
          </button>
        </div>
      </div>
    </div>
  );
}
