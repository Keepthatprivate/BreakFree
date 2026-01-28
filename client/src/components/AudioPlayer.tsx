import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  label: string;
}

// Memoized AudioPlayer to prevent unnecessary re-renders (INP optimization)
const AudioPlayer = memo(function AudioPlayer({ audioSrc, label }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Throttled time update using RAF - prevents excessive re-renders (INP optimization)
  const updateTimeThrottled = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const now = performance.now();
    // Only update state every 250ms to reduce re-renders
    if (now - lastUpdateRef.current >= 250) {
      setCurrentTime(audio.currentTime);
      lastUpdateRef.current = now;
    }

    rafRef.current = requestAnimationFrame(updateTimeThrottled);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration);
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);

      // Cancel RAF on cleanup
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Pause audio on cleanup
      audio.pause();
    };
  }, [audioSrc]);

  // Start/stop RAF-based time updates based on playing state
  useEffect(() => {
    if (isPlaying) {
      lastUpdateRef.current = performance.now();
      rafRef.current = requestAnimationFrame(updateTimeThrottled);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, updateTimeThrottled]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      // Update time immediately when pausing
      setCurrentTime(audio.currentTime);
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-3 sm:p-6" data-testid="audio-player">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary hover-elevate active-elevate-2 flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0 transition-transform duration-200"
          data-testid="button-play-pause"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground fill-current" />
          ) : (
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-lg font-semibold text-primary mb-1 sm:mb-2 truncate">{label}</p>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-foreground/60 font-mono min-w-[32px] sm:min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 sm:h-2 bg-primary/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 sm:[&::-moz-range-thumb]:w-4 sm:[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
              data-testid="audio-progress"
            />
            <span className="text-[10px] sm:text-xs text-foreground/60 font-mono min-w-[32px] sm:min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed hidden sm:block">
        Put on headphones for the best experience
      </p>
    </div>
  );
});

export default AudioPlayer;
