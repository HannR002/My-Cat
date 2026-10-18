import React from 'react';
import { X, ExternalLink, Info, Award, User, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { AudioItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AudioInfoModalProps {
  item: AudioItem | null;
  onClose: () => void;
}

export const AudioInfoModal: React.FC<AudioInfoModalProps> = ({ item, onClose }) => {
  const { language, t } = useLanguage();

  if (!item) return null;

  const desc = language === 'id' ? item.description.id : item.description.en;
  const edu = language === 'id' ? item.educationalNote.id : item.educationalNote.en;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-info-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
          aria-label={t.closeBtn}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header badges */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              item.audioType === 'real'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : item.audioType === 'procedural_synth' || item.audioType === 'ai'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {item.audioType === 'real'
              ? t.realRecordingBadge
              : item.audioType === 'procedural_synth'
              ? (language === 'id' ? 'Sintetis Prosedural' : 'Procedural Synth')
              : item.audioType === 'ai'
              ? t.aiSyntheticBadge
              : t.userImportedBadge}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            ⏱ {item.duration} {t.durationSeconds}
          </span>
        </div>

        <h3 id="audio-info-title" className="text-xl font-black text-gray-900 leading-snug mb-3">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-5 bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100/60">
          {desc}
        </p>

        {/* Educational Note */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-2">
            <Info className="w-4 h-4 text-orange-600" />
            <span>{language === 'id' ? 'Makna & Konteks Perilaku' : 'Behavioral Meaning & Context'}</span>
          </div>
          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-gray-200 text-sm text-gray-700 leading-relaxed">
            {edu}
          </div>
        </div>

        {/* Attribution & License */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2.5 text-xs text-gray-600 mb-6">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-700">
                {language === 'id' ? 'Perekam / Kontributor:' : 'Recorded by / Contributor:'}
              </span>{' '}
              <span>{item.artist}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Award className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-700">
                {language === 'id' ? 'Lisensi Berkas:' : 'File License:'}
              </span>{' '}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                {item.license}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Volume2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-700">
                {language === 'id' ? 'Sumber Asli:' : 'Original Source:'}
              </span>{' '}
              <span className="break-all">{item.source}</span>
            </div>
          </div>

          {item.licenseUrl && (
            <div className="pt-1">
              <a
                href={item.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                <span>{language === 'id' ? 'Lihat Ketentuan Lisensi Lengkap' : 'View Full License Terms'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-95"
        >
          {t.closeBtn}
        </button>
      </div>
    </div>
  );
};
