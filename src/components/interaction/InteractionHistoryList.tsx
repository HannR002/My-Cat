import React, { useState } from 'react';
import { Trash2, Calendar, Cat, Filter, Info, AlertTriangle } from 'lucide-react';
import { InteractionSession, CatProfile, CatReaction } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { dbService } from '../../services/db';

interface InteractionHistoryListProps {
  sessions: InteractionSession[];
  cats: CatProfile[];
  onRefresh: () => void;
  initialCatId?: string;
}

export const InteractionHistoryList: React.FC<InteractionHistoryListProps> = ({
  sessions,
  cats,
  onRefresh,
  initialCatId,
}) => {
  const { language, t } = useLanguage();
  const [filterCatId, setFilterCatId] = useState<string>(initialCatId || 'all');

  const filteredSessions = sessions.filter((s) =>
    filterCatId === 'all' ? true : s.catId === filterCatId
  );

  const handleDelete = async (id: string) => {
    if (confirm(t.deleteSessionConfirm)) {
      await dbService.deleteInteraction(id);
      onRefresh();
    }
  };

  const getReactionLabel = (rx: CatReaction) => {
    switch (rx) {
      case 'approaching':
        return { label: t.reactionApproaching, icon: '🐾', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'attentive':
        return { label: t.reactionAttentive, icon: '👀', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'meowing_back':
        return { label: t.reactionMeowingBack, icon: '🗣️', color: 'bg-orange-50 text-orange-800 border-orange-200' };
      case 'no_response':
        return { label: t.reactionNoResponse, icon: '😴', color: 'bg-gray-100 text-gray-700 border-gray-200' };
      case 'moving_away':
        return { label: t.reactionMovingAway, icon: '🚶', color: 'bg-stone-100 text-stone-700 border-stone-200' };
      case 'fear_distress':
        return { label: t.reactionFearDistress, icon: '⚠️', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: t.reactionOther, icon: '✨', color: 'bg-purple-50 text-purple-800 border-purple-200' };
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-extrabold text-gray-900">
            {t.historyTitle}
          </h4>
          <span className="text-xs text-gray-500 font-medium">
            {filteredSessions.length} {language === 'id' ? 'catatan observasi' : 'observation logs'}
          </span>
        </div>

        {cats.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterCatId}
              onChange={(e) => setFilterCatId(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Filter berdasarkan kucing"
            >
              <option value="all">{language === 'id' ? 'Semua Kucing' : 'All Cats'}</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Honest Scientific Disclaimer */}
      <div className="p-3 bg-orange-50/60 border border-orange-200/80 rounded-2xl text-[11px] text-orange-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-normal">{t.historyDisclaimer}</p>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-xs text-gray-500">
          <Cat className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p>{t.emptyHistory}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredSessions.map((item) => {
            const rx = getReactionLabel(item.reaction);
            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:border-orange-200"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-gray-900">
                      🐱 {item.catName}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                      🔊 {item.soundTitle}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${rx.color}`}
                    >
                      <span>{rx.icon}</span>
                      <span>{rx.label}</span>
                    </span>

                    {item.stoppedEarlyDueToDistress && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{language === 'id' ? 'Dihentikan Demi Kesejahteraan' : 'Ended for Welfare'}</span>
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100 font-normal leading-relaxed mt-1">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end flex-shrink-0">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    aria-label="Hapus catatan sesi ini"
                    title={t.deleteBtn}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
