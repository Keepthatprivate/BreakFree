interface WaterBackgroundProps {
  chapter: number;
}

export default function WaterBackground({ chapter }: WaterBackgroundProps) {
  const getChapterClass = () => {
    switch (chapter) {
      case 1:
        return 'water-chapter-1';
      case 2:
        return 'water-chapter-2';
      case 3:
        return 'water-chapter-3';
      case 4:
        return 'water-chapter-4';
      default:
        return 'water-chapter-1';
    }
  };

  return (
    <div className={`water-background ${getChapterClass()}`} data-testid="water-background">
      <div className="water-layer water-layer-1"></div>
      <div className="water-layer water-layer-2"></div>
      <div className="water-layer water-layer-3"></div>
    </div>
  );
}
