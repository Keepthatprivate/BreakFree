interface AgeIndicatorProps {
  age: number;
}

export default function AgeIndicator({ age }: AgeIndicatorProps) {
  return (
    <div 
      className="fixed top-6 left-6 z-40 animate-in fade-in duration-700"
      data-testid="age-indicator"
      key={age} // Force re-render and re-animation on age change
    >
      <div className="text-sm font-medium text-white/40 tracking-wider">
        AGE {age}
      </div>
    </div>
  );
}
