import React, { useState } from 'react';
import { HeartHandshake, History, PlusCircle, ShieldCheck, Info } from 'lucide-react';
import { AudioItem, CatProfile, InteractionSession } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { InteractionWizard } from '../components/interaction/InteractionWizard';
import { InteractionHistoryList } from '../components/interaction/InteractionHistoryList';

interface InteractionViewProps {
  cats: CatProfile[];
  catalog: AudioItem[];
  interactions: InteractionSession[];
  onOpenAddCat: () => void;
  onRefreshInteractions: () => void;
  initialTab?: 'wizard' | 'history';
}

export const InteractionView: React.FC<InteractionViewProps> = ({
  cats,
  catalog,
  interactions,
  onOpenAddCat,
  onRefreshInteractions,
  initialTab = 'wizard',
}) => {
  const { language, t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'wizard' | 'history'>(initialTab);
  const [targetCatForHistory, setTargetCatForHistory] = useState<string | undefined>(undefined);

  // Filter out threatening / defensive sounds for feline welfare
  const eligibleSounds = catalog.filter((s) => !s.isDefensive);

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {t.interactTitle}
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {t.interactSubtitle}
        </p>
      </div>

      {/* Sub tabs: Mulai Interaksi vs Riwayat */}
      <div className="flex bg-orange-100/50 p-1 rounded-2xl border border-orange-200/50">
        <button
          onClick={() => setActiveSubTab('wizard')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'wizard'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{language === 'id' ? 'Panduan Interaksi' : 'Interaction Guide'}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'history'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>
            {t.interactStep6} ({interactions.length})
          </span>
        </button>
      </div>

      {activeSubTab === 'wizard' ? (
        <InteractionWizard
          cats={cats}
          eligibleSounds={eligibleSounds}
          onOpenAddCat={onOpenAddCat}
          onSessionSaved={onRefreshInteractions}
          onNavigateToHistory={(catId) => {
            setTargetCatForHistory(catId);
            setActiveSubTab('history');
          }}
        />
      ) : (
        <InteractionHistoryList
          sessions={interactions}
          cats={cats}
          onRefresh={onRefreshInteractions}
          initialCatId={targetCatForHistory}
        />
      )}
    </div>
  );
};
