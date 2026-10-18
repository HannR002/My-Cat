import React from 'react';
import { AlertTriangle, ShieldAlert, HeartHandshake, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AnimalWelfareWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AnimalWelfareWarningModal: React.FC<AnimalWelfareWarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welfare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 overflow-hidden relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
            <ShieldAlert className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
              {language === 'id' ? 'Protokol Etika & Kesejahteraan' : 'Welfare & Ethics Protocol'}
            </span>
            <h3 id="welfare-modal-title" className="text-lg font-extrabold text-gray-900 leading-tight">
              {language === 'id' ? 'Peringatan Keamanan Kucing' : 'Cat Safety & Welfare Warning'}
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600 leading-relaxed mb-6">
          <p className="font-semibold text-rose-700 bg-rose-50/80 p-3 rounded-xl border border-rose-100">
            {language === 'id'
              ? 'JANGAN PUTAR SUARA INI DI DEKAT KUCING ANDA!'
              : 'DO NOT PLAY THIS SOUND NEAR REAL CATS!'}
          </p>
          <p>
            {language === 'id'
              ? 'Kategori "Marah & Peringatan" (desisan / geraman) disediakan HANYA untuk tujuan edukasi manusia guna mengenali sinyal ketakutan dan stres pada kucing.'
              : 'The "Defensive & Warning" category (hissing / growling) is provided SOLELY for human education to recognize feline stress and fear signals.'}
          </p>
          <p>
            {language === 'id'
              ? 'Memutar suara desisan di depan kucing sungguhan dapat memicu kecemasan akut, ketakutan, dan merusak rasa percaya kucing terhadap pemilik.'
              : 'Playing aggressive or defensive sounds in front of live cats can provoke acute fear, disorientation, and undermine their trust in you.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onCancel}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition"
          >
            {language === 'id' ? 'Batal (Jangan Putar)' : 'Cancel (Do Not Play)'}
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            {language === 'id' ? 'Saya Mengerti (Hanya Edukasi)' : 'I Understand (Edu Only)'}
          </button>
        </div>
      </div>
    </div>
  );
};
