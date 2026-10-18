import React, { useState } from 'react';
import {
  HeartHandshake,
  Play,
  Pause,
  Square,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  Cat as CatIcon,
  Check,
} from 'lucide-react';
import { AudioItem, CatProfile, CatReaction, InteractionSession } from '../../types';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useLanguage } from '../../context/LanguageContext';
import { dbService } from '../../services/db';

interface InteractionWizardProps {
  cats: CatProfile[];
  eligibleSounds: AudioItem[];
  onOpenAddCat: () => void;
  onSessionSaved: () => void;
  onNavigateToHistory: (catId?: string) => void;
}

export const InteractionWizard: React.FC<InteractionWizardProps> = ({
  cats,
  eligibleSounds,
  onOpenAddCat,
  onSessionSaved,
  onNavigateToHistory,
}) => {
  const { language, t } = useLanguage();
  const { currentAudioId, isPlaying, play, pause, stop } = useAudioPlayer();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCatId, setSelectedCatId] = useState<string>(cats[0]?.id || '');
  const [selectedSoundId, setSelectedSoundId] = useState<string>(eligibleSounds[0]?.id || '');
  const [selectedReaction, setSelectedReaction] = useState<CatReaction>('attentive');
  const [notes, setNotes] = useState('');
  const [savedSession, setSavedSession] = useState<InteractionSession | null>(null);

  const selectedCat = cats.find((c) => c.id === selectedCatId) || cats[0];
  const selectedSound = eligibleSounds.find((s) => s.id === selectedSoundId) || eligibleSounds[0];

  const reactionsList: { id: CatReaction; label: string; icon: string; isDistress?: boolean }[] = [
    { id: 'approaching', label: t.reactionApproaching, icon: '🐾' },
    { id: 'attentive', label: t.reactionAttentive, icon: '👀' },
    { id: 'meowing_back', label: t.reactionMeowingBack, icon: '🗣️' },
    { id: 'no_response', label: t.reactionNoResponse, icon: '😴' },
    { id: 'moving_away', label: t.reactionMovingAway, icon: '🚶' },
    { id: 'fear_distress', label: t.reactionFearDistress, icon: '⚠️', isDistress: true },
    { id: 'other', label: t.reactionOther, icon: '✨' },
  ];

  const isDistressSelected = selectedReaction === 'fear_distress';

  const handleSaveSession = async (stopEarly: boolean = false) => {
    if (!selectedCat || !selectedSound) return;

    // Stop audio
    stop();

    const session: InteractionSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      catId: selectedCat.id,
      catName: selectedCat.name,
      soundId: selectedSound.id,
      soundTitle: selectedSound.title,
      timestamp: Date.now(),
      reaction: selectedReaction,
      notes: notes.trim(),
      stoppedEarlyDueToDistress: stopEarly || isDistressSelected,
    };

    await dbService.saveInteraction(session);
    setSavedSession(session);
    setStep(5);
    onSessionSaved();
  };

  const resetWizard = () => {
    stop();
    setStep(1);
    setSelectedReaction('attentive');
    setNotes('');
    setSavedSession(null);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-orange-100">
      {/* Progress tracker */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step === stepNum
                  ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                  : step > stepNum
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > stepNum ? <Check className="w-4 h-4 text-white stroke-[2.5]" /> : stepNum}
            </div>
            {stepNum < 4 && (
              <div
                className={`h-1 flex-1 mx-2 rounded-full ${
                  step > stepNum ? 'bg-emerald-400' : 'bg-gray-100'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1: SELECT CAT */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              {t.interactStep1}
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">
              {language === 'id' ? 'Siapa Kucing yang Diamati?' : 'Which Cat Are You Observing?'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'id'
                ? 'Pilih profil kucing agar riwayat reaksi tersimpan rapi.'
                : 'Select a cat profile to personalize observations.'}
            </p>
          </div>

          {cats.length === 0 ? (
            <div className="p-6 text-center bg-orange-50/50 rounded-2xl border border-dashed border-orange-200">
              <CatIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 mb-3">{t.noCatsYet}</p>
              <button
                onClick={onOpenAddCat}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition"
              >
                {t.addNewCatPrompt}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cats.map((cat) => {
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-200 font-bold'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                      🐱
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{cat.name}</h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {cat.breed} • {cat.ageYears} {language === 'id' ? 'thn' : 'yrs'}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-orange-600 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-3 flex justify-between items-center">
            <button
              onClick={onOpenAddCat}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline"
            >
              {t.addNewCatPrompt}
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedCat}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>{language === 'id' ? 'Lanjut: Pilih Suara' : 'Next: Select Sound'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT SOUND */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              {t.interactStep2}
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">
              {language === 'id' ? 'Pilih Suara untuk Diperdengarkan' : 'Select Sound to Play'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {t.chooseSoundInstruction}
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {eligibleSounds.map((snd) => {
              const isSelected = selectedSoundId === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => setSelectedSoundId(snd.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-orange-600">
                      {snd.audioType === 'real' ? t.realRecordingBadge : t.aiSyntheticBadge}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 truncate">{snd.title}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {language === 'id' ? snd.description.id : snd.description.en}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                    {snd.duration}s
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              {language === 'id' ? '← Kembali' : '← Back'}
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedSound}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>{language === 'id' ? 'Lanjut: Putar & Amati' : 'Next: Play & Observe'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PLAY & OBSERVE */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              {t.interactStep3}
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">
              {language === 'id' ? 'Putar dengan Lembut & Amati' : 'Play Gently & Observe'}
            </h3>
          </div>

          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2 text-xs text-orange-900">
            <div className="flex items-start gap-2 font-bold">
              <Volume2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>{t.startQuietGuidance}</span>
            </div>
            <p className="text-[11px] text-orange-800 leading-relaxed font-normal">
              {t.observeHonestNotice}
            </p>
          </div>

          {/* Sound Card in Wizard */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                {language === 'id' ? 'Target Kucing:' : 'Target Cat:'}{' '}
                <strong className="text-gray-700">{selectedCat?.name}</strong>
              </span>
              <h4 className="text-base font-extrabold text-gray-900 truncate">
                {selectedSound?.title}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  currentAudioId === selectedSound?.id && isPlaying
                    ? pause()
                    : play(selectedSound.id, selectedSound.audioUrl)
                }
                className="w-12 h-12 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-md shadow-orange-600/20 active:scale-95 transition"
                aria-label="Putar Suara Interaksi"
              >
                {currentAudioId === selectedSound?.id && isPlaying ? (
                  <Pause className="w-5 h-5 fill-white stroke-none" />
                ) : (
                  <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
                )}
              </button>
              {currentAudioId === selectedSound?.id && (
                <button
                  onClick={stop}
                  className="p-3 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-700"
                  aria-label="Stop"
                >
                  <Square className="w-4 h-4 fill-gray-700 stroke-none" />
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              onClick={() => {
                stop();
                setStep(2);
              }}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              {language === 'id' ? '← Kembali' : '← Back'}
            </button>
            <button
              onClick={() => {
                stop();
                setStep(4);
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>{language === 'id' ? 'Lanjut: Catat Reaksi' : 'Next: Record Reaction'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RECORD REACTION */}
      {step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              {t.interactStep4}
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">
              {t.howDidCatReact}
            </h3>
          </div>

          <div className="space-y-2">
            {reactionsList.map((rx) => {
              const isSelected = selectedReaction === rx.id;
              return (
                <button
                  key={rx.id}
                  onClick={() => setSelectedReaction(rx.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                    isSelected
                      ? rx.isDistress
                        ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-200'
                        : 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{rx.icon}</span>
                    <span className="text-xs">{rx.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Distress alert if user notes distress */}
          {isDistressSelected && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-rose-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{language === 'id' ? 'Peringatan Kesejahteraan Kucing' : 'Feline Comfort Warning'}</span>
              </div>
              <p className="leading-relaxed">{t.distressRecommendation}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.optionalNotes}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Menoleh cepat lalu mengedipkan mata perlahan."
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-between items-center gap-2">
            <button
              onClick={() => setStep(3)}
              className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              {language === 'id' ? '← Kembali' : '← Back'}
            </button>

            {isDistressSelected ? (
              <button
                onClick={() => handleSaveSession(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
              >
                {t.stopAndSaveDistress}
              </button>
            ) : (
              <button
                onClick={() => handleSaveSession(false)}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition active:scale-95"
              >
                {t.interactStep5}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: SESSION SAVED SUCCESS */}
      {step === 5 && (
        <div className="py-6 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {t.saveSessionSuccess}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {language === 'id'
                ? `Catatan reaksi ${savedSession?.catName} telah disimpan secara lokal.`
                : `Reaction log for ${savedSession?.catName} stored in local IndexedDB.`}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xs mx-auto">
            <button
              onClick={resetWizard}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              {t.repeatInteractionBtn}
            </button>
            <button
              onClick={() => onNavigateToHistory(selectedCat?.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
            >
              {t.viewHistoryBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
