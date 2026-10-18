import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  Heart,
  Info,
  AlertTriangle,
  Sparkles,
  User,
  Trash2,
} from 'lucide-react';
import { AudioItem } from '../../types';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useLanguage } from '../../context/LanguageContext';
import { AnimalWelfareWarningModal } from './AnimalWelfareWarningModal';

interface AudioCardProps {
  item: AudioItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenInfo: (item: AudioItem) => void;
  onDeleteImported?: (id: string) => void;
  audioBlob?: Blob;
}

export const AudioCard: React.FC<AudioCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onOpenInfo,
  onDeleteImported,
  audioBlob,
}) => {
  const { language, t } = useLanguage();
  const {
    currentAudioId,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    play,
    stop,
    seek,
  } = useAudioPlayer();

  const [showWelfareWarning, setShowWelfareWarning] = useState(false);

  const isCurrent = currentAudioId === item.id;
  const itemIsPlaying = isCurrent && isPlaying;
  const itemIsLoading = isCurrent && isLoading;

  const progressPercent =
    isCurrent && (duration || item.duration) > 0
      ? Math.min(100, (currentTime / (duration || item.duration)) * 100)
      : 0;

  const handlePlayClick = () => {
    // If defensive category, warn first if not yet confirmed
    if (item.isDefensive && !itemIsPlaying) {
      setShowWelfareWarning(true);
      return;
    }
    executePlay();
  };

  const executePlay = () => {
    if (audioBlob) {
      play(item.id, audioBlob);
    } else {
      play(item.id, item.audioUrl);
    }
  };

  const desc = language === 'id' ? item.description.id : item.description.en;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <div
        className={`rounded-3xl p-4 sm:p-5 transition-all duration-200 border relative overflow-hidden bg-white shadow-sm hover:shadow-md ${
          isCurrent
            ? 'border-orange-400 ring-2 ring-orange-200'
            : item.isDefensive
            ? 'border-rose-200 bg-rose-50/30'
            : item.audioType === 'ai'
            ? 'border-purple-200 bg-purple-50/20'
            : 'border-orange-100 hover:border-orange-300'
        }`}
      >
        {/* Subtle top progress bar if currently playing */}
        {isCurrent && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-100">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Top Badges & Favorite button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Audio Type Badge */}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                item.audioType === 'real'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : item.audioType === 'ai'
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {item.audioType === 'real'
                ? t.realRecordingBadge
                : item.audioType === 'ai'
                ? t.aiSyntheticBadge
                : t.userImportedBadge}
            </span>

            {/* Defensive Warning Badge */}
            {item.isDefensive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Edu Only</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onDeleteImported && item.audioType === 'user_imported' && (
              <button
                onClick={() => onDeleteImported(item.id)}
                className="p-1.5 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                aria-label={`${t.deleteBtn} ${item.title}`}
                title={t.deleteBtn}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onOpenInfo(item)}
              className="p-1.5 rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
              aria-label={`${t.viewDetails} ${item.title}`}
              title={t.viewDetails}
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`p-1.5 rounded-full transition ${
                isFavorite
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-gray-50'
              }`}
              aria-label={
                isFavorite
                  ? `${t.removeFromFav} ${item.title}`
                  : `${t.addToFav} ${item.title}`
              }
              title={isFavorite ? t.removeFromFav : t.addToFav}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-extrabold text-gray-900 leading-snug mb-1">
          {item.title}
        </h4>

        {/* Short description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3.5 leading-relaxed font-normal">
          {desc}
        </p>

        {/* Player controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayClick}
              disabled={itemIsLoading}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm transition active:scale-90 ${
                item.isDefensive
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : item.audioType === 'ai'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'
              }`}
              aria-label={itemIsPlaying ? 'Pause' : 'Play ' + item.title}
            >
              {itemIsLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : itemIsPlaying ? (
                <Pause className="w-5 h-5 fill-white stroke-none" />
              ) : (
                <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
              )}
            </button>

            {isCurrent && (
              <button
                onClick={stop}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition active:scale-95"
                aria-label="Stop"
                title="Stop"
              >
                <Square className="w-4 h-4 fill-gray-700 stroke-none" />
              </button>
            )}

            <div className="text-xs">
              <span className="font-bold text-gray-800">
                {isCurrent ? formatTime(currentTime) : '0:00'}
              </span>
              <span className="text-gray-400 font-medium">
                {' '}
                / {formatTime(item.duration)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-500 font-medium block truncate max-w-[130px]">
              {item.artist}
            </span>
            <span className="text-[9px] text-gray-400 font-mono block">
              {item.license.length > 15 ? item.license.slice(0, 15) + '…' : item.license}
            </span>
          </div>
        </div>

        {/* Interactive scrubber if active */}
        {isCurrent && (
          <div className="mt-2.5 pt-1">
            <input
              type="range"
              min={0}
              max={duration || item.duration || 1}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              aria-label="Playback seek scrubber"
            />
          </div>
        )}
      </div>

      {/* Animal welfare warning modal for defensive sounds */}
      <AnimalWelfareWarningModal
        isOpen={showWelfareWarning}
        onConfirm={() => {
          setShowWelfareWarning(false);
          executePlay();
        }}
        onCancel={() => setShowWelfareWarning(false)}
      />
    </>
  );
};
