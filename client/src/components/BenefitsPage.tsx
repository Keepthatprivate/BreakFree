interface BenefitsPageProps {
  onContinue: () => void;
}

export default function BenefitsPage({ onContinue }: BenefitsPageProps) {
  const benefits = [
    {
      emoji: '🧠',
      title: 'Improved Emotional Well-being:',
      description: 'Experience significant improvements in your emotional well-being. Gain tools and strategies to manage triggers, regulate emotions, and foster resilience, leading to greater peace and happiness.',
      iconBg: 'bg-gradient-to-br from-pink-400 to-purple-400'
    },
    {
      emoji: '💑',
      title: 'Enhanced Relationships:',
      description: 'Heal childhood trauma to deepen understanding of your emotions and behaviors. Improve communication and empathy, fostering healthier connections with loved ones and greater intimacy.',
      iconBg: 'bg-gradient-to-br from-pink-400 to-fuchsia-500'
    },
    {
      emoji: '🌸',
      title: 'Increased Self-Empowerment:',
      description: 'Reclaim your life and foster personal growth. Gain control over experiences, break free from limiting beliefs, and cultivate self-worth and empowerment for a more fulfilling, trauma-free life.',
      iconBg: 'bg-gradient-to-br from-blue-400 to-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            How can 28-day Childhood Trauma healing plan help you:
          </h1>
        </div>

        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-5 border border-card-border/20 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`benefit-card-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className={`${benefit.iconBg} rounded-2xl p-3 flex-shrink-0 shadow-lg`}>
                  <div className="text-3xl">{benefit.emoji}</div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    {benefit.title}
                  </h2>
                  <p className="text-foreground/70 text-sm leading-snug">
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
