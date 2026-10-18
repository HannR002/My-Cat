/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { AudioPlayerBar } from './components/audio/AudioPlayerBar';
import { AudioInfoModal } from './components/audio/AudioInfoModal';
import { CatProfileModal } from './components/profile/CatProfileModal';
import { ConfirmModal } from './components/common/ConfirmModal';

import { HomeView } from './views/HomeView';
import { SoundLibraryView } from './views/SoundLibraryView';
import { InteractionView } from './views/InteractionView';
import { AcademyView } from './views/AcademyView';
import { MyCatsView } from './views/MyCatsView';
import { FavoritesView } from './views/FavoritesView';
import { SettingsView } from './views/SettingsView';

import { BUNDLED_AUDIO } from './data/bundledAudio';
import { dbService } from './services/db';
import { audioPlayer } from './services/audioPlayer';
import { CatProfile, InteractionSession, UserImportedAudioRecord, AudioItem } from './types';

function MainApp() {
  const { language, t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavTab | null;
      if (tabParam && ['home', 'sounds', 'interact', 'academy', 'mycats', 'favorites', 'settings'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'home';
  });

  const [cats, setCats] = useState<CatProfile[]>([]);
  const [interactions, setInteractions] = useState<InteractionSession[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [importedRecords, setImportedRecords] = useState<UserImportedAudioRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [infoModalItem, setInfoModalItem] = useState<AudioItem | null>(null);
  const [audioToDeleteId, setAudioToDeleteId] = useState<string | null>(null);

  // Load all local data from IndexedDB
  const loadAllData = useCallback(async () => {
    try {
      const [catsData, interactionsData, favsData, importedData] = await Promise.all([
        dbService.getAllCats(),
        dbService.getAllInteractions(),
        dbService.getFavoriteIds(),
        dbService.getAllImportedAudio(),
      ]);
      setCats(catsData);
      setInteractions(interactionsData);
      setFavorites(favsData);
      setImportedRecords(importedData);
    } catch (e) {
      console.error('Failed to load local database:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Register centralized audio source resolver for the entire app
    audioPlayer.setSourceResolver(async (audioId: string) => {
      // 1. Check bundled audio catalog
      const bundled = BUNDLED_AUDIO.find((b) => b.id === audioId);
      if (bundled && bundled.audioUrl) {
        return bundled.audioUrl;
      }
      // 2. Check user imported audio in IndexedDB
      const imports = await dbService.getAllImportedAudio();
      const rec = imports.find((i) => i.id === audioId);
      if (rec && rec.blob) {
        return rec.blob;
      }
      return null;
    });

    loadAllData();
  }, [loadAllData]);

  // Toggle favorite
  const handleToggleFavorite = async (audioId: string) => {
    await dbService.toggleFavorite(audioId);
    const updatedFavs = await dbService.getFavoriteIds();
    setFavorites(updatedFavs);
  };

  // Delete user imported audio
  const handleDeleteImported = (id: string) => {
    setAudioToDeleteId(id);
  };

  const confirmDeleteImported = async () => {
    if (!audioToDeleteId) return;
    await dbService.deleteImportedAudio(audioToDeleteId);
    setAudioToDeleteId(null);
    loadAllData();
  };

  // Save new cat profile
  const handleSaveCat = async (newCat: CatProfile) => {
    await dbService.saveCat(newCat);
    loadAllData();
  };

  // Navigate to interact for specific cat
  const handleNavigateToInteract = (catId: string) => {
    setCurrentTab('interact');
  };

  // Combined catalog for bottom audio player
  const mappedImported: AudioItem[] = importedRecords.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    description: { id: r.description, en: r.description },
    educationalNote: { id: r.description, en: r.description },
    audioType: r.audioType === 'ai' ? 'ai' : 'user_imported',
    duration: r.duration,
    audioUrl: '',
    source: r.source,
    artist: r.artist,
    license: r.license,
    hasFile: true,
  }));
  const fullCatalog: AudioItem[] = [...BUNDLED_AUDIO, ...mappedImported];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-800 flex flex-col font-sans selection:bg-orange-200">
      <OfflineBanner />
      <Header
        onNavigateToFavorites={() => setCurrentTab('favorites')}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => setCurrentTab(tab)}
            catalog={fullCatalog}
            cats={cats}
            interactions={interactions}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenInfo={setInfoModalItem}
          />
        )}

        {currentTab === 'sounds' && (
          <SoundLibraryView
            catalog={BUNDLED_AUDIO}
            importedRecords={importedRecords}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onRefreshImports={loadAllData}
            onDeleteImported={handleDeleteImported}
          />
        )}

        {currentTab === 'interact' && (
          <InteractionView
            cats={cats}
            catalog={fullCatalog}
            interactions={interactions}
            onOpenAddCat={() => setIsAddCatModalOpen(true)}
            onRefreshInteractions={loadAllData}
          />
        )}

        {currentTab === 'academy' && <AcademyView />}

        {currentTab === 'mycats' && (
          <MyCatsView
            cats={cats}
            interactions={interactions}
            onRefreshCats={loadAllData}
            onNavigateToInteract={handleNavigateToInteract}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesView
            catalog={BUNDLED_AUDIO}
            importedRecords={importedRecords}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToSounds={() => setCurrentTab('sounds')}
            onDeleteImported={handleDeleteImported}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView onRefreshAllData={loadAllData} />
        )}
      </main>

      {/* Global floating mini audio player bar when sound is active */}
      <AudioPlayerBar catalog={fullCatalog} />

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        favoritesCount={favorites.length}
      />

      {/* Cat creation modal */}
      <CatProfileModal
        isOpen={isAddCatModalOpen}
        onClose={() => setIsAddCatModalOpen(false)}
        onSave={handleSaveCat}
      />

      {/* Audio Info modal */}
      <AudioInfoModal
        item={infoModalItem}
        onClose={() => setInfoModalItem(null)}
      />

      {/* Delete Imported Audio Confirmation */}
      <ConfirmModal
        isOpen={!!audioToDeleteId}
        title={language === 'id' ? 'Hapus Rekaman Audio' : 'Delete Audio Recording'}
        message={
          language === 'id'
            ? 'Hapus berkas rekaman ini dari penyimpanan lokal peramban Anda?'
            : 'Delete this audio recording from your browser local storage?'
        }
        confirmText={language === 'id' ? 'Hapus' : 'Delete'}
        cancelText={language === 'id' ? 'Batal' : 'Cancel'}
        isDanger={true}
        onConfirm={confirmDeleteImported}
        onCancel={() => setAudioToDeleteId(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
