import React from 'react';
import {
  Volume2,
  HeartHandshake,
  BookOpen,
  Cat,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Heart,
  Play,
  Pause,
  AlertTriangle,
} from 'lucide-react';
import { AudioItem, CatProfile, InteractionSession } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { NavTab } from '../components/layout/BottomNav';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  catalog: AudioItem[];
  cats: CatProfile[];
  interactions: InteractionSession[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenInfo: (item: AudioItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  catalog,
  cats,
  interactions,
  favorites,
  onToggleFavorite,
  onOpenInfo,
}) => {
  const { language, t } = useLanguage();
  const { currentAudioId, isPlaying, play, pause } = useAudioPlayer();

  // Quick soundboard selections (safe, friendly vocalizations)
  const quickSounds = catalog
    .filter((s) => !s.isDefensive)
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white p-6 sm:p-8 shadow-lg shadow-orange-500/20">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Connect, Play & Understand</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            {t.homeGreeting}
          </h2>

          <p className="text-orange-50 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
            {t.homeHeroSubtitle}
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('sounds')}
              className="px-4 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.homeExploreSounds}</span>
            </button>
            <button
              onClick={() => onNavigate('interact')}
              className="px-4 py-2.5 rounded-2xl bg-orange-950/30 hover:bg-orange-950/40 text-white text-xs font-black border border-white/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{t.homeStartInteraction}</span>
            </button>
          </div>
        </div>

        {/* Decorative background paw / cat illustration */}
        <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none text-9xl">
          🐱
        </div>
      </div>

      {/* Animal Welfare Principle Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-4 flex items-start gap-3.5 text-amber-900 shadow-sm">
        <div className="p-2 bg-amber-100 rounded-2xl text-amber-700 flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="text-xs leading-relaxed">
          <h4 className="font-bold text-amber-950 mb-0.5">
            {language === 'id' ? 'Komitmen Kesejahteraan Hewan' : 'Animal Welfare Commitment'}
          </h4>
          <p className="text-amber-800 font-normal">
            {t.homeWelfareBadge}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate('mycats')}
          className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm text-left hover:border-orange-300 transition"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {t.navMyCats}
          </span>
          <span className="text-xl font-black text-gray-900 block mt-0.5">
            {cats.length}
          </span>
          <span className="text-[10px] text-orange-600 font-semibold flex items-center gap-0.5 mt-1">
            <span>Kelola</span> →
          </span>
        </button>

        <button
          onClick={() => onNavigate('interact')}
          className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm text-left hover:border-orange-300 transition"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {language === 'id' ? 'Sesi Interaksi' : 'Interaction Logs'}
          </span>
          <span className="text-xl font-black text-gray-900 block mt-0.5">
            {interactions.length}
          </span>
          <span className="text-[10px] text-orange-600 font-semibold flex items-center gap-0.5 mt-1">
            <span>Sesi</span> →
          </span>
        </button>

        <button
          onClick={() => onNavigate('favorites')}
          className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm text-left hover:border-orange-300 transition"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {t.navFavorites}
          </span>
          <span className="text-xl font-black text-rose-600 block mt-0.5">
            {favorites.length}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-0.5 mt-1">
            <span>Daftar</span> →
          </span>
        </button>
      </div>

      {/* Quick Play Soundboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-600" />
            <h3 className="text-base font-extrabold text-gray-900">
              {t.homeQuickSoundboard}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('sounds')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>{language === 'id' ? 'Lihat Semua' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickSounds.map((snd) => {
            const isThisPlaying = currentAudioId === snd.id && isPlaying;
            return (
              <div
                key={snd.id}
                className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between gap-3 hover:border-orange-300 transition"
              >
                <button
                  onClick={() =>
                    isThisPlaying ? pause() : play(snd.id, snd.audioUrl)
                  }
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition active:scale-95 shadow-sm flex-shrink-0 ${
                    isThisPlaying
                      ? 'bg-amber-600'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                  aria-label={isThisPlaying ? 'Pause' : 'Play ' + snd.title}
                >
                  {isThisPlaying ? (
                    <Pause className="w-4 h-4 fill-white stroke-none" />
                  ) : (
                    <Play className="w-4 h-4 fill-white stroke-none ml-0.5" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {snd.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {language === 'id' ? snd.description.id : snd.description.en}
                  </p>
                </div>

                <button
                  onClick={() => onOpenInfo(snd)}
                  className="p-1.5 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition"
                  aria-label="Info"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Cat Education Feature */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-teal-800 font-extrabold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>{t.homeDailyTipTitle}</span>
        </div>
        <h4 className="text-sm font-black text-teal-950 mb-1.5">
          {language === 'id'
            ? 'Aturan 3 Detik Saat Menyentuh Kucing'
            : 'The 3-Second Rule When Petting Cats'}
        </h4>
        <p className="text-xs text-teal-900/80 leading-relaxed font-normal mb-3">
          {language === 'id'
            ? 'Beri jeda setelah 3 detik membelai kucing. Jika kucing mendekat lagi dan menggosokkan dagunya, ia menikmati sentuhan Anda. Jika ia bergeming atau mengibas ekor, hargai batasnya dan berhenti.'
            : 'Pause after 3 seconds of gentle strokes. If your cat leans in or rubs back, consent continues. If they freeze or flick their tail, respect their boundary.'}
        </p>
        <button
          onClick={() => onNavigate('academy')}
          className="text-xs font-bold text-teal-800 hover:text-teal-950 underline inline-flex items-center gap-1"
        >
          <span>{language === 'id' ? 'Buka Akademi Kucing Lengkap' : 'Open Full Cat Academy'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
