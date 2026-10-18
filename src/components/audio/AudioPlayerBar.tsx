import React from 'react';
import { Play, Pause, Square, Volume2, X } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { AudioItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AudioPlayerBarProps {
  catalog: AudioItem[];
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ catalog }) => {
  const { currentAudioId, isPlaying, isLoading, error, currentTime, duration, play, resume, pause, stop } =
    useAudioPlayer();
  const { t, language } = useLanguage();

  if (!currentAudioId) return null;

  const currentItem = catalog.find((i) => i.id === currentAudioId);
  if (!currentItem) return null;

  const progressPercent =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-20 px-3 pb-1 pointer-events-none">
      <div className="max-w-md mx-auto bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-xl border border-gray-800 pointer-events-auto flex items-center justify-between gap-3 animate-slideUp">
        {/* Play/Pause */}
        <button
          onClick={() => (isPlaying ? pause() : resume())}
          disabled={isLoading}
          className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center flex-shrink-0 transition active:scale-95 shadow-sm"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 fill-white stroke-none" />
          ) : (
            <Play className="w-4 h-4 fill-white stroke-none ml-0.5" />
          )}
        </button>

        {/* Track Info & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h5 className="text-xs font-bold truncate text-white">
              {currentItem.title}
            </h5>
            <span className="text-[10px] font-mono flex-shrink-0">
              {error ? (
                <span className="text-rose-400 font-sans font-bold">
                  {language === 'id' ? 'Gagal memuat' : 'Load failed'}
                </span>
              ) : (
                <span className="text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration || currentItem.duration)}
                </span>
              )}
            </span>
          </div>

          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                error ? 'bg-rose-500' : 'bg-orange-500'
              }`}
              style={{ width: error ? '100%' : `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stop and close */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={stop}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            aria-label="Stop playback"
            title="Stop"
          >
            <Square className="w-4 h-4 fill-current stroke-none" />
          </button>
        </div>
      </div>
    </div>
  );
};
