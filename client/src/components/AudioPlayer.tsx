import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  label: string;
}

export default function AudioPlayer({ audioSrc, label }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6" data-testid="audio-player">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-primary hover-elevate active-elevate-2 flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0 transition-transform duration-200"
          data-testid="button-play-pause"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-primary-foreground fill-current" />
          ) : (
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
          )}
        </button>
        
        <div className="flex-1">
          <p className="text-lg font-semibold text-primary mb-2">{label}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-foreground/60 font-mono min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-primary/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary 
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer 
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
              data-testid="audio-progress"
            />
            <span className="text-xs text-foreground/60 font-mono min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-foreground/70 text-sm leading-relaxed">
        🎧 Put on headphones for the best experience
      </p>
    </div>
  );
}
