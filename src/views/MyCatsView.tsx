import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Cat, HeartHandshake, Calendar } from 'lucide-react';
import { CatProfile, InteractionSession } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CatProfileModal } from '../components/profile/CatProfileModal';
import { dbService } from '../services/db';

interface MyCatsViewProps {
  cats: CatProfile[];
  interactions: InteractionSession[];
  onRefreshCats: () => void;
  onNavigateToInteract: (catId: string) => void;
}

export const MyCatsView: React.FC<MyCatsViewProps> = ({
  cats,
  interactions,
  onRefreshCats,
  onNavigateToInteract,
}) => {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catToEdit, setCatToEdit] = useState<CatProfile | null>(null);

  const handleSaveCat = async (cat: CatProfile) => {
    await dbService.saveCat(cat);
    onRefreshCats();
  };

  const handleDeleteCat = async (id: string, name: string) => {
    if (confirm(`${t.deleteCatConfirm} (${name})`)) {
      await dbService.deleteCat(id);
      onRefreshCats();
    }
  };

  const getCatAvatarElement = (avatar: string) => {
    if (avatar.startsWith('data:image')) {
      return (
        <img
          src={avatar}
          alt="Cat Photo"
          className="w-14 h-14 rounded-2xl object-cover border border-orange-200"
        />
      );
    }
    const emojiMap: Record<string, string> = {
      cat_orange: '🐱',
      cat_calico: '🐈',
      cat_tuxedo: '🐾',
      cat_siamese: '✨',
      cat_white: '🤍',
      cat_gray: '🩶',
    };
    return (
      <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-3xl">
        {emojiMap[avatar] || '🐱'}
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Title & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {t.myCatsTitle}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {t.myCatsSubtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setCatToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewCat}</span>
        </button>
      </div>

      {/* Cat List */}
      {cats.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 space-y-3">
          <Cat className="w-10 h-10 text-orange-400 mx-auto" />
          <h4 className="text-sm font-bold text-gray-800">{t.noCatsYet}</h4>
          <button
            onClick={() => {
              setCatToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
          >
            {t.addNewCatPrompt}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {cats.map((cat) => {
            const catSessions = interactions.filter((s) => s.catId === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm hover:border-orange-300 transition flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  {getCatAvatarElement(cat.avatar)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-black text-gray-900 truncate">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCatToEdit(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          aria-label={t.editCat}
                          title={t.editCat}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat.id, cat.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          aria-label={t.deleteCat}
                          title={t.deleteCat}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-medium">
                      {cat.breed} • {cat.ageYears} {language === 'id' ? 'tahun' : 'years'}{' '}
                      {cat.ageMonths ? `${cat.ageMonths} ${language === 'id' ? 'bln' : 'mos'}` : ''}
                    </p>

                    <div className="mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {cat.gender === 'male'
                          ? t.genderMale
                          : cat.gender === 'female'
                          ? t.genderFemale
                          : t.genderUnknown}
                      </span>
                    </div>
                  </div>
                </div>

                {cat.notes && (
                  <p className="text-xs text-gray-600 bg-orange-50/40 p-2.5 rounded-xl border border-orange-100/60 italic leading-relaxed font-normal">
                    "{cat.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    {catSessions.length} {language === 'id' ? 'sesi observasi' : 'sessions logged'}
                  </span>
                  <button
                    onClick={() => onNavigateToInteract(cat.id)}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 active:scale-95 transition"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{language === 'id' ? 'Mulai Interaksi' : 'Interact'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CatProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCat}
        catToEdit={catToEdit}
      />
    </div>
  );
};
