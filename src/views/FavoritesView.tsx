import React, { useState } from 'react';
import { Heart, Volume2, ArrowRight } from 'lucide-react';
import { AudioItem, UserImportedAudioRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { AudioCard } from '../components/audio/AudioCard';
import { AudioInfoModal } from '../components/audio/AudioInfoModal';
import { NavTab } from '../components/layout/BottomNav';

interface FavoritesViewProps {
  catalog: AudioItem[];
  importedRecords: UserImportedAudioRecord[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigateToSounds: () => void;
  onDeleteImported: (id: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  catalog,
  importedRecords,
  favorites,
  onToggleFavorite,
  onNavigateToSounds,
  onDeleteImported,
}) => {
  const { language, t } = useLanguage();
  const [modalItem, setModalItem] = useState<AudioItem | null>(null);

  // Map imported items
  const mappedImportedItems: AudioItem[] = importedRecords.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    description: { id: r.description, en: r.description },
    educationalNote: {
      id: `Audio impor pengguna: ${r.description}`,
      en: `User imported recording: ${r.description}`,
    },
    audioType: r.audioType === 'ai' ? 'ai' : 'user_imported',
    duration: r.duration,
    audioUrl: '',
    source: r.source,
    artist: r.artist,
    license: r.license,
    hasFile: true,
  }));

  const allItems = [...catalog, ...mappedImportedItems];
  const favoriteItems = allItems.filter((i) => favorites.includes(i.id));

  const blobMap = new Map<string, Blob>();
  importedRecords.forEach((r) => blobMap.set(r.id, r.blob));

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <span>{t.favoritesTitle}</span>
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {t.favoritesSubtitle}
        </p>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 space-y-3">
          <Heart className="w-10 h-10 text-rose-300 mx-auto" />
          <h4 className="text-sm font-bold text-gray-800">
            {t.emptyFavoritesTitle}
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {t.emptyFavoritesMsg}
          </p>
          <button
            onClick={onNavigateToSounds}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition inline-flex items-center gap-1.5"
          >
            <span>{t.exploreSoundsAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {favoriteItems.map((item) => (
            <AudioCard
              key={item.id}
              item={item}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onOpenInfo={setModalItem}
              onDeleteImported={onDeleteImported}
              audioBlob={blobMap.get(item.id)}
            />
          ))}
        </div>
      )}

      <AudioInfoModal item={modalItem} onClose={() => setModalItem(null)} />
    </div>
  );
};
