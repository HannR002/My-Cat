import React, { useState } from 'react';
import {
  Search,
  Filter,
  Upload,
  Sparkles,
  Info,
  AlertTriangle,
  FolderOpen,
  Volume2,
} from 'lucide-react';
import { AudioItem, AudioCategory, AudioType, UserImportedAudioRecord } from '../types';
import { CATEGORIES } from '../data/bundledAudio';
import { useLanguage } from '../context/LanguageContext';
import { AudioCard } from '../components/audio/AudioCard';
import { AudioInfoModal } from '../components/audio/AudioInfoModal';
import { AudioImportModal } from '../components/audio/AudioImportModal';

interface SoundLibraryViewProps {
  catalog: AudioItem[];
  importedRecords: UserImportedAudioRecord[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onRefreshImports: () => void;
  onDeleteImported: (id: string) => void;
}

export const SoundLibraryView: React.FC<SoundLibraryViewProps> = ({
  catalog,
  importedRecords,
  favorites,
  onToggleFavorite,
  onRefreshImports,
  onDeleteImported,
}) => {
  const { language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalItem, setModalItem] = useState<AudioItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Map imported records into AudioItem structure
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
    audioUrl: '', // uses blobData
    source: r.source,
    artist: r.artist,
    license: r.license,
    hasFile: true,
    createdAt: r.createdAt,
  }));

  const combinedCatalog: AudioItem[] = [...catalog, ...mappedImportedItems];

  // Map blob lookups
  const blobMap = new Map<string, Blob>();
  importedRecords.forEach((r) => blobMap.set(r.id, r.blob));

  // Filter items
  const filteredItems = combinedCatalog.filter((item) => {
    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // Type filter
    if (selectedType !== 'all') {
      if (selectedType === 'real' && item.audioType !== 'real') return false;
      if (selectedType === 'ai' && item.audioType !== 'ai') return false;
      if (selectedType === 'imported' && item.audioType !== 'user_imported') return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch =
        item.description.id.toLowerCase().includes(q) ||
        item.description.en.toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }
    return true;
  });

  const activeCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {t.soundsTitle}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {t.soundsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{t.importAudioButton}</span>
        </button>
      </div>

      {/* Volume Guidance Box */}
      <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-orange-900">
        <Volume2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-normal">{t.volumeNotice}</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-xs text-gray-800 shadow-sm"
        />
      </div>

      {/* Category Pills (Horizontal scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
          }`}
        >
          {t.filterAll}
        </button>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              {cat.isDefensiveCategory && '⚠️ '}
              {language === 'id' ? cat.name.id : cat.name.en}
            </button>
          );
        })}
      </div>

      {/* Type Sub-filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-400 font-bold text-[10px] uppercase">
          {language === 'id' ? 'Tipe:' : 'Type:'}
        </span>
        <button
          onClick={() => setSelectedType('all')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            selectedType === 'all' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t.filterAllTypes}
        </button>
        <button
          onClick={() => setSelectedType('real')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            selectedType === 'real' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t.filterRealOnly}
        </button>
        <button
          onClick={() => setSelectedType('ai')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            selectedType === 'ai' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t.filterAiOnly}
        </button>
        {importedRecords.length > 0 && (
          <button
            onClick={() => setSelectedType('imported')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedType === 'imported' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t.filterUserImported} ({importedRecords.length})
          </button>
        )}
      </div>

      {/* Selected Category Header Banner if filtered */}
      {activeCategoryInfo && selectedCategory !== 'all' && (
        <div
          className={`p-4 rounded-2xl border ${activeCategoryInfo.badgeColor} space-y-1`}
        >
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black">
              {language === 'id' ? activeCategoryInfo.name.id : activeCategoryInfo.name.en}
            </h4>
            {activeCategoryInfo.isDefensiveCategory && (
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] font-bold">
                Animal Welfare Warning
              </span>
            )}
          </div>
          <p className="text-xs opacity-90">
            {language === 'id'
              ? activeCategoryInfo.subtitle.id
              : activeCategoryInfo.subtitle.en}
          </p>
        </div>
      )}

      {/* Audio Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 space-y-3">
          <FolderOpen className="w-10 h-10 text-orange-400 mx-auto" />
          <h4 className="text-sm font-bold text-gray-800">
            {t.emptyCategoryTitle}
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {t.emptyCategoryMsg}
          </p>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
          >
            {t.importAudioButton}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => (
            <AudioCard
              key={item.id}
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenInfo={setModalItem}
              onDeleteImported={onDeleteImported}
              audioBlob={blobMap.get(item.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AudioInfoModal item={modalItem} onClose={() => setModalItem(null)} />
      <AudioImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={onRefreshImports}
      />
    </div>
  );
};
